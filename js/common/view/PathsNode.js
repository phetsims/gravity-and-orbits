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
  var GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );

  // constants
  var STROKE_WIDTH = 3;
  var NUM_FADE_POINTS = 25;

  /**
   *
   * @param {Body} bodies
   * @param {Property<ModelViewTransform2>} transformProperty
   * @param {Property<boolean>} visibleProperty
   * @param {Color} color
   * @param {Bounds2} canvasBounds
   * @constructor
   */
  function PathsNode( bodies, transformProperty, visibleProperty, canvasBounds ) {

    CanvasNode.call( this, { canvasBounds: canvasBounds } );
    var thisNode = this;
    var i;

    // points in view space - an array of arrays where each sub-array is the path points for a given body
    this.points = []; // @private
    for ( i = 0; i < bodies.length; i++ ) {
      this.points[ i ] = [];
    }

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

        body.on( GravityAndOrbitsConstants.POINT_ADDED, function( point ) {
          var pt = transformProperty.get().modelToViewPosition( point );
          thisNode.points[ i ].push( pt );
          if ( visibleProperty.get() ) {
            thisNode.invalidatePaint();
          }
        } );

        body.on( GravityAndOrbitsConstants.POINT_REMOVED, function() {
          if ( thisNode.points[ i ].length > 0 ) {
            thisNode.points[ i ].shift();
          }
          if ( visibleProperty.get() ) {
            thisNode.invalidatePaint();
          }
        } );

        body.on( GravityAndOrbitsConstants.CLEARED, function() {
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

  return inherit( CanvasNode, PathsNode, {

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

        var numSolidPoints = Math.min( body.maxPathLength - NUM_FADE_POINTS, points.length );
        var numTransparentPoints = points.length - numSolidPoints;

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
        for ( j = points.length - 2; j >= numTransparentPoints; j-- ) {
          context.lineTo( points[ j ].x, points[ j ].y );
        }
        context.stroke();

        // Draw the faded out part
        context.lineCap = 'butt';

        var faded = body.color;
        for ( j = numTransparentPoints - 1; j >= 0; j-- ) {

          // fade out a little bit each segment
          var a = (faded.a - 1 / NUM_FADE_POINTS);
          faded = new Color( faded.r, faded.g, faded.b, Math.max( 0, a ) );
          context.strokeStyle = faded.toCSS();
          context.beginPath();
          context.moveTo( points[ j + 1 ].x, points[ j + 1 ].y );
          context.lineTo( points[ j ].x, points[ j ].y );
          context.stroke();
        }
      }
    }

  } );
} );
