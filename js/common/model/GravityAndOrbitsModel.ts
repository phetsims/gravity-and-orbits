// Copyright 2014-2023, University of Colorado Boulder

/**
 * The GravityAndOrbitsModel has an array of GravityAndOrbitsScenes, one scene for each configuration of bodies (e.g.,
 * Star + Planet). Each scene has its own model, canvas, clock, etc, which are used in place of this Module's data.
 * The model contains information that is shared across all modes, such as whether certain features are shown (such as
 * showing the gravitational force).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jonathan Olson (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 * @author John Blanco (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import PhysicalConstants from '../../../../phet-core/js/PhysicalConstants.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import SceneFactory from '../SceneFactory.js';
import GravityAndOrbitsScene from '../GravityAndOrbitsScene.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import TModel from '../../../../joist/js/TModel.js';

// constants
const G = PhysicalConstants.GRAVITATIONAL_CONSTANT;

class GravityAndOrbitsModel implements TModel {
  public readonly showGravityForceProperty: BooleanProperty;
  public readonly showVelocityProperty: BooleanProperty;
  public readonly showPathProperty: BooleanProperty;
  public readonly showGridProperty: BooleanProperty;
  public readonly showMassProperty: BooleanProperty;
  public readonly showMeasuringTapeProperty: BooleanProperty;
  public readonly sceneProperty: Property<GravityAndOrbitsScene>;
  public readonly isPlayingProperty: BooleanProperty;
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;
  public readonly gravityEnabledProperty: BooleanProperty;
  public readonly steppingProperty: BooleanProperty;
  public readonly rewindingProperty: BooleanProperty;
  public readonly showMassCheckbox: boolean;
  public readonly showMeasuringTape: boolean;
  public readonly sceneList: SceneFactory;

  public static readonly G = G;

  // True if when a value changes, it is allowed to be accepted as a new "initial condition" for an experiment
  public readonly changeRewindValueProperty: TReadOnlyProperty<boolean>;

  public constructor( showMeasuringTape: boolean, createModes: ( arg0: GravityAndOrbitsModel ) => SceneFactory, initialSceneIndex: number, showMassCheckbox: boolean, tandem: Tandem ) {

    // Properties that are common to all "modes" should live here.
    this.showGravityForceProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showGravityForceProperty' ) } );
    this.showVelocityProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showVelocityProperty' ) } );
    this.showPathProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showPathProperty' ) } );
    this.showGridProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showGridProperty' ) } );

    // The following 2 tandems should not appear in the "Model" screen
    this.showMassProperty = new BooleanProperty( false, { tandem: showMassCheckbox ? tandem.createTandem( 'showMassProperty' ) : Tandem.OPTIONAL } );
    this.showMeasuringTapeProperty = new BooleanProperty( false, { tandem: showMeasuringTape ? tandem.createTandem( 'showMeasuringTapeProperty' ) : Tandem.OPTIONAL } );

    assert && assert( phet.joist.sim.selectedScreenProperty, 'sim should exist by now' );
    this.isPlayingProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isPlayingProperty' ),
      phetioDocumentation: `This value is true if the play/pause button on this screen is in play mode. (It remains true even if the user switches screens. Use in combination with '${phet.joist.sim.selectedScreenProperty.tandem.phetioID}'.)`
    } );

    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      tandem: tandem.createTandem( 'timeSpeedProperty' )
    } );

    this.gravityEnabledProperty = new BooleanProperty( true, { tandem: tandem.createTandem( 'gravityEnabledProperty' ) } );
    this.steppingProperty = new BooleanProperty( false );
    this.rewindingProperty = new BooleanProperty( false );

    // these two booleans indicate whether or not to show the checkbox for measuring tape and mass.
    // they are false for the model screen and true for the toScale screen
    this.showMassCheckbox = showMassCheckbox;
    this.showMeasuringTape = showMeasuringTape;

    this.changeRewindValueProperty = new DerivedProperty( [
        this.isPlayingProperty,
        this.steppingProperty,
        this.rewindingProperty
      ], ( isPlaying, stepping, rewinding ) =>
        !isPlaying && !stepping && !rewinding
    );

    this.sceneList = createModes( this );

    this.sceneProperty = new Property( this.sceneList.scenes[ 0 ], {
      tandem: tandem.createTandem( 'sceneProperty' ),
      validValues: this.sceneList.scenes,
      phetioValueType: ReferenceIO( IOType.ObjectIO )
    } );
  }

  public step( dt: number ): void {

    // limit dt to 1 so there are no large jumps
    dt = Math.min( 1, dt );

    // collision animations should proceed outside of the model step
    const bodies = this.sceneProperty.get().physicsEngine.bodies;
    for ( let i = 0; i < bodies.length; i++ ) {
      const body = bodies[ i ];
      if ( body.isCollidedProperty.get() ) {
        body.clockTicksSinceExplosionProperty.value += 1;
      }
    }

    if ( this.isPlayingProperty.value ) {
      this.sceneProperty.value.getClock().step( dt );
    }
  }

  public getScenes(): GravityAndOrbitsScene[] {
    return this.sceneList.scenes;
  }

  public updateActiveModule(): void {
    for ( let i = 0; i < this.sceneList.scenes.length; i++ ) {
      this.sceneList.scenes[ i ].activeProperty.set( this.sceneList.scenes[ i ] === this.sceneProperty.value );
    }
  }

  public reset(): void {
    this.showGravityForceProperty.reset();
    this.showPathProperty.reset();
    this.showGridProperty.reset();
    this.showVelocityProperty.reset();
    this.showMassProperty.reset();
    this.isPlayingProperty.reset();
    this.timeSpeedProperty.reset();
    this.showMeasuringTapeProperty.reset();
    this.gravityEnabledProperty.reset();
    this.steppingProperty.reset();
    this.rewindingProperty.reset();
    this.sceneProperty.reset();
    for ( let i = 0; i < this.sceneList.scenes.length; i++ ) {
      this.sceneList.scenes[ i ].reset();
    }
  }
}

gravityAndOrbits.register( 'GravityAndOrbitsModel', GravityAndOrbitsModel );
export default GravityAndOrbitsModel;