// Copyright 2014-2022, University of Colorado Boulder

/**
 * The clock for this simulation.
 * The simulation time change (dt) on each clock tick is constant,
 * regardless of when (in wall time) the ticks actually happen. This class works together with RewindableProperty,
 * which has to know whether the simulation is stepping to know whether to store a "save point" which can be restored.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EventTimer from '../../../../phet-core/js/EventTimer.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import RewindableProperty from './RewindableProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

// constants
// frames per second, was 25 in the Java version but changed to 60 for consistency and smoothness
const CLOCK_FRAME_RATE = 60;

// was 1 in the Java version, but changed to account for modification of CLOCK_FRAME_RATE
const DAYS_PER_TICK = 1 / ( 60 / 25 );
const SECONDS_PER_DAY = 86400;
const DEFAULT_DT = DAYS_PER_TICK * SECONDS_PER_DAY;

class GravityAndOrbitsClock {
  public readonly baseDTValue: number;
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;
  public readonly timeProperty: RewindableProperty<number>;

  private readonly isRunningProperty: BooleanProperty;
  private readonly dt: number;
  private readonly steppingProperty: BooleanProperty;
  private interpolationRatio: number;
  private eventTimer: EventTimer | null;

  /**
   * @param changeRewindValueProperty
   * @param baseDTValue (multiplied by scale to obtain true dt)
   * @param steppingProperty
   * @param timeSpeedProperty
   * @param sceneTandem
   * @param tandem
   */
  public constructor( changeRewindValueProperty: TReadOnlyProperty<boolean>, baseDTValue: number, steppingProperty: BooleanProperty, timeSpeedProperty: EnumerationProperty<TimeSpeed>,
                      sceneTandem: Tandem, tandem: Tandem ) {

    // (read-only)
    this.baseDTValue = baseDTValue;

    this.isRunningProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isRunningProperty' ),
      phetioDocumentation: `This value is true when '${sceneTandem.phetioID}' is the selected scene and the play/pause button is in play mode. (It remains true even if the user switches screens. Use in combination with '${phet.joist.sim.selectedScreenProperty.tandem.phetioID}'.)`,
      phetioReadOnly: true
    } );

    this.timeProperty = new RewindableProperty<number>( changeRewindValueProperty, 0, {
      tandem: tandem.createTandem( 'timeProperty' ),
      phetioHighFrequency: true,
      units: 's',
      phetioReadOnly: true,
      phetioValueType: NumberIO
    } );
    this.dt = baseDTValue;
    this.steppingProperty = steppingProperty;

    this.timeSpeedProperty = timeSpeedProperty;

    // Fraction between old state=0 and new state=1
    this.interpolationRatio = 1;

    this.eventTimer = null;
  }

  /**
   * Step the clock while paused, ignoring the current play speed and stepping by 1 / CLOCK_FRAME_RATE.
   */
  public stepClockWhilePaused(): void {

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
  public setRunning( running: boolean ): void {
    this.isRunningProperty.set( running );
  }

  /**
   * Set the clock time.
   *
   * @param  {number} time description
   */
  public setSimulationTime( time: number ): void {
    this.timeProperty.set( time );
  }

  public getSimulationTime(): number {
    return this.timeProperty.get();
  }

  public resetSimulationTime(): void {
    this.timeProperty.reset();
  }

  /**
   * Add an event callback to the event timer, called every time the animation frame changes.
   *
   * @param  {function} stepFunction
   */
  public addEventTimer( stepFunction: ( dt: number ) => void ): void {
    assert && assert( !this.eventTimer, 'there can be only one event timer' );
    this.eventTimer = new EventTimer( new EventTimer.ConstantEventModel( CLOCK_FRAME_RATE ), stepFunction );
  }

  /**
   * Step the simulation by dt
   *
   * @param  {number} dt
   */
  public step( dt: number ): void {
    if ( this.eventTimer ) {
      this.eventTimer.step( dt );
      this.interpolationRatio = this.eventTimer.getRatio();
    }
  }

  // statics
  public static readonly SECONDS_PER_DAY = SECONDS_PER_DAY;
  public static readonly DEFAULT_DT = DEFAULT_DT;
}

gravityAndOrbits.register( 'GravityAndOrbitsClock', GravityAndOrbitsClock );
export default GravityAndOrbitsClock;