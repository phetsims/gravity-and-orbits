// Copyright 2014-2015, University of Colorado Boulder

/**
 * Immutable state returned by the physics engine update algorithm, it is applied to the mutable Body.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  /**
   * @param {Vector2} position
   * @param {Vector2} velocity
   * @param {Vector2} acceleration
   * @param {number} mass
   * @param {boolean} exploded
   * @constructor
   */
  function BodyState( position, velocity, acceleration, mass, exploded ) {

    // @public
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.mass = mass;
    this.exploded = exploded;
  }

  gravityAndOrbits.register( 'BodyState', BodyState );

  return inherit( Object, BodyState, {

    /**
     * Get the distance squared from the body position to another.
     *
     * @param  {Vector2} position
     * @return {number}
     */
    distanceSquared: function( position ) {
      return this.position.minus( position ).magnitudeSquared();
    },

    /**
     * Useful for debugging - provides a string of documented property values.
     *
     * @return {string}
     */
    toString: function() {
      return 'BodyState{' + 'position=' + this.position + ', velocity=' + this.velocity +
             ', acceleration=' + this.acceleration + ', mass=' + this.mass + '}';
    }
  } );
} );
