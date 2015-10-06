// Copyright 2002-2015, University of Colorado

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

  /**
   *
   * @param {Vector2} position
   * @param {Vector2} velocity
   * @param {Vector2} acceleration
   * @param {number} mass
   * @param {boolean} exploded
   * @constructor
   */
  function BodyState( position, velocity, acceleration, mass, exploded ) {
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.mass = mass;
    this.exploded = exploded;
  }

  return inherit( Object, BodyState, {

    distanceSquared: function( position ) {
      return this.position.minus( position ).magnitudeSquared();
    },

    toString: function() {
      return 'BodyState{' + 'position=' + this.position + ', velocity=' + this.velocity + ', acceleration=' + this.acceleration +
             ', mass=' + this.mass + '}';
    }
  } );
} );