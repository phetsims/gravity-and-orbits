// Copyright 2014-2022, University of Colorado Boulder

/**
 * ModelState represents an immutable representation of the entire physical state and code for performing the
 * numerical integration which produces the next ModelState.
 * It is used by the GravityAndOrbitsPhysicsEngine to update the physics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Martin Veillette (Berea College)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PhysicalConstants from '../../../../phet-core/js/PhysicalConstants.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import BodyState from './BodyState.js';
import GravityAndOrbitsClock from './GravityAndOrbitsClock.js';

// constants
const XI = 0.1786178958448091;
const LAMBDA = -0.2123418310626054;
const CHI = -0.06626458266981849;

// reduce Vector2 allocation by reusing these Vector2 in computations
const velocity = new Vector2( 0, 0 ); // used in updatePositions()
const netForce = new Vector2( 0, 0 ); // used in getNetForce()

class ModelState {
  private readonly bodyStates: Array<BodyState>;
  private readonly clock: GravityAndOrbitsClock;
  private readonly adjustMoonOrbit: boolean;

  public constructor( bodyStates: Array<BodyState>, clock: GravityAndOrbitsClock, adjustMoonOrbit: boolean ) {
    this.bodyStates = bodyStates;
    this.clock = clock;
    this.adjustMoonOrbit = adjustMoonOrbit;
  }

  /**
   * Updates the model, producing the next ModelState
   */
  public getNextState( dt: number, gravityEnabledProperty: Property<boolean> ): this {

    if ( gravityEnabledProperty.get() ) {
      return this.getNextInteractingState( dt );
    }
    else {

      // gravity is not active, bodies are coasting;
      return this.getNextCoastingState( dt );
    }
  }

  /**
   * Finds the positions of the bodies after a time dt
   */
  private updatePositions( dt: number ): void {
    for ( let i = 0; i < this.bodyStates.length; i++ ) {
      const bodyState = this.bodyStates[ i ];
      velocity.setXY( bodyState.velocity.x * dt, bodyState.velocity.y * dt );
      bodyState.position.add( velocity );
    }
  }

  /**
   * Finds the velocities of the bodies after a time dt
   */
  private updateVelocities( dt: number ): void {
    this.updateAccelerations();
    for ( let i = 0; i < this.bodyStates.length; i++ ) {
      const bodyState = this.bodyStates[ i ];
      bodyState.velocity.add( bodyState.acceleration.multiplyScalar( dt ) );
    }
  }

  /**
   * Finds the current values of the accelerations
   */
  private updateAccelerations(): void {
    for ( let i = 0; i < this.bodyStates.length; i++ ) {
      const bodyState = this.bodyStates[ i ];
      const acceleration = this.getNetForce( bodyState ).divideScalar( bodyState.mass );
      bodyState.acceleration.setXY( acceleration.x, acceleration.y );
    }
  }

  /**
   * Update rotations of all bodies in the sim. Some bodies need to rotate so that during orbital motion they
   * always point toward the earth. Only some bodies require rotation.
   *
   * @param dt (seconds)
   */
  private updateRotations( dt: number ): void {
    for ( let i = 0; i < this.bodyStates.length; i++ ) {
      const bodyState = this.bodyStates[ i ];

      // only rotate if necessary
      if ( bodyState.rotationPeriod !== null ) {
        const rotation = this.getDeltaRotation( bodyState.rotationPeriod, dt );
        bodyState.rotation = bodyState.rotation + rotation;
      }
    }
  }

  /**
   * Get rotation of the body, based on the body's rotation period and the elapsed sim time.
   * @param rotationPeriod
   * @param dt - delta time (seconds)
   */
  private getDeltaRotation( rotationPeriod: number, dt: number ): number {

    // convert delta time to rotation in orbit
    // negative one so that rotation is counter clockwise (with orbital motion)
    return -Math.PI * 2 * dt / rotationPeriod;
  }

  /**
   * Sets all the accelerations to zero, useful when gravity is turned off
   */
  private setAccelerationToZero(): void {
    for ( let i = 0; i < this.bodyStates.length; i++ ) {
      this.bodyStates[ i ].acceleration = new Vector2( 0, 0 );
    }
  }

  /**
   * Gets the net force on the bodyState due to the other bodies
   */
  private getNetForce( bodyState: BodyState ): Vector2 {

    // use netForce to keep track of the net force, initialize to zero.
    netForce.setXY( 0, 0 );

    for ( let j = 0; j < this.bodyStates.length; j++ ) {

      // an object cannot act on itself
      if ( bodyState !== this.bodyStates[ j ] ) {

        // netForce is a mutable vector
        netForce.add( this.getTwoBodyForce( bodyState, this.bodyStates[ j ] ) );
      }
    }
    return netForce;
  }

  /**
   * Returns the force on the body source due to the body target
   */
  private getTwoBodyForce( source: BodyState, target: BodyState ): Vector2 {
    if ( source.position.equals( target.position ) ) {

      // Two bodies at exactly the same position would feel an infinite force.  In the physics computation, this would
      // appear as a divide by zero error.  Instead return a force of zero in this frame.  In the next frame they will
      // likely no longer be at the same spot, so will feel large force but without a divide by zero error.
      return Vector2.ZERO;
    }
    else if ( source.exploded || target.exploded ) {

      // ignore in the computation if that body has exploded
      return Vector2.ZERO;
    }
    else {

      const relativePosition = target.position.minus( source.position );
      const r = relativePosition.getMagnitude();
      const unitVector = relativePosition.normalized();

      const magnitude = PhysicalConstants.GRAVITATIONAL_CONSTANT * source.mass * target.mass / r / r;
      let fudgeFactor = 1;

      if ( this.adjustMoonOrbit && source.body.type === 'moon' && target.body.type === 'planet' ) {
        fudgeFactor = 10200;
      }
      return unitVector.multiplyScalar( magnitude * fudgeFactor );
    }
  }

  /**
   * Updates the model, producing the next ModelState when gravity is present
   */
  private getNextCoastingState( dt: number ): this {

    // update Positions
    this.updatePositions( dt );

    // update to Velocities are unnecessary since they stay constant

    // set the acceleration to zero.
    this.setAccelerationToZero();

    // update the body rotations
    this.updateRotations( dt );

    // return this ModelState mutated instead of a new ModelState with new Vector2 for performance reasons
    return this;
  }

  /**
   * Updates the model, producing the next ModelState when gravity is present
   */
  private getNextInteractingState( dt: number ): this {

    //-------------
    // Step One
    //--------------

    // update Positions
    this.updatePositions( XI * dt );  // net time: XI dt

    // update Velocities
    this.updateVelocities( ( 1 - 2 * LAMBDA ) * dt / 2 );// net time: (1 - 2 * LAMBDA) * dt / 2

    //-------------
    // Step Two
    //--------------

    // update Positions
    this.updatePositions( CHI * dt ); // net time: (XI+CHI) dt

    // update Velocities
    this.updateVelocities( LAMBDA * dt ); // net time: dt / 2

    //-------------
    // Step Three
    //--------------

    // update Positions
    this.updatePositions( ( 1 - 2 * ( CHI + XI ) ) * dt ); // net time: (1-(XI+CHI)) dt

    // update Velocities
    this.updateVelocities( LAMBDA * dt ); // net time: (1/2 + LAMBDA) dt

    //-------------
    // Step Four
    //--------------

    // update Positions
    this.updatePositions( CHI * dt ); // net time: (1-(XI)) dt

    // update Velocities
    // no update in velocities // net time: (1/2 + LAMBDA) dt

    //-------------
    // Step Five: last step, these are the final positions and velocities i.e. r(t+dt) and v(t+dt)
    //--------------

    // IMPORTANT: we need to update the velocities first

    // update Velocities
    this.updateVelocities( ( 1 - 2 * LAMBDA ) * dt / 2 ); // net time:  dt;

    // update Positions
    this.updatePositions( XI * dt ); // net time:  dt

    //-------------
    // Update the new acceleration
    //-------------
    this.updateAccelerations();

    // update the body rotations
    this.updateRotations( dt );

    // return this ModelState mutated instead of a new ModelState with new Vector2 for performance reasons
    return this;
  }

  /**
   * Get the BodyState for the specified index--future work could
   * change this signature to getState(Body body) since it would be safer.
   * See usage in GravityAndOrbitsPhysicsEngine constructor.
   */
  public getBodyState( index: number ): BodyState {
    return this.bodyStates[ index ];
  }
}

gravityAndOrbits.register( 'ModelState', ModelState );
export default ModelState;