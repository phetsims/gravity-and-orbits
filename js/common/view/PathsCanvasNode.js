// Copyright 2015, University of Colorado Boulder

/**
 * Shows the "trail" left behind by a Body as it moves over time, which disappears after about 2 orbits
 * This is named "Path" instead of "trail" since that is how it is supposed to appear to the students.
 *
 * Note: In the Java sim this was PathNode and there was one Node for each body. For performance reasons, it
 * has been changed so that there is just one CanvasNode shared between all of the bodies.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var Util = require( 'DOT/Util' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  // constants
  var STROKE_WIDTH = 3;

  /**
   *
   * @param {Body} bodies
   * @param {Property.<ModelViewTransform2>} transformProperty
   * @param {Property.<boolean>} visibleProperty
   * @param {Color} color
   * @param {Bounds2} canvasBounds
   * @param {object} [options]
   * @constructor
   */
  function PathsCanvasNode( bodies, transformProperty, visibleProperty, canvasBounds, options ) {

    options = _.extend( {
      maxPathLength: 1150 // max path length for the trace that follows the planets
    }, options );

    assert && assert( canvasBounds, 'Paths canvas must define bounds' );
    CanvasNode.call( this, { canvasBounds: canvasBounds } );
    var thisNode = this;
    var i;

    // points in view space - an array of arrays where each sub-array is the path points for a given body
    this.points = []; // @private
    for ( i = 0; i < bodies.length; i++ ) {
      this.points[ i ] = [];
    }

    // set the path length for the body so that the length is ~85% of the orbit, relative to the center
    // of the canvas bounds (and therefore the central body)
    bodies.forEach( function( body ) {
      var initialPosition = transformProperty.get().modelToViewPosition( body.positionProperty.initialValue );
      var distToCenter = canvasBounds.center.minus( initialPosition ).magnitude();
      var maxPathLength = 2 * Math.PI * distToCenter * 0.85 + body.pathLengthBuffer;
      body.maxPathLength = Math.max( maxPathLength, options.maxPathLength );
    } );

    this.bodies = bodies; // @private

    visibleProperty.link( function( isVisible ) {
      thisNode.visible = isVisible;
      for ( i = 0; i < bodies.length; i++ ) {
        thisNode.points[ i ] = [];
        thisNode.bodies[ i ].clearPath();
      }
      thisNode.invalidatePaint();
    } );

    for ( i = 0; i < bodies.length; i++ ) {

      (function( i ) {
        var body = bodies[ i ];

        body.pointAddedEmitter.addListener( function( point ) {
          var pt = transformProperty.get().modelToViewPosition( point );
          thisNode.points[ i ].push( pt );
          if ( visibleProperty.get() ) {
            thisNode.invalidatePaint();
          }
        } );

        // body.on( GravityAndOrbitsConstants.POINT_REMOVED, function() {
        //   if ( thisNode.points[ i ].length > 0 ) {
        //     thisNode.points[ i ].shift();
        //   }
        //   if ( visibleProperty.get() ) {
        //     thisNode.invalidatePaint();
        //   }
        // } );

        body.clearedEmitter.addListener( function() {
          while ( thisNode.points[ i ].length ) { thisNode.points[ i ].pop(); }
          thisNode.invalidatePaint();
        } );

      })( i );
    }

    transformProperty.link( function() {
      for ( i = 0; i < bodies.length; i++ ) {
        thisNode.bodies[ i ].clearPath();
      }
    } );

  }

  gravityAndOrbits.register( 'PathsCanvasNode', PathsCanvasNode );

  return inherit( CanvasNode, PathsCanvasNode, {

    /**
     * @private
     * @param {CanvasRenderingContext2D} context
     */
    paintCanvas: function( context ) {
      var j;

      // draw the path for each body one by one
      for ( var i = 0; i < this.bodies.length; i++ ) {
        var body = this.bodies[ i ];
        var points = this.points[ i ];

        var maxPathLength = body.maxPathLength;
        var fadePathLength = body.maxPathLength * 0.15; // fade length is ~15% of the path

        context.strokeStyle = body.color.toCSS();
        context.lineWidth = STROKE_WIDTH;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.beginPath();

        // Create and render the solid part as a path. New points are added at the tail of the list,
        // so easiest to render backwards for fade-out.
        if ( points.length > 0 ) {
          context.moveTo( points[ points.length - 1 ].x, points[ points.length - 1 ].y );
        }

        j = points.length - 1;
        this.pathLength = 0;
        var segDifX;
        var segDifY;
        var segLength;
        while ( this.pathLength < maxPathLength - fadePathLength && j > 0 ) {
          context.lineTo( points[ j ].x, points[ j ].y );
          if ( j > 1 ) {
            // incrememnt the path length by the length of the added segment
            segDifX = points[ j ].x - points[ j - 1 ].x;
            segDifY = points[ j ].y - points[ j - 1 ].y;

            // avoid using vector2 to prevent excess object allocation
            segLength = Math.sqrt( segDifX * segDifX + segDifY * segDifY );
            this.pathLength += segLength;
          }
          j--;
        }
        context.stroke();

        // Draw the faded out part
        context.lineCap = 'butt';
        var faded = body.color;

        while ( this.pathLength < maxPathLength && j > 0 ) {
          assert && assert( this.pathLength > maxPathLength - fadePathLength, 'the path length is too small to start fading' );

          // fade out a little bit each segment
          var alpha = Util.linear( maxPathLength - fadePathLength, maxPathLength, 1 , 0, this.pathLength );
          var fade = new Color( faded.r, faded.g, faded.b, alpha ); // todo - there is some overhead here

          context.beginPath();
          context.moveTo( points[ j + 1 ].x, points[ j + 1 ].y );
          context.lineTo( points[ j ].x, points[ j ].y );
          context.strokeStyle = fade.toCSS();
          context.stroke();

          // incrememnt the path length by the length of the added segment
          segDifX = points[ j ].x - points[ j - 1 ].x;
          segDifY = points[ j ].y - points[ j - 1 ].y;

          // avoid using vector2 to prevent excess object allocation
          segLength = Math.sqrt( segDifX * segDifX + segDifY * segDifY );
          this.pathLength += segLength;
          j--;
        }
      }
    }

  } );
} );
