// Copyright 2014-2017, University of Colorado Boulder

/**
 * Shows an explosion for a smaller Body when it crashes into a larger Body.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BodyRenderer = require( 'GRAVITY_AND_ORBITS/common/view/BodyRenderer' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const LinearFunction = require( 'DOT/LinearFunction' );
  const Node = require( 'SCENERY/nodes/Node' );

  // constants
  const NUM_STEPS_FOR_ANIMATION = 10;

  class ExplosionNode extends Node {

    /**
     * @param {Body} body
     * @param {Property.<ModelViewTransform>} modelViewTransformProperty
     */
    constructor( body, modelViewTransformProperty ) {
      super();
      const self = this;

      // Function that computes the diameter as a function of the animation step
      const getDiameter = numClockTicksSinceExplosion => {
        if ( numClockTicksSinceExplosion < NUM_STEPS_FOR_ANIMATION / 2 ) {
          return new LinearFunction( 0, NUM_STEPS_FOR_ANIMATION / 2,
            1, self.getMaxViewDiameter( body, modelViewTransformProperty ) )( numClockTicksSinceExplosion );
        }
        else if ( numClockTicksSinceExplosion < NUM_STEPS_FOR_ANIMATION ) {
          return new LinearFunction( NUM_STEPS_FOR_ANIMATION / 2, NUM_STEPS_FOR_ANIMATION,
            self.getMaxViewDiameter( body, modelViewTransformProperty ), 1 )( numClockTicksSinceExplosion );
        }
        else {
          return 1.0;
        }
      };

      // Add the graphic that shows the explosion, uses the twinkle graphics from the cartoon sun
      this.addChild( this.getExplosionEdgeGraphic( body, getDiameter ) );

      // update the location of this node when the body changes, unless the body is collided
      body.positionProperty.link( () => {

        // this if statement wasn't in the Java version, but it looks weird to have the explosion drag with the mouse
        if ( !body.collidedProperty.get() ) {
          self.translation = modelViewTransformProperty.get().modelToViewPosition( body.positionProperty.get() );
        }
      } );
    }

    /**
     * Get a graphic for the explosion, linking diameter to the time steps since a collision occured.
     *
     * @param  {Body} body        description
     * @param  {function} getDiameter - diameter of graphic in view coordinates as function of time since collision
     * @returns {type}             description
     * REVIEW public/private
     */
    getExplosionEdgeGraphic( body, getDiameter ) {
      const yellowAndWhite = {
        highlight: 'white',
        color: 'yellow'
      };
      const getDoubleRadius = radius => radius * 2;
      const explosionEdgeGraphic = new BodyRenderer.SunRenderer( yellowAndWhite, 1, 14, getDoubleRadius );

      const explodedProperty = new DerivedProperty( [ body.collidedProperty, body.clockTicksSinceExplosionProperty ],
        ( collided, clockTicks ) => collided && clockTicks <= NUM_STEPS_FOR_ANIMATION );

      explodedProperty.linkAttribute( explosionEdgeGraphic, 'visible' );

      body.clockTicksSinceExplosionProperty.lazyLink( clockTicks => explosionEdgeGraphic.setDiameter( getDiameter( clockTicks ) ) );

      return explosionEdgeGraphic;
    }

    // @private
    getMaxViewDiameter( body, modelViewTransformProperty ) {
      return modelViewTransformProperty.get().modelToViewDeltaX( body.diameterProperty.get() ) * 2;
    }
  }

  return gravityAndOrbits.register( 'ExplosionNode', ExplosionNode );
} );