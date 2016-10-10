// Copyright 2014-2015, University of Colorado Boulder

/**
 * The clock for this simulation.
 * The simulation time change (dt) on each clock tick is constant,
 * regardless of when (in wall time) the ticks actually happen. This class works together with RewindableProperty,
 * which has to know whether the simulation is stepping to know whether to store a "save point" which can be restored.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var EventTimer = require( 'PHET_CORE/EventTimer' );
  var GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  // constants
  // frames per second, was 25 in the Java version but changed to 60 for consistency and smoothness
  var CLOCK_FRAME_RATE = 60;

  // was 1 in the Java version, but changed to account for modification of CLOCK_FRAME_RATE
  var DAYS_PER_TICK = 1 / ( 60 / 25 );
  var SECONDS_PER_DAY = 86400;
  var DEFAULT_DT = DAYS_PER_TICK * SECONDS_PER_DAY;

  /**
   *
   * @param {number} baseDTValue (multiplied by scale to obtain true dt)
   * @param {Property.<boolean>} steppingProperty
   * @param {Property.<number>} timeSpeedScaleProperty
   * @constructor
   */
  function GravityAndOrbitsClock( baseDTValue, steppingProperty, timeSpeedScaleProperty ) {
    var self = this;

    // @private
    this.baseDTValue = baseDTValue;
    this.steppingWhilePausedDT = baseDTValue * GravityAndOrbitsConstants.STARTING_SPEED_SCALE;

    // @public
    this.runningProperty = new Property( false );
    this.simulationTimeProperty = new Property( 0 );
    this.dt = baseDTValue * timeSpeedScaleProperty.get();
    this.steppingProperty = steppingProperty;

    timeSpeedScaleProperty.link( function( timeSpeedScale ) {
      self.dt = baseDTValue * timeSpeedScale;
    } );
  }

  gravityAndOrbits.register( 'GravityAndOrbitsClock', GravityAndOrbitsClock );

  return inherit( Object, GravityAndOrbitsClock, {

    /**
     * Step the clock while paused, ignoring the current play speed and stepping by 1 / CLOCK_FRAME_RATE.
     *
     * @return {number}
     */
    stepClockWhilePaused: function() {

      // See RewindableProperty which has to know whether the clock is running, paused, stepping, rewinding for
      // application specific logic
      this.steppingProperty.set( true );

      // dt should be scaled by the initial speed when manually stepping
      var clockDT = this.dt; // store to revert after manual step
      this.dt = this.steppingWhilePausedDT;

      this.step( 1 / CLOCK_FRAME_RATE );
      this.steppingProperty.set( false );

      // revert dt to match the play speed
      this.dt = clockDT;
    },

    /**
     * Step the clock while paused, ignoring the current play speed and stepping by 1 / CLOCK_FRAME_RATE.
     *
     * @return {number}
     */
    stepClockBackWhilePaused: function() {
      this.steppingProperty.set( true );

      // dt should be scaled by the initial speed when manually stepping
      var clockDT = this.dt; // store to revert after manual step
      this.dt = this.steppingWhilePausedDT;

      this.step( -1 / CLOCK_FRAME_RATE );
      this.steppingProperty.set( false );


      // revert dt
      this.dt = clockDT;
    },

    /**
     * Set whether or not the model should be running.
     *
     * @param  {boolean} running
     */
    setRunning: function( running ) {
      this.runningProperty.set( running );
    },

    /**
     * Set the clock time.
     *
     * @param  {number} time description
     */
    setSimulationTime: function( time ) {
      this.simulationTimeProperty.set( time );
    },

    // @public
    getSimulationTime: function() {
      return this.simulationTimeProperty.get();
    },

    // @public
    resetSimulationTime: function() {
      this.simulationTimeProperty.reset();
    },

    /**
     * Add an event callback to the event timer, called every time the animation frame changes.
     *
     * @param  {number} stepFunction
     */
    addEventTimer: function( stepFunction ) {
      this.eventTimer = new EventTimer( new EventTimer.ConstantEventModel( CLOCK_FRAME_RATE ), stepFunction );
    },

    /**
     * Step the simulation by dt
     *
     * @param  {number} dt
     * @return {type}    description
     */
    step: function( dt ) {
      this.eventTimer.step( dt );
    }

  }, {
    CLOCK_FRAME_RATE: CLOCK_FRAME_RATE,
    DAYS_PER_TICK: DAYS_PER_TICK,
    SECONDS_PER_DAY: SECONDS_PER_DAY,
    DEFAULT_DT: DEFAULT_DT
  } );
} );
