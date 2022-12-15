// Copyright 2014-2022, University of Colorado Boulder

/**
 * A GravityAndOrbitsScene behaves like a screen, it has its own model, control panel, canvas, and remembers its state
 * when you leave and come back. It is created with defaults from SceneFactory.Mode.
 * <p/>
 * The sim was designed this way so that objects are replaced instead of mutated.
 * For instance, when switching from Mode 1 to Mode 2, instead of removing Mode 1 bodies from the model,
 * storing their state, and replacing with the Mode 2 bodies, this paradigm just replaces the entire model instance.
 * <p/>
 * The advantage of this approach is that model states, canvas states and control panels are always correct,
 * and it is impossible to end up with a bug in which you have a mixture of components from multiple modes.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
import Rectangle from '../../../dot/js/Rectangle.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Vector2Property from '../../../dot/js/Vector2Property.js';
import merge from '../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetioObject, { PhetioObjectOptions } from '../../../tandem/js/PhetioObject.js';
import Tandem from '../../../tandem/js/Tandem.js';
import IOType from '../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../tandem/js/types/ReferenceIO.js';
import gravityAndOrbits from '../gravityAndOrbits.js';
import GravityAndOrbitsConstants from './GravityAndOrbitsConstants.js';
import GravityAndOrbitsClock from './model/GravityAndOrbitsClock.js';
import GravityAndOrbitsPhysicsEngine from './model/GravityAndOrbitsPhysicsEngine.js';
import GravityAndOrbitsSceneView from './view/GravityAndOrbitsSceneView.js';
import { Node } from '../../../scenery/js/imports.js';
import GravityAndOrbitsModel from './model/GravityAndOrbitsModel.js';
import ModeConfig from './model/ModeConfig.js';
import BodyNode from './view/BodyNode.js';
import Body from './model/Body.js';
import Pair from './model/Pair.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import EnumerationProperty from '../../../axon/js/EnumerationProperty.js';
import TimeSpeed from '../../../scenery-phet/js/TimeSpeed.js';
import Multilink from '../../../axon/js/Multilink.js';
import optionize from '../../../phet-core/js/optionize.js';
import TProperty from '../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';

// constants
const PLAY_AREA_WIDTH = GravityAndOrbitsSceneView.STAGE_SIZE.width;
const PLAY_AREA_HEIGHT = GravityAndOrbitsSceneView.STAGE_SIZE.height;

type GravityAndOrbitsSceneOptions = {
  adjustMoonOrbit?: boolean;
  dt?: number;
  gridCenter?: Vector2;
} & PhetioObjectOptions;

type MeasuringTapeOptions = {
  tandem?: Tandem;
  units?: string;
};

type GravityAndOrbitsSceneImplementationOptions = Pick<GravityAndOrbitsSceneOptions, 'adjustMoonOrbit' | 'dt' | 'gridCenter'>;

class GravityAndOrbitsScene extends PhetioObject {
  public readonly activeProperty: BooleanProperty;
  public readonly iconImage: Node;
  public readonly modelBoundsProperty: Property<Bounds2 | null>;
  public readonly transformProperty: Property<ModelViewTransform2>;
  public readonly radioButtonTandemName: string;
  public readonly resetButtonTandemName: string;
  public readonly sceneView: GravityAndOrbitsSceneView;
  public readonly massControlPanelTandemName: string;
  public readonly forceScale: number;
  public readonly physicsEngine: GravityAndOrbitsPhysicsEngine;
  public readonly massReadoutFactory: ( arg0: BodyNode, arg1: Property<boolean> ) => Node;
  public readonly zoomLevelProperty: NumberProperty;
  public readonly velocityVectorScale: number;
  public readonly gridSpacing: number;
  public readonly gridCenter: Vector2;
  public readonly timeFormatter: ( numberProperty: TProperty<number>, tandem: Tandem ) => TReadOnlyProperty<string>;
  public readonly measuringTapeStartPointProperty: Vector2Property;
  public readonly measuringTapeEndPointProperty: Vector2Property;
  public readonly isPlayingProperty: BooleanProperty;
  public massControlPanel: Node | null;

  private readonly deviatedFromDefaultsProperty: BooleanProperty;
  private readonly tandemName: string;
  private readonly dt: number;
  private readonly rewindingProperty: BooleanProperty;
  private readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;
  private readonly pairs: Pair[];

  /**
   * @param model
   * @param modeConfig
   * @param timeFormatter
   * @param iconImage
   * @param velocityVectorScale
   * @param massReadoutFactory - returns a node for the representation
   * @param gridSpacing
   * @param tandem
   * @param sceneViewTandem
   * @param bodies
   * @param pairs
   * @param [providedOptions]
   */
  public constructor( model: GravityAndOrbitsModel, modeConfig: ModeConfig,
                      timeFormatter: ( numberProperty: TProperty<number>, tandem: Tandem ) => TReadOnlyProperty<string>,
                      iconImage: Node, velocityVectorScale: number,
                      massReadoutFactory: ( arg0: BodyNode, arg1: Property<boolean> ) => Node, gridSpacing: number, tandem: Tandem,
                      sceneViewTandem: Tandem, bodies: Body[], pairs: Pair[], providedOptions?: GravityAndOrbitsSceneOptions ) {

    const forceScale = modeConfig.forceScale;
    const initialMeasuringTapePosition = modeConfig.initialMeasuringTapePosition;
    const defaultZoomScale = modeConfig.zoom;
    const tandemName = tandem.name;
    const radioButtonTandemName = `${tandemName}RadioButton`;
    const resetButtonTandemName = `${tandemName}ResetButton`;
    const massControlPanelTandemName = `${tandemName}MassesControlPanel`;

    const options = optionize<GravityAndOrbitsSceneImplementationOptions>()( {
      gridCenter: new Vector2( 0, 0 ),
      dt: modeConfig.dt,
      adjustMoonOrbit: false
    }, providedOptions );
    const gridCenter = options.gridCenter;
    const dt = options.dt;

    super( {
      phetioDocumentation: 'A group of orbital masses which can be selected',
      phetioType: ReferenceIO( IOType.ObjectIO ),
      phetioState: false,
      tandem: tandem
    } );

    this.massControlPanel = null;

    this.activeProperty = new BooleanProperty( false );

    this.deviatedFromDefaultsProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'deviatedFromDefaultsProperty' ),
      phetioDocumentation: 'for internal PhET use only',
      phetioReadOnly: true
    } );
    const measuringTapePointOptions: MeasuringTapeOptions = {
      units: 'm'
    };

    const measuringTapeTandem = tandem.createTandem( 'measuringTape' );

    this.measuringTapeStartPointProperty = new Vector2Property( initialMeasuringTapePosition!.p1, merge( {
      tandem: measuringTapeTandem.createTandem( 'startPointProperty' )
    }, measuringTapePointOptions ) );
    this.measuringTapeEndPointProperty = new Vector2Property( initialMeasuringTapePosition!.p2, merge( {
      tandem: measuringTapeTandem.createTandem( 'endPointProperty' )
    }, measuringTapePointOptions ) );
    this.zoomLevelProperty = new NumberProperty( 1, {
      tandem: tandem.createTandem( 'zoomLevelProperty' ),
      range: GravityAndOrbitsConstants.ZOOM_RANGE
    } );

    this.radioButtonTandemName = radioButtonTandemName; // (read-only)
    this.resetButtonTandemName = resetButtonTandemName; // (read-only)
    this.tandemName = tandemName; // (read-only)
    this.massControlPanelTandemName = massControlPanelTandemName; // (read-only)

    this.dt = dt;
    this.forceScale = forceScale!;
    this.iconImage = iconImage;

    this.isPlayingProperty = model.isPlayingProperty;

    // How much to scale (shrink or grow) the velocity vectors; a mapping from meters/second to stage coordinates
    this.velocityVectorScale = velocityVectorScale;
    this.gridSpacing = gridSpacing; // in meters
    this.gridCenter = gridCenter;
    this.rewindingProperty = model.rewindingProperty; // save a reference to the rewinding property of p
    this.timeSpeedProperty = model.timeSpeedProperty;
    this.timeFormatter = timeFormatter;

    // Function that creates a Node to readout the mass for the specified body node (with the specified visibility flag)
    this.massReadoutFactory = massReadoutFactory;

    this.modelBoundsProperty = new Property<Bounds2 | null>( null ); // needed for dragListener bounds
    this.transformProperty = new Property( this.createTransform( defaultZoomScale, gridCenter ) );

    this.zoomLevelProperty.link( () => this.transformProperty.set( this.createTransform( defaultZoomScale, gridCenter ) ) );

    const clock = new GravityAndOrbitsClock( model.changeRewindValueProperty, dt, model.steppingProperty, this.timeSpeedProperty, tandem, tandem.createTandem( 'clock' ) );
    this.physicsEngine = new GravityAndOrbitsPhysicsEngine( clock, model.gravityEnabledProperty, options.adjustMoonOrbit );

    Multilink.multilink( [ model.isPlayingProperty, this.activeProperty ], ( playButtonPressed, active ) =>
      this.physicsEngine.clock.setRunning( playButtonPressed && active )
    );

    bodies.forEach( body => this.addBody( body ) );

    // {Node} - scenery node that depicts the play area for this scene
    this.sceneView = new GravityAndOrbitsSceneView( this, model, sceneViewTandem );

    this.pairs = pairs;

    // Save the new PhET-iO state as an initial configuration for this scene, but only if the state being set applies
    // to this scene.
    Tandem.PHET_IO_ENABLED && phet.phetio.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( ( state: Record<string, unknown> ) => {

      const phetioIDsToSet = Object.keys( state );
      for ( let i = 0; i < phetioIDsToSet.length; i++ ) {
        if ( phetioIDsToSet[ i ].startsWith( this.tandem.phetioID ) ) {
          this.saveState();
          break;
        }
      }
    } );
  }

  /**
   * Create the transform from model coordinates to stage coordinates
   */
  private createTransform( defaultZoomScale: number, gridCenter: Vector2 ): ModelViewTransform2 {
    const modelBounds = this.getTargetRectangle( defaultZoomScale * this.zoomLevelProperty.get(), gridCenter );
    this.modelBoundsProperty.set( modelBounds );
    const playAreaHeight = PLAY_AREA_HEIGHT - 50;
    const scale = playAreaHeight / PLAY_AREA_HEIGHT;
    const viewBounds = new Rectangle( 30, 0, PLAY_AREA_WIDTH * scale, PLAY_AREA_HEIGHT * scale );

    // Ensure the transform is square (not stretched or squashed), so that circles transform into circles and not ellipses
    assert && assert( Math.abs( modelBounds.width / modelBounds.height - viewBounds.width / viewBounds.height ) <= 1E-12 );

    return ModelViewTransform2.createRectangleInvertedYMapping( modelBounds, viewBounds );
  }

  /**
   * Find the rectangle that should be viewed in the model
   */
  private getTargetRectangle( targetScale: number, targetCenterModelPoint: Vector2 ): Rectangle {
    const z = targetScale * 1.5E-9;
    const modelWidth = PLAY_AREA_WIDTH / z;
    const modelHeight = PLAY_AREA_HEIGHT / z;
    return new Rectangle(
      -modelWidth / 2 + targetCenterModelPoint.x,
      -modelHeight / 2 + targetCenterModelPoint.y,
      modelWidth,
      modelHeight );
  }

  public getClock(): GravityAndOrbitsClock {
    return this.physicsEngine.clock;
  }

  public getBodies(): Body[] {
    return this.physicsEngine.getBodies();
  }

  /**
   * Set the deviated from defaults property - stored on the scene so that we don't have to use a closure for performance.
   */
  private setDeviatedFromDefaults(): void {
    this.deviatedFromDefaultsProperty.set( true );
  }

  private addBody( body: Body ): void {
    this.physicsEngine.addBody( body );

    body.massProperty.link( this.setDeviatedFromDefaults.bind( this ) );
    body.userModifiedPositionEmitter.addListener( this.setDeviatedFromDefaults.bind( this ) );
    // body.userModifiedVelocityEmitter.addListener( this.setDeviatedFromDefaults.bind( this ) ) ;

    // if the user modifies velocity, save state while paused
    body.userModifiedVelocityEmitter.addListener( () => {
      this.setDeviatedFromDefaults();
      if ( !this.isPlayingProperty.get() ) {
        this.saveState();
      }
    } );
  }

  public reset(): void {
    this.activeProperty.reset();
    this.deviatedFromDefaultsProperty.reset();
    this.measuringTapeStartPointProperty.reset();
    this.measuringTapeEndPointProperty.reset();
    this.zoomLevelProperty.reset();
    this.physicsEngine.clock.resetSimulationTime();

    this.physicsEngine.resetAll();
  }

  /**
   * Return the bodies to their original states when the user presses "reset" (not "reset all")
   *
   */
  public resetScene(): void {
    this.physicsEngine.resetBodies();
    this.deviatedFromDefaultsProperty.set( false );
    this.getClock().setSimulationTime( 0.0 );

    Tandem.PHET_IO_ENABLED && phet.phetio.phetioEngine.phetioStateEngine.restoreStateForPhetioObject( this );
  }

  /**
   * Restore the last set of initial conditions that were set while the sim was paused.
   */
  public rewind(): void {
    this.rewindingProperty.set( true );
    this.getClock().timeProperty.rewind();
    const bodies = this.physicsEngine.getBodies();
    bodies.forEach( body => body.rewind() );

    // update the force vectors accordingly
    this.physicsEngine.updateForceVectors();

    this.rewindingProperty.set( false );
  }

  /**
   * Save the state of the orbital system, which includes all rewindable properties of all bodies. This should only be
   * called when the sim is paused.
   */
  public saveState(): void {
    const bodies = this.physicsEngine.getBodies();
    for ( let i = 0; i < bodies.length; i++ ) {
      bodies[ i ].saveBodyState();
    }
    this.getClock().timeProperty.storeRewindValueNoNotify();
  }

  /**
   * @returns All bodies in the scene for which the mass can be changed
   */
  public getMassSettableBodies(): Body[] {
    const bodies = this.getBodies();
    const massSettableBodies = [];
    for ( let i = 0; i < bodies.length; i++ ) {
      if ( bodies[ i ].massSettable ) {
        massSettableBodies.push( bodies[ i ] );
      }
    }
    return massSettableBodies;
  }
}

gravityAndOrbits.register( 'GravityAndOrbitsScene', GravityAndOrbitsScene );
export default GravityAndOrbitsScene;
