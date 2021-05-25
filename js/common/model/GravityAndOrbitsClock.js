// Copyright 2014-2021, University of Colorado Boulder

/**
 * The clock for this simulation.
 * The simulation time change (dt) on each clock tick is constant,
 * regardless of when (in wall time) the ticks actually happen. This class works together with RewindableProperty,
 * which has to know whether the simulation is stepping to know whether to store a "save point" which can be restored.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import EventTimer from '../../../../phet-core/js/EventTimer.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';

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
   * @param {EnumerationProperty.<TimeSpeed>} timeSpeedProperty
   * @param {Tandem} sceneTandem
   * @param {Tandem} tandem
   */
  constructor( baseDTValue, steppingProperty, timeSpeedProperty, sceneTandem, tandem ) {

    // @public (read-only)
    this.baseDTValue = baseDTValue;

    // @public
    this.isRunningProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isRunningProperty' ),
      phetioDocumentation: `This value is true when '${sceneTandem.phetioID}' is the selected scene and the play/pause button is in play mode. (It remains true even if the user switches screens. Use in combination with '${phet.joist.sim.screenProperty.tandem.phetioID}'.)`,
      phetioReadOnly: true
    } );
    this.timeProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'timeProperty' ),
      phetioHighFrequency: true,
      units: 's',
      phetioReadOnly: true
    } );
    this.dt = baseDTValue;
    this.steppingProperty = steppingProperty;

    // @public
    this.timeSpeedProperty = timeSpeedProperty;

    // Fraction between old state=0 and new state=1
    this.interpolationRatio = 1;
  }

  /**
   * Step the clock while paused, ignoring the current play speed and stepping by 1 / CLOCK_FRAME_RATE.
   * @public
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
   * @public
   *
   * @param  {boolean} running
   */
  setRunning( running ) {
    this.isRunningProperty.set( running );
  }

  /**
   * Set the clock time.
   * @public
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
   * @public
   *
   * @param  {number} stepFunction
   */
  addEventTimer( stepFunction ) {
    assert && assert( !this.eventTimer, 'there can be only one event timer' );
    this.eventTimer = new EventTimer( new EventTimer.ConstantEventModel( CLOCK_FRAME_RATE ), stepFunction );
  }

  /**
   * Step the simulation by dt
   * @public
   *
   * @param  {number} dt
   * @returns {type} description
   */
  step( dt ) {
    this.eventTimer.step( dt );
    this.interpolationRatio = this.eventTimer.getRatio();
  }
}

// statics
GravityAndOrbitsClock.CLOCK_FRAME_RATE = CLOCK_FRAME_RATE;
GravityAndOrbitsClock.DAYS_PER_TICK = DAYS_PER_TICK;
GravityAndOrbitsClock.SECONDS_PER_DAY = SECONDS_PER_DAY;
GravityAndOrbitsClock.DEFAULT_DT = DEFAULT_DT;

gravityAndOrbits.register( 'GravityAndOrbitsClock', GravityAndOrbitsClock );
export default GravityAndOrbitsClock;