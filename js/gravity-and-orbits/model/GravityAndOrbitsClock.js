// Copyright 2002-2011, University of Colorado
/**
 * The clock for this simulation.
 * The simulation time change (dt) on each clock tick is constant,
 * regardless of when (in wall time) the ticks actually happen.  This class works together with RewindableProperty, which has to know whether the simulation is stepping
 * to know whether to store a "save point" which can be restored.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var EventTimer = require( 'PHET_CORE/EventTimer' );
//  var RGBPhotonEventModel = require( 'COLOR_VISION/rgb/model/RGBPhotonEventModel' );

  // constants
  var CLOCK_FRAME_RATE = 25; // fps, frames per second (wall time)
  var DAYS_PER_TICK = 1;
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

    //private
//    ConstantDtClock.call( this, 1000 / CLOCK_FRAME_RATE, baseDTValue * timeSpeedScale.get() );

    var delay = 1000 / CLOCK_FRAME_RATE; // desired wall time change between ticks
    var dt = baseDTValue * timeSpeedScale.get(); // constant simulation time change between ticks
    this.eventTimer = new EventTimer( new EventTimer.ConstantEventModel( 120 ), function( timeElapsed ) {
    } );

//    var rateProperty = new Property();
//    var eventModel = new RGBPhotonEventModel();

    this.steppingProperty = stepping;
//    timeSpeedScale.link( function() {
//      eventTimer.setDt( baseDTValue * timeSpeedScale.get() );
//    } );
  }

  return inherit( Object, GravityAndOrbitsClock, {
      stepClockWhilePaused: function() {
        //See RewindableProperty which has to know whether the clock is running, paused, stepping, rewinding for application specific logic
        this.steppingProperty.set( true );
//        super.stepClockWhilePaused();
        this.steppingProperty.set( false );
      },
      stepClockBackWhilePaused: function() {
        this.steppingProperty.set( true );
//        super.stepClockBackWhilePaused();
        this.steppingProperty.set( false );
      }
    },
//statics
    {
      CLOCK_FRAME_RATE: CLOCK_FRAME_RATE,
      DAYS_PER_TICK: DAYS_PER_TICK,
      SECONDS_PER_DAY: SECONDS_PER_DAY,
      DEFAULT_DT: DEFAULT_DT
    } );
} );


//// Copyright 2002-2011, University of Colorado
//
//package edu.colorado.phet.gravityandorbits.model;
//
//import edu.colorado.phet.common.phetcommon.model.clock.ConstantDtClock;
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.util.SimpleObserver;
//
///**
// * The clock for this simulation.
// * The simulation time change (dt) on each clock tick is constant,
// * regardless of when (in wall time) the ticks actually happen.  This class works together with RewindableProperty, which has to know whether the simulation is stepping
// * to know whether to store a "save point" which can be restored.
// */
//public class GravityAndOrbitsClock extends ConstantDtClock {
//    public static final int CLOCK_FRAME_RATE = 25; // fps, frames per second (wall time)
//    public static final double DAYS_PER_TICK = 1;
//    public static final int SECONDS_PER_DAY = 86400;
//    public static final double DEFAULT_DT = DAYS_PER_TICK * SECONDS_PER_DAY;
//    private final Property<Boolean> stepping;
//
//    public GravityAndOrbitsClock( final double baseDTValue,//multiplied by scale to obtain true dt
//                                  Property<Boolean> stepping, final Property<Double> timeSpeedScale ) {
//        super( 1000 / CLOCK_FRAME_RATE, baseDTValue * timeSpeedScale.get() );
//        this.stepping = stepping;
//        timeSpeedScale.addObserver( new SimpleObserver() {
//            public void update() {
//                setDt( baseDTValue * timeSpeedScale.get() );
//            }
//        } );
//    }
//
//    @Override
//    public void stepClockWhilePaused() {
//        stepping.set( true );//See RewindableProperty which has to know whether the clock is running, paused, stepping, rewinding for application specific logic
//        super.stepClockWhilePaused();
//        stepping.set( false );
//    }
//
//    @Override
//    public void stepClockBackWhilePaused() {
//        stepping.set( true );
//        super.stepClockBackWhilePaused();
//        stepping.set( false );
//    }
//}
