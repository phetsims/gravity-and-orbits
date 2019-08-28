// Copyright 2015-2017, University of Colorado Boulder

/**
 * Shows the "trail" left behind by a Body as it moves over time, which disappears after about 2 orbits
 * This is named "Path" instead of "trail" since that is how it is supposed to appear to the students.
 *
 * Note: In the Java sim this was PathNode and there was one Node for each body. For performance reasons, it
 * has been changed so that there is just one CanvasNode shared between all of the bodies.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Util = require( 'DOT/Util' );

  // constants
  const STROKE_WIDTH = 3;

  /**
   *
   * @param {Body} bodies
   * @param {Property.<ModelViewTransform2>} transformProperty
   * @param {Property.<boolean>} visibleProperty
   * @param {Bounds2} canvasBounds
   * @param {Object} [options]
   * @constructor
   */
  function PathsCanvasNode( bodies, transformProperty, visibleProperty, canvasBounds, options ) {

    options = _.extend( {
      maxPathLength: 1150 // max path length for the trace that follows the planets
    }, options );

    assert && assert( canvasBounds, 'Paths canvas must define bounds' );
    CanvasNode.call( this, {
      canvasBounds: canvasBounds,
      preventFit: true
    } );
    const self = this;

    // @private - a map tracking each body and its associated points
    this.namedPoints = {}; // @private
    for ( let i = 0; i < bodies.length; i++ ) {
      this.namedPoints[ bodies[ i ].name ] = new NamedPoints( bodies[ i ].name );
    }

    // @private
    this.transformProperty = transformProperty;

    // transform all body points and re paint the canvas
    // disposal unnecessary, the canvas node exists for life of sim
    transformProperty.link( function( transform ) {
      for ( let i = 0; i < bodies.length; i++ ) {
        const body = bodies[ i ];

        // when the transform changes, we want to re-transform all points in a body
        // path and then re paint the canvas
        self.namedPoints[ body.name ].points = [];

        for ( let j = 0; j < body.path.length; j++ ) {
          const point = body.path[ j ];
          const pt = transformProperty.get().modelToViewPosition( point );
          self.namedPoints[ body.name ].points.push( pt );
        }
      }

      self.invalidatePaint();
    } );

    this.bodies = bodies; // @private

    visibleProperty.link( function( isVisible ) {
      self.visible = isVisible;
      for ( let i = 0; i < bodies.length; i++ ) {
        self.namedPoints[ bodies[ i ].name ].points = [];
        self.bodies[ i ].clearPath();
      }
      self.invalidatePaint();
    } );

    // @private - listener for when a point is added, bound by thisNode
    // created to avoid excess closures every time a point is removed
    // @param {string} bodyName - used to look up points associated with the desired body's trail
    this.pointAddedListener = function( point, bodyName ) {
      const pt = transformProperty.get().modelToViewPosition( point );

      // 'this' is defined by bind in addListener
      const namedPoints = this.namedPoints[ bodyName ];
      namedPoints.points.push( pt );
      if ( visibleProperty.get() ) {
        this.invalidatePaint();
      }
    };

    // @private - listener for when a point is removed, bound by thisNode
    // created to avoid excess closures every time a point is removed
    // @param {string} bodyName - used to look up points associated with the desired body's trail
    this.pointRemovedListener = function( bodyName ) {

      // 'this' defined by bind in addListener
      const namedPoints = this.namedPoints[ bodyName ];
      if ( namedPoints.points.length > 0 ) {
        namedPoints.points.shift();
      }
      if ( visibleProperty.get() ) {
        this.invalidatePaint();
      }
    };

    // @private - listener for when date is cleared, bound by thisNode
    // created to avoid excess closures every time date is cleared
    // @param {string} bodyName - used to look up points associated with the desired body's trail
    this.clearedListener = function( bodyName ) {

      // 'this' is defined by bind
      const namedPoints = this.namedPoints[ bodyName ];
      while ( namedPoints.points.length ) { namedPoints.points.pop(); }
      this.invalidatePaint();
    };

    // add listeners to each body
    for ( let i = 0; i < bodies.length; i++ ) {
      const body = bodies[ i ];

      body.pointAddedEmitter.addListener( self.pointAddedListener.bind( self ) );
      body.pointRemovedEmitter.addListener( self.pointRemovedListener.bind( self ) );
      body.clearedEmitter.addListener( self.clearedListener.bind( self ) );
    }
  }

  gravityAndOrbits.register( 'PathsCanvasNode', PathsCanvasNode );

  inherit( CanvasNode, PathsCanvasNode, {

    /**
     * @private
     * @param {CanvasRenderingContext2D} context
     */
    paintCanvas: function( context ) {
      let j;

      // draw the path for each body one by one
      for ( let i = 0; i < this.bodies.length; i++ ) {
        const body = this.bodies[ i ];
        const points = this.namedPoints[ body.name ].points;

        // max path length in view coordinates
        const maxPathLength = this.transformProperty.get().modelToViewDeltaX( body.maxPathLength );
        const fadePathLength = maxPathLength * 0.15; // fade length is ~15% of the path

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

        if ( body.name === 'PLANET' ) {
          // debugger;
        }

        j = points.length - 1;
        body.pathLength = 0;
        while ( body.pathLength < maxPathLength - fadePathLength && j > 0 ) {
          context.lineTo( points[ j ].x, points[ j ].y );
          if ( j > 1 ) {
            // increment the path length by the length of the added segment
            const segDifX = points[ j ].x - points[ j - 1 ].x;
            const segDifY = points[ j ].y - points[ j - 1 ].y;

            // avoid using vector2 to prevent excess object allocation
            const segLength = Math.sqrt( segDifX * segDifX + segDifY * segDifY );
            body.pathLength += segLength;
          }
          j--;
        }
        context.stroke();

        // Draw the faded out part
        context.lineCap = 'butt';
        const faded = body.color;

        while ( body.pathLength < maxPathLength && j > 0 ) {
          assert && assert( body.pathLength > maxPathLength - fadePathLength, 'the path length is too small to start fading' );

          // fade out a little bit each segment
          const alpha = Util.linear( maxPathLength - fadePathLength, maxPathLength, 1, 0, body.pathLength );

          // format without Color to avoid unnecessary allocation
          const fade = 'rgba( ' + faded.r + ', ' + faded.g + ', ' + faded.b + ', ' + alpha + ' )';

          context.beginPath();
          context.strokeStyle = fade;
          context.moveTo( points[ j + 1 ].x, points[ j + 1 ].y );
          context.lineTo( points[ j ].x, points[ j ].y );
          context.stroke();

          // increment the path length by the length of the added segment
          const segDifX = points[ j ].x - points[ j - 1 ].x;
          const segDifY = points[ j ].y - points[ j - 1 ].y;

          // avoid using vector2 to prevent excess object allocation
          const segLength = Math.sqrt( segDifX * segDifX + segDifY * segDifY );
          body.pathLength += segLength;
          j--;
        }

        if ( body.pathLength > maxPathLength ) {
          while ( j >= 0 ) {
            points.shift();
            j--;
          }
        }
      }
    }
  } );

  /**
   * Constructor.  Named points assigns an array of points a name so
   * that it can be looked up outside of a closure.
   *
   * @param  {string} name
   * @constructor
   */
  function NamedPoints( name ) {
    this.name = name;
    this.points = [];
  }

  gravityAndOrbits.register( 'NamedPoints', NamedPoints );

  inherit( Object, NamedPoints );

  return PathsCanvasNode;

} );
