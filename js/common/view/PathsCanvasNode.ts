// Copyright 2015-2022, University of Colorado Boulder

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

import Utils from '../../../../dot/js/Utils.js';
import { CanvasNode } from '../../../../scenery/js/imports.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import Body from '../model/Body.js';
import BodyTypeEnum from '../model/BodyTypeEnum.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';

// constants
const STROKE_WIDTH = 3;

class PathsCanvasNode extends CanvasNode {
  private readonly namedPoints: Record<string, NamedPoints>;
  private readonly transformProperty: Property<ModelViewTransform2>;
  private readonly bodies: Body[];
  private readonly pointAddedListener: ( point: Vector2, bodyName: BodyTypeEnum ) => void;
  private readonly pointRemovedListener: ( bodyName: BodyTypeEnum ) => void;
  private readonly clearedListener: ( bodyName: BodyTypeEnum ) => void;

  /**
   */
  public constructor( bodies: Body[], transformProperty: Property<ModelViewTransform2>, visibleProperty: Property<boolean>, canvasBounds: Bounds2 ) {

    assert && assert( canvasBounds, 'Paths canvas must define bounds' );
    super( {
      canvasBounds: canvasBounds,
      preventFit: true
    } );

    // a map tracking each body and its associated points
    this.namedPoints = {};
    for ( let i = 0; i < bodies.length; i++ ) {
      this.namedPoints[ bodies[ i ].type ] = new NamedPoints( bodies[ i ].type );
    }

    this.transformProperty = transformProperty;

    // transform all body points and re paint the canvas
    // disposal unnecessary, the canvas node exists for life of sim
    const updateNamedPoints = () => {
      for ( let i = 0; i < bodies.length; i++ ) {
        const body = bodies[ i ];

        // when the transform changes, we want to re-transform all points in a body
        // path and then re paint the canvas
        this.namedPoints[ body.type ].points = [];

        for ( let j = 0; j < body.path.length; j++ ) {
          const point = body.path[ j ];
          const pt = transformProperty.get().modelToViewPosition( point );
          this.namedPoints[ body.type ].points.push( pt );
        }
      }

      this.invalidatePaint();
    };
    transformProperty.link( updateNamedPoints );

    this.bodies = bodies;

    visibleProperty.link( isVisible => {
      this.visible = isVisible;

      // Don't clear the path during phet-io state set, see https://github.com/phetsims/gravity-and-orbits/issues/455
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {

        // Paths should restart from the body position when "Path" checkbox is checked
        for ( let i = 0; i < bodies.length; i++ ) {
          this.bodies[ i ].clearPath();
        }
      }
      updateNamedPoints();
    } );

    // listener for when a point is added, bound by thisNode
    // created to avoid excess closures every time a point is removed
    // @param bodyName - used to look up points associated with the desired body's trail
    this.pointAddedListener = ( point, bodyName ) => {
      const pt = transformProperty.get().modelToViewPosition( point );

      // 'this' is defined by bind in addListener
      const namedPoints = this.namedPoints[ bodyName ];
      namedPoints.points.push( pt );
      if ( visibleProperty.get() ) {
        this.invalidatePaint();
      }
    };

    // listener for when a point is removed, bound by thisNode
    // created to avoid excess closures every time a point is removed
    // @param bodyName - used to look up points associated with the desired body's trail
    this.pointRemovedListener = bodyName => {

      // 'this' defined by bind in addListener
      const namedPoints = this.namedPoints[ bodyName ];
      if ( namedPoints.points.length > 0 ) {
        namedPoints.points.shift();
      }
      if ( visibleProperty.get() ) {
        this.invalidatePaint();
      }
    };

    // listener for when date is cleared, bound by thisNode
    // created to avoid excess closures every time date is cleared
    // @param bodyName - used to look up points associated with the desired body's trail
    this.clearedListener = bodyName => {

      // 'this' is defined by bind
      const namedPoints = this.namedPoints[ bodyName ];
      while ( namedPoints.points.length ) { namedPoints.points.pop(); }
      this.invalidatePaint();
    };

    // add listeners to each body
    for ( let i = 0; i < bodies.length; i++ ) {
      const body = bodies[ i ];

      body.pointAddedEmitter.addListener( this.pointAddedListener.bind( this ) );
      body.pointRemovedEmitter.addListener( this.pointRemovedListener.bind( this ) );
      body.clearedEmitter.addListener( this.clearedListener.bind( this ) );
    }
  }

  public paintCanvas( context: CanvasRenderingContext2D ): void {
    let j;

    // draw the path for each body one by one
    for ( let i = 0; i < this.bodies.length; i++ ) {
      const body = this.bodies[ i ];
      const points = this.namedPoints[ body.type ].points;

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

      // Using "butt" is too "feathered" and makes the stroke look less bold than it should be
      context.lineCap = 'square';

      // Using "square" makes the stroke too wide, so we must trim it down accordingly.
      context.lineWidth = STROKE_WIDTH * 0.7;

      const faded = body.color;

      while ( body.pathLength < maxPathLength && j > 0 ) {
        assert && assert( body.pathLength > maxPathLength - fadePathLength, 'the path length is too small to start fading' );

        // fade out a little bit each segment
        const alpha = Utils.linear( maxPathLength - fadePathLength, maxPathLength, 1, 0, body.pathLength );

        // format without Color to avoid unnecessary allocation
        const fade = `rgba( ${faded.r}, ${faded.g}, ${faded.b}, ${alpha} )`;

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
}

gravityAndOrbits.register( 'PathsCanvasNode', PathsCanvasNode );

class NamedPoints {
  private readonly type: BodyTypeEnum;
  public points: Vector2[];

  /**
   * Named points assigns an array of points a name so that it can be looked up outside of a closure.
   */
  public constructor( type: BodyTypeEnum ) {
    this.type = type;
    this.points = [];
  }
}

gravityAndOrbits.register( 'NamedPoints', NamedPoints );

export default PathsCanvasNode;