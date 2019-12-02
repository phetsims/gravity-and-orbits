// Copyright 2014-2019, University of Colorado Boulder

/**
 * The clock for this simulation.
 * The simulation time change (dt) on each clock tick is constant,
 * regardless of when (in wall time) the ticks actually happen. This class works together with RewindableProperty,
 * which has to know whether the simulation is stepping to know whether to store a "save point" which can be restored.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const EventTimer = require( 'PHET_CORE/EventTimer' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const NumberProperty = require( 'AXON/NumberProperty' );

  // constants
  // frames per second, was 25 in the Java version but changed to 60 for consistency and smoothness
  const CLOCK_FRAME_RATE = 60;

  // was 1 in the Java version, but changed to account for modification of CLOCK_FRAME_RATE
  const DAYS_PER_TICK = 1 / ( 60 / 25 );
  const SECONDS_PER_DAY = 86400;
  const DEFAULT_DT = DAYS_PER_TICK * SECONDS_PER_DAY;

  class GravityAndOrbitsClock {

    /**
     * @param {number} baseDTValue (multiplied by scale to obtain true dt)
     * @param {Property.<boolean>} steppingProperty
     * @param {Property.<number>} speedTypeProperty
     * @param {Tandem} tandem
     */
    constructor( baseDTValue, steppingProperty, speedTypeProperty, tandem ) {

      // @public (read-only)
      this.baseDTValue = baseDTValue;

      // @public
      this.isRunningProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'isRunningProperty' )
      } );
      this.timeProperty = new NumberProperty( 0, {
        tandem: tandem.createTandem( 'timeProperty' ),
        units: 'seconds'
      } );
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

      // Uses 1x dt for replicable trajectories, see https://github.com/phetsims/gravity-and-orbits/issues/253
      this.step( 1 / CLOCK_FRAME_RATE );
      this.steppingProperty.set( false );
    }

    /**
     * Set whether or not the model should be running.
     *
     * @param  {boolean} running
     */
    setRunning( running ) {
      this.isRunningProperty.set( running );
    }

    /**
     * Set the clock time.
     *
     * @param  {number} time description
     */
    setSimulationTime( time ) {
      this.timeProperty.set( time );
    }

    // @public
    getSimulationTime() {
      return this.timeProperty.get();
    }

    // @public
    resetSimulationTime() {
      this.timeProperty.reset();
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