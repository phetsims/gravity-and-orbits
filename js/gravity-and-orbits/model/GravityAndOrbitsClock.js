// Copyright 2002-2015, University of Colorado Boulder

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
   * @param {Property<boolean>} stepping
   * @param {Property<number>} timeSpeedScale
   * @constructor
   */
  function GravityAndOrbitsClock( baseDTValue, stepping, timeSpeedScale ) {
    var thisClock = this;

    this.runningProperty = new Property( false );
    this.simulationTimeProperty = new Property( 0 );
    this.dt = baseDTValue * timeSpeedScale.get();

    this.steppingProperty = stepping;
    timeSpeedScale.link( function() {
      thisClock.dt = baseDTValue * timeSpeedScale.get();
    } );
  }

  return inherit( Object, GravityAndOrbitsClock, {
    stepClockWhilePaused: function() {

      // See RewindableProperty which has to know whether the clock is running, paused, stepping, rewinding for
      // application specific logic
      this.steppingProperty.set( true );
      this.step( 1 / CLOCK_FRAME_RATE );
      this.steppingProperty.set( false );
    },

    stepClockBackWhilePaused: function() {
      this.steppingProperty.set( true );
      this.step( -1 / CLOCK_FRAME_RATE );
      this.steppingProperty.set( false );
    },

    setRunning: function( running ) {
      this.runningProperty.set( running );
    },

    setSimulationTime: function( time ) {
      this.simulationTimeProperty.set( time );
    },

    getSimulationTime: function() {
      return this.simulationTimeProperty.get();
    },

    resetSimulationTime: function() {
      this.simulationTimeProperty.reset();
    },

    addEventTimer: function( stepFunction ) {
      this.eventTimer = new EventTimer( new EventTimer.ConstantEventModel( CLOCK_FRAME_RATE ), stepFunction );
    },

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
