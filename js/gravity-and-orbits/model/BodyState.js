// Copyright 2002-2012, University of Colorado

/**
 * Immutable state returned by the physics engine update algorithm, it is applied to the mutable Body.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Serializable = require( 'java.io.Serializable' );
  var Vector2D = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2D' );

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
      return "BodyState{" + "position=" + position + ", velocity=" + velocity + ", acceleration=" + acceleration + ", mass=" + mass + '}';
    }
  } );
} );