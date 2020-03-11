// Copyright 2014-2020, University of Colorado Boulder

/**
 * Immutable state returned by the physics engine update algorithm, it is applied to the mutable Body.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import gravityAndOrbits from '../../gravityAndOrbits.js';

class BodyState {

  /**
   * @param {Body} body - the parent body from which this BodyState was created
   * @param {Vector2} position - in m
   * @param {Vector2} velocity - in m/s
   * @param {Vector2} acceleration - in m/s^2
   * @param {number} mass - in kg
   * @param {boolean} exploded
   * @param {number} rotation - The rotation of the body about its own origin in radians
   * @param {number} rotationPeriod - in seconds
   */
  constructor( body, position, velocity, acceleration, mass, exploded, rotation, rotationPeriod ) {

    // @public
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.mass = mass;
    this.exploded = exploded;
    this.rotation = rotation;
    this.rotationPeriod = rotationPeriod;
    this.body = body;
  }
}

gravityAndOrbits.register( 'BodyState', BodyState );
export default BodyState;