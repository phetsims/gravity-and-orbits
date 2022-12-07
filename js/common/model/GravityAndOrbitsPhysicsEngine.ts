// Copyright 2014-2022, University of Colorado Boulder

/**
 * This is the model for Gravity and Orbits; there is one GravityAndOrbitsPhysicsEngine per each GravityAndOrbitsScene, and it
 * uses ModelState to update the physics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import ModelState from './ModelState.js';
import Body from './Body.js';
import GravityAndOrbitsClock from './GravityAndOrbitsClock.js';
import Property from '../../../../axon/js/Property.js';
import BodyTypeEnum from './BodyTypeEnum.js';
import TEmitter from '../../../../axon/js/TEmitter.js';

/**
 * Return the smaller of two Body instances, for determining which survives a collision.
 * @param other
 * @param body
 * @returns the smaller body
 */
const getSmaller = ( other: Body, body: Body ): Body => other.massProperty.get() < body.massProperty.get() ? other : body;

/**
 * For use inside a map call, factored out here for performance
 */
const getBodyState = ( body: Body ) => body.toBodyState();

class GravityAndOrbitsPhysicsEngine {
  private readonly gravityEnabledProperty: Property<boolean>;
  private readonly adjustMoonOrbit: boolean;
  public readonly clock: GravityAndOrbitsClock;
  public readonly bodies: Body[];
  private readonly stepCompleteEmitter: TEmitter;

  /**
   * @param clock
   * @param gravityEnabledProperty flag to indicate whether gravity is on or off.
   * @param adjustMoonOrbit - in the "Model" screen, there is an additional force from the Earth on the Moon to keep it in orbit
   *                                  - This is necessary because the moon orbital radius is higher (so it is visible)
   */
  public constructor( clock: GravityAndOrbitsClock, gravityEnabledProperty: Property<boolean>, adjustMoonOrbit: boolean ) {

    this.gravityEnabledProperty = gravityEnabledProperty;
    this.adjustMoonOrbit = adjustMoonOrbit;

    this.clock = clock;

    // {Body[]} - contains the sun, moon, earth, satellite
    this.bodies = [];

    this.clock.addEventTimer( ( dt: number ) => {

      // NOTE: replacing step with stepModel fixes https://github.com/phetsims/gravity-and-orbits/issues/253
      // but introduces performance issues
      const elapsedTime = this.stepModel();
      this.clock.setSimulationTime( this.clock.getSimulationTime() + elapsedTime );
    } );

    // Have to update force vectors when gravity gets toggled on and off, otherwise displayed value won't update
    this.gravityEnabledProperty.link( this.updateForceVectors.bind( this ) );

    this.stepCompleteEmitter = new Emitter();
  }

  /**
   * Standardize the time step so that the play speed has no impact on the model. For a large time step, we break
   * apart the change in time into a series of time steps.  This ensures that this.step and the next model state is
   * calculated with consistent changes in time.
   *
   * @returns elapsed time
   */
  private stepModel(): number {

    this.bodies.forEach( body => body.storePreviousPosition() );

    // standardized time step - based on the slowest time step for the given orbital mode
    const smallestTimeStep = this.clock.baseDTValue * 0.13125;

    // get the number of times we will need to step the model based on the dt passed in
    const numberOfSteps = this.clock.timeSpeedProperty.value === TimeSpeed.SLOW ? 1 :
                          this.clock.timeSpeedProperty.value === TimeSpeed.NORMAL ? 4 :
                          7; // TimeSpeed.FAST
    // step the model by the smallest standard time step for the orbital mode
    for ( let i = 0; i < numberOfSteps; i++ ) {
      this.step( smallestTimeStep );

      // Signify that the model completed an entire step so that any batch operations may be invoked
      for ( let i = 0; i < this.bodies.length; i++ ) {
        this.bodies[ i ].modelStepped();
      }
    }

    this.stepCompleteEmitter.emit();

    return smallestTimeStep * numberOfSteps;
  }

  /**
   * Moves the model forward in time.  This function creates temporary state objects and calculates state values
   * based on the current state of the entire model. Afterwards, it applies the updated values to the body objects.
   * Finally, it checks for collisions between bodies.
   */
  private step( dt: number ): void {

    // Compute the next state for each body based on the current state of all bodies in the system.
    const bodyStates = this.bodies.map( getBodyState );
    const newState = new ModelState( bodyStates, this.clock, this.adjustMoonOrbit ).getNextState( dt, this.gravityEnabledProperty );

    // Set each body to its computed next state.
    // assumes that ModelState.getBodyState returns states in the same order as the container (ArrayList) used for
    // bodies. A possible future improvement would be
    // to switch to use ModelState.getState(Body), which would be safer.
    for ( let i = 0; i < this.bodies.length; i++ ) {
      this.bodies[ i ].updateBodyStateFromModel( newState.getBodyState( i ) );
    }
    // when two uncollided bodies collide, destroy the smaller
    for ( let j = 0; j < this.bodies.length; j++ ) {
      const body = this.bodies[ j ];
      for ( let k = 0; k < this.bodies.length; k++ ) {
        const other = this.bodies[ k ];
        if ( other !== body && !other.isCollidedProperty.value && !body.isCollidedProperty.value ) {
          if ( other.collidesWidth( body ) ) {
            getSmaller( other, body ).isCollidedProperty.set( true );
          }
        }
      }
    }
  }

  public resetAll(): void {
    this.resetBodies();
    this.clock.resetSimulationTime();
    this.updateForceVectors();
  }

  /**
   * Adds a body and updates the body's force vectors
   */
  public addBody( body: Body ): void {
    this.bodies.push( body );

    // update the force vectors when the position or mass changes
    body.userModifiedPositionEmitter.addListener( () => this.updateForceVectors() );
    body.massProperty.link( () => this.updateForceVectors() );
    this.updateForceVectors();
  }

  /**
   * Since we haven't (yet?) rewritten the gravity forces to auto-update when dependencies change, we update when
   * necessary:
   * (1) when a new body is added or
   * (2) when reset is pressed
   * This update is done by running the physics engine for dt=0.0 then applying the computed forces to the bodies.
   * Without this block of code, the force vectors would be zero on sim startup until the clock is started.
   */
  public updateForceVectors(): void {
    this.step( 0 );
  }

  /**
   * Returns a defensive copy of the bodies.
   */
  public getBodies(): Body[] {
    return this.bodies.slice( 0 ); // operate on a copy, firing could result in the listeners changing
  }

  public resetBodies(): void {
    this.bodies.forEach( body => body.resetAll() );
    this.updateForceVectors(); // has to be done separately since physics is computed as a batch
  }

  /**
   * Get the body associated with the name.
   */
  private getBody( type: BodyTypeEnum ): Body | null {
    for ( let i = 0; i < this.bodies.length; i++ ) {
      const body = this.bodies[ i ];

      if ( body.type === type ) {
        return body;
      }
    }
    return null;
  }
}

gravityAndOrbits.register( 'GravityAndOrbitsPhysicsEngine', GravityAndOrbitsPhysicsEngine );
export default GravityAndOrbitsPhysicsEngine;