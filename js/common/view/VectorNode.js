// Copyright 2014-2019, University of Colorado Boulder

/**
 * Draws a vector for a Body, such as a force vector or velocity vector.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const FORCE_SCALE = 76.0 / 5.179E15;

  class VectorNode extends Node {

    /**
     * @param {Body} body
     * @param {Property.<ModelViewTransform2>} transformProperty
     * @param {Property.<boolean>} visibleProperty
     * @param {Property.<Vector2>} vectorProperty
     * @param {number} scale
     * @param {Color} fill
     * @param {Color} outline
     */
    constructor( body, transformProperty, visibleProperty, vectorProperty, scale, fill, outline ) {
      super();

      this.body = body; // @private
      this.vectorProperty = vectorProperty; // @private
      this.body = body; // @private
      this.transformProperty = transformProperty; // @private
      this.scale = scale; // @private

      // Only show if the body hasn't collided
      const shouldBeShownProperty = new DerivedProperty(
        [ visibleProperty, body.collidedProperty ], ( visible, collided ) => visible && !collided
      );
      shouldBeShownProperty.linkAttribute( this, 'visible' );

      const arrowNode = new ArrowNode( 0, 0, 0, 0, {
        headHeight: 15,
        headWidth: 15,
        tailWidth: 5,
        fill: fill,
        stroke: outline,
        pickable: false,
        boundsMethod: 'none',
        isHeadDynamic: true,
        scaleTailToo: true
      } );

      this.propertyListener = visible => {
        if ( visible ) {
          const tail = this.getTail();
          const tip = this.getTip( tail );
          arrowNode.setTailAndTip( tail.x, tail.y, tip.x, tip.y );
        }
      };
      Property.multilink( [ visibleProperty, vectorProperty, body.positionProperty, transformProperty ], this.propertyListener );

      this.addChild( arrowNode );
    }

    // @private
    getTail() {
      return this.transformProperty.get().modelToViewPosition( this.body.positionProperty.get() );
    }

    // @protected
    getTip( tail ) {
      if ( typeof tail === 'undefined' ) {
        tail = this.getTail();
      }

      const minArrowLength = 10;
      let force = this.transformProperty.get().modelToViewDelta( this.vectorProperty.get().times( this.scale ) );

      if ( force.magnitude < minArrowLength && force.magnitude > 1E-12 ) {
        force = force.times( minArrowLength / force.magnitude );
      }
      return new Vector2( force.x + tail.x, force.y + tail.y );
    }

  }

  VectorNode.FORCE_SCALE = FORCE_SCALE;
  return gravityAndOrbits.register( 'VectorNode', VectorNode );

} );