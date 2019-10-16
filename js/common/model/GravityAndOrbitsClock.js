// Copyright 2014-2019, University of Colorado Boulder

/**
 * The clock for this simulation.
 * The simulation time change (dt) on each clock tick is constant,
 * regardless of when (in wall time) the ticks actually happen. This class works together with RewindableProperty,
 * which has to know whether the simulation is stepping to know whether to store a "save point" which can be restored.
 */
define( require => {
  'use strict';

  // modules
  const EventTimer = require( 'PHET_CORE/EventTimer' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );
  const Property = require( 'AXON/Property' );

  // constants
  // frames per second, was 25 in the Java version but changed to 60 for consistency and smoothness
  const CLOCK_FRAME_RATE = 60;

  // was 1 in the Java version, but changed to account for modification of CLOCK_FRAME_RATE
  const DAYS_PER_TICK = 1 / ( 60 / 25 );
  const SECONDS_PER_DAY = 86400;
  const DEFAULT_DT = DAYS_PER_TICK * SECONDS_PER_DAY;

  class GravityAndOrbitsClock {
    /**
     *
     * @param {number} baseDTValue (multiplied by scale to obtain true dt)
     * @param {Property.<boolean>} steppingProperty
     * @param {Property.<number>} speedTypeProperty
     */
    constructor( baseDTValue, steppingProperty, speedTypeProperty ) {

      // @public (read-only)
      this.baseDTValue = baseDTValue;

      this.steppingWhilePausedDT = baseDTValue * GravityAndOrbitsConstants.STARTING_SPEED_SCALE;

      // @public
      this.runningProperty = new Property( false );
      this.simulationTimeProperty = new Property( 0 );
      this.dt = baseDTValue;
      this.steppingProperty = steppingProperty;

      // @public
      this.speedTypeProperty = speedTypeProperty;
    }

    /**
     * Step the clock while paused, ignoring the current play speed and stepping by 1 / CLOCK_FRAME_RATE.
     *
     * @returns {number}
     */
    stepClockWhilePaused() {

      // See RewindableProperty which has to know whether the clock is running, paused, stepping, rewinding for
      // application specific logic
      this.steppingProperty.set( true );

      // dt should be scaled by the initial speed when manually stepping
      const clockDT = this.dt; // store to revert after manual step
      this.dt = this.steppingWhilePausedDT;

      this.step( 1 / CLOCK_FRAME_RATE );
      this.steppingProperty.set( false );

      // revert dt to match the play speed
      this.dt = clockDT;
    }

    /**
     * Step the clock while paused, ignoring the current play speed and stepping by 1 / CLOCK_FRAME_RATE.
     *
     * @returns {number}
     */
    stepClockBackWhilePaused() {
      this.steppingProperty.set( true );

      // dt should be scaled by the initial speed when manually stepping
      const clockDT = this.dt; // store to revert after manual step
      this.dt = this.steppingWhilePausedDT;

      this.step( -1 / CLOCK_FRAME_RATE );
      this.steppingProperty.set( false );


      // revert dt
      this.dt = clockDT;
    }

    /**
     * Set whether or not the model should be running.
     *
     * @param  {boolean} running
     */
    setRunning( running ) {
      this.runningProperty.set( running );
    }

    /**
     * Set the clock time.
     *
     * @param  {number} time description
     */
    setSimulationTime( time ) {
      this.simulationTimeProperty.set( time );
    }

    // @public
    getSimulationTime() {
      return this.simulationTimeProperty.get();
    }

    // @public
    resetSimulationTime() {
      this.simulationTimeProperty.reset();
    }

    /**
     * Add an event callback to the event timer, called every time the animation frame changes.
     *
     * @param  {number} stepFunction
     */
    addEventTimer( stepFunction ) {
      this.eventTimer = new EventTimer( new EventTimer.ConstantEventModel( CLOCK_FRAME_RATE ), stepFunction );
    }

    /**
     * Step the simulation by dt
     *
     * @param  {number} dt
     * @returns {type} description
     */
    step( dt ) {
      this.eventTimer.step( dt );
    }
  }

  // statics
  GravityAndOrbitsClock.CLOCK_FRAME_RATE = CLOCK_FRAME_RATE;
  GravityAndOrbitsClock.DAYS_PER_TICK = DAYS_PER_TICK;
  GravityAndOrbitsClock.SECONDS_PER_DAY = SECONDS_PER_DAY;
  GravityAndOrbitsClock.DEFAULT_DT = DEFAULT_DT;

  return gravityAndOrbits.register( 'GravityAndOrbitsClock', GravityAndOrbitsClock );
} );