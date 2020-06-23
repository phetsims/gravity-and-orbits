// Copyright 2014-2020, University of Colorado Boulder

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
import Bounds2 from '../../../dot/js/Bounds2.js';
import Rectangle from '../../../dot/js/Rectangle.js';
import Vector2 from '../../../dot/js/Vector2.js';
import merge from '../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetioObject from '../../../tandem/js/PhetioObject.js';
import ObjectIO from '../../../tandem/js/types/ObjectIO.js';
import ReferenceIO from '../../../tandem/js/types/ReferenceIO.js';
import gravityAndOrbits from '../gravityAndOrbits.js';
import GravityAndOrbitsConstants from './GravityAndOrbitsConstants.js';
import GravityAndOrbitsClock from './model/GravityAndOrbitsClock.js';
import GravityAndOrbitsPhysicsEngine from './model/GravityAndOrbitsPhysicsEngine.js';
import GravityAndOrbitsSceneView from './view/GravityAndOrbitsSceneView.js';

// constants
const PLAY_AREA_WIDTH = GravityAndOrbitsSceneView.STAGE_SIZE.width;
const PLAY_AREA_HEIGHT = GravityAndOrbitsSceneView.STAGE_SIZE.height;

class GravityAndOrbitsScene extends PhetioObject {

  /**
   * Create a new GravityAndOrbitsScene that shares ModeListParameterList values with other modes
   * @param {GravityAndOrbitsModel} model
   * @param {ModeConfig} modeConfig
   * @param {function.<number, string>} timeFormatter
   * @param {Node} iconImage
   * @param {number} velocityVectorScale
   * @param {function.<BodyNode, Property.<boolean>, Node>} massReadoutFactory - returns a node for the representation
   * @param {number} gridSpacing
   * @param {Tandem} tandem
   * @param {Tandem} sceneViewTandem
   * @param {Body[]} bodies
   * @param {Pair[]} pairs
   * @param {Object} [options]
   */
  constructor( model, modeConfig, timeFormatter, iconImage, velocityVectorScale, massReadoutFactory, gridSpacing, tandem,
               sceneViewTandem, bodies, pairs, options ) {

    const forceScale = modeConfig.forceScale;
    const initialMeasuringTapePosition = modeConfig.initialMeasuringTapePosition;
    const defaultZoomScale = modeConfig.zoom;
    const tandemName = tandem.name;
    const radioButtonTandemName = `${tandemName}Button`;
    const resetButtonTandemName = `${tandemName}ResetButton`;
    const massControlPanelTandemName = `${tandemName}MassesControlPanel`;

    options = merge( {
      gridCenter: new Vector2( 0, 0 ),
      dt: modeConfig.dt,
      adjustMoonOrbit: false
    }, options );
    const gridCenter = options.gridCenter;
    const dt = options.dt;

    super( {
      phetioDocumentation: 'A group of orbital masses which can be selected',
      phetioType: ReferenceIO( ObjectIO ),
      tandem: tandem
    } );

    this.activeProperty = new BooleanProperty( false );

    this.deviatedFromDefaultsProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'deviatedFromDefaultsProperty' ),
      phetioDocumentation: 'Internal use only'
    } );
    const measuringTapePointOptions = {
      units: 'm'
    };
    this.measuringTapeStartPointProperty = new Property( initialMeasuringTapePosition.p1, measuringTapePointOptions );
    this.measuringTapeEndPointProperty = new Property( initialMeasuringTapePosition.p2, measuringTapePointOptions );
    this.zoomLevelProperty = new NumberProperty( 1, {
      tandem: tandem.createTandem( 'zoomLevelProperty' ),
      range: GravityAndOrbitsConstants.ZOOM_RANGE
    } );

    this.radioButtonTandemName = radioButtonTandemName; // @public (read-only)
    this.resetButtonTandemName = resetButtonTandemName; // @public (read-only)
    this.tandemName = tandemName; // @public (read-only)
    this.massControlPanelTandemName = massControlPanelTandemName; // @public (read-only)

    this.dt = dt; // @private
    this.forceScale = forceScale; // @private
    this.iconImage = iconImage; // @private

    // @private
    this.isPlayingProperty = model.isPlayingProperty;

    // How much to scale (shrink or grow) the velocity vectors; a mapping from meters/second to stage coordinates
    this.velocityVectorScale = velocityVectorScale; // @public
    this.gridSpacing = gridSpacing; // @public - in meters
    this.gridCenter = gridCenter; // @public
    this.rewindingProperty = model.rewindingProperty; // save a reference to the rewinding property of p
    this.timeSpeedProperty = model.timeSpeedProperty; // @public
    this.timeFormatter = timeFormatter; // @public

    // Function that creates a Node to readout the mass for the specified body node (with the specified visibility flag)
    this.massReadoutFactory = massReadoutFactory;

    this.modelBoundsProperty = new Property(); // @public - needed for movableDragHandler bounds
    this.transformProperty = new Property( this.createTransform( defaultZoomScale, gridCenter ) ); // @public

    this.zoomLevelProperty.link( () => this.transformProperty.set( this.createTransform( defaultZoomScale, gridCenter ) ) );

    // @private
    const clock = new GravityAndOrbitsClock( dt, model.steppingProperty, this.timeSpeedProperty, tandem, tandem.createTandem( 'clock' ) );
    this.physicsEngine = new GravityAndOrbitsPhysicsEngine( clock, model.gravityEnabledProperty, options.adjustMoonOrbit );

    Property.multilink( [ model.isPlayingProperty, this.activeProperty ], ( playButtonPressed, active ) =>
      this.physicsEngine.clock.setRunning( playButtonPressed && active )
    );

    bodies.forEach( body => this.addBody( body ) );

    // @public {Node} - scenery node that depicts the play area for this scene
    this.sceneView = new GravityAndOrbitsSceneView( this, model, sceneViewTandem );

    // @private (phet-io only)
    this.pairs = pairs;
  }

  /**
   * Create the transform from model coordinates to stage coordinates
   *
   * @param {number} defaultZoomScale
   * @param {Vector2} gridCenter
   * @returns {ModelViewTransform2}
   * @private
   */
  createTransform( defaultZoomScale, gridCenter ) {
    const targetRectangle = this.getTargetRectangle( defaultZoomScale * this.zoomLevelProperty.get(), gridCenter );
    const minX = targetRectangle.x;
    const minY = targetRectangle.y;
    const maxX = targetRectangle.x + targetRectangle.width;
    const maxY = targetRectangle.y + targetRectangle.height;
    const modelBounds = new Bounds2( minX, minY, maxX, maxY );
    this.modelBoundsProperty.set( modelBounds );
    const viewTranslation = 50;
    return ModelViewTransform2.createRectangleInvertedYMapping(
      modelBounds, new Bounds2( 0, -viewTranslation, PLAY_AREA_WIDTH, PLAY_AREA_HEIGHT - viewTranslation ) );
  }

  /**
   * Find the rectangle that should be viewed in the model
   * @param targetScale
   * @param targetCenterModelPoint
   * @returns {Rectangle}
   * @private
   */
  getTargetRectangle( targetScale, targetCenterModelPoint ) {
    const z = targetScale * 1.5E-9;
    const modelWidth = PLAY_AREA_WIDTH / z;
    const modelHeight = PLAY_AREA_HEIGHT / z;
    return new Rectangle(
      -modelWidth / 2 + targetCenterModelPoint.x,
      -modelHeight / 2 + targetCenterModelPoint.y,
      modelWidth,
      modelHeight );
  }

  // @public
  getClock() {
    return this.physicsEngine.clock;
  }

  // @public
  getBodies() {
    return this.physicsEngine.getBodies();
  }

  /**
   * Set the deviated from defaults property - stored on the scene so that we don't have to use a closure for performance.
   *
   * @private
   */
  setDeviatedFromDefaults() {
    this.deviatedFromDefaultsProperty.set( true );
  }

  /**
   * @public
   * @param body
   */
  addBody( body ) {
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

  /**
   * @public
   * @override
   */
  reset() {
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
   * @public
   */
  resetScene() {
    this.physicsEngine.resetBodies();
    this.deviatedFromDefaultsProperty.set( false );
    this.getClock().setSimulationTime( 0.0 );
  }

  /**
   * Restore the last set of initial conditions that were set while the sim was paused.
   *
   * @public
   */
  rewind() {
    this.rewindingProperty.set( true );
    this.getClock().setSimulationTime( 0.0 );
    const bodies = this.physicsEngine.getBodies();
    for ( let i = 0; i < bodies.length; i++ ) {
      bodies[ i ].rewind();
    }

    // update the force vectors accordingly
    this.physicsEngine.updateForceVectors();

    this.rewindingProperty.set( false );
  }

  /**
   * Save the state of the orbital system, which includes all rewindable properties
   * of all bodies. This should only be called when the sim is paused.
   * @public
   */
  saveState() {
    assert && assert( !this.isPlayingProperty.get(), 'saveState should only be called when sim paused' );

    const bodies = this.physicsEngine.getBodies();
    for ( let i = 0; i < bodies.length; i++ ) {
      bodies[ i ].saveBodyState();
    }
  }

  /**
   * @public
   * @returns {Array.<Body>} - All bodies in the scene for which the mass can be changed
   */
  getMassSettableBodies() {
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
