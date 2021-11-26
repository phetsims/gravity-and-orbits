// Copyright 2014-2021, University of Colorado Boulder

/**
 * Provides the play area for a single GravityAndOrbitsScene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * @see GravityAndOrbitsScene
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import platform from '../../../../phet-core/js/platform.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import { Color } from '../../../../scenery/js/imports.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import gravityAndOrbitsStrings from '../../gravityAndOrbitsStrings.js';
import GravityAndOrbitsColors from '../GravityAndOrbitsColors.js';
import BodyNode from './BodyNode.js';
import DraggableVectorNode from './DraggableVectorNode.js';
import ExplosionNode from './ExplosionNode.js';
import GravityAndOrbitsGridNode from './GravityAndOrbitsGridNode.js';
import PathsCanvasNode from './PathsCanvasNode.js';
import TimeCounter from './TimeCounter.js';
import VectorNode from './VectorNode.js';
import ZoomControl from './ZoomControl.js';
import GravityAndOrbitsScene from '../GravityAndOrbitsScene.js';
import GravityAndOrbitsModel from '../model/GravityAndOrbitsModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';

const returnObjectsString = gravityAndOrbitsStrings.returnObjects;
const vString = gravityAndOrbitsStrings.v;

// constants
const SCALE = 0.8; // these numbers come from trying to match the original MLL port of this sim
const WIDTH = 790 * ( 1 / SCALE );
const HEIGHT = 618 * ( 1 / SCALE );
const STAGE_SIZE = new Bounds2( 0, 0, WIDTH, HEIGHT );
const buttonBackgroundColor = new Color( 255, 250, 125 );

class GravityAndOrbitsSceneView extends Rectangle {
  static STAGE_SIZE: Bounds2;
  static buttonBackgroundColor: Color;

  /**
   * Constructor for GravityAndOrbitsSceneView
   * @param {GravityAndOrbitsScene} scene
   * @param {GravityAndOrbitsModel} model
   * @param {Tandem} tandem
   */
  constructor( scene: GravityAndOrbitsScene, model: GravityAndOrbitsModel, tandem: Tandem ) {
    const forceScale = scene.forceScale;

    // each orbit mode has its own play area with a CanvasNode for rendering paths
    // each canvas should be excluded from the DOM when invisible, with the exception of iOS Safari,
    // which performs worse in this case when toggling visibility
    const excludeInvisible = !platform.mobileSafari;

    super( 0, 0, WIDTH, HEIGHT, { scale: SCALE, excludeInvisible: excludeInvisible } );

    const bodies = scene.physicsEngine.getBodies();

    this.addChild( new PathsCanvasNode( bodies, scene.transformProperty, model.showPathProperty, STAGE_SIZE ) );

    const forceVectorColorFill = PhetColorScheme.GRAVITATIONAL_FORCE;
    const forceVectorColorOutline = new Color( 64, 64, 64 );
    const velocityVectorColorFill = PhetColorScheme.VELOCITY;
    const velocityVectorColorOutline = new Color( 64, 64, 64 );

    // Use canvas coordinates to determine whether something has left the visible area
    const isReturnableProperties: DerivedProperty<boolean>[] = [];
    bodies.forEach( body => {
      const bodyNode = new BodyNode( body, body.labelAngle, model.isPlayingProperty, scene, tandem.createTandem( body.bodyNodeTandemName ) );
      const massReadoutNode = scene.massReadoutFactory( bodyNode, model.showMassProperty );
      this.addChild( bodyNode );
      bodyNode.addChild( massReadoutNode );

      const isReturnableProperty = new DerivedProperty( [ body.positionProperty, scene.zoomLevelProperty ], () => {

        // the return objects button should be visible when a body is out of bounds
        // and not at the rewind position
        const atRewindPosition = bodyNode.body.positionProperty.equalsRewindValue();
        return !STAGE_SIZE.intersectsBounds( bodyNode.bounds ) && !atRewindPosition;
      } );
      isReturnableProperties.push( isReturnableProperty );
    } );

    // Add gravity force vector nodes
    for ( let i = 0; i < bodies.length; i++ ) {

      const bodyNodeTandem = tandem.createTandem( bodies[ i ].bodyNodeTandemName );
      const gravityForceVectorNode = new VectorNode( bodies[ i ], scene.transformProperty, model.showGravityForceProperty,
        bodies[ i ].forceProperty, forceScale, forceVectorColorFill, forceVectorColorOutline, bodyNodeTandem.createTandem( 'gravityVectorNode' ) );
      this.addChild( gravityForceVectorNode );
    }

    // Add velocity vector nodes
    for ( let i = 0; i < bodies.length; i++ ) {
      if ( bodies[ i ].isMovableProperty.value ) {
        const bodyNodeTandem = tandem.createTandem( bodies[ i ].bodyNodeTandemName );
        this.addChild( new DraggableVectorNode( bodies[ i ], scene.transformProperty, model.showVelocityProperty,
          bodies[ i ].velocityProperty, scene.velocityVectorScale, velocityVectorColorFill, velocityVectorColorOutline,
          vString, bodyNodeTandem.createTandem( 'velocityVectorNode' ), {
            phetioInputEnabledPropertyInstrumented: true
          } ) );
      }
    }

    // Add explosion nodes, which are always in the scene graph but only visible during explosions
    for ( let i = 0; i < bodies.length; i++ ) {
      this.addChild( new ExplosionNode( bodies[ i ], scene.transformProperty ) );
    }

    // Add the node for the overlay grid, setting its visibility based on the model.showGridProperty
    const gridNode = new GravityAndOrbitsGridNode( scene.transformProperty, scene.gridSpacing, scene.gridCenter, 28 );
    model.showGridProperty.linkAttribute( gridNode, 'visible' );
    this.addChild( gridNode );

    this.addChild( new TimeCounter( scene.timeFormatter, scene.physicsEngine.clock, tandem.createTandem( 'timeCounter' ), {
      bottom: STAGE_SIZE.bottom - 20,
      right: STAGE_SIZE.right - 50,
      scale: 1.2
    } ) );

    // Add measuring tape
    if ( model.showMeasuringTape ) {

      const unitsProperty = new Property<object>( { name: gravityAndOrbitsStrings.kilometers, multiplier: 1 / 1000 } );
      const measuringTapeTandem = tandem.createTandem( 'measuringTapeNode' );
      const measuringTapeTextColorProperty = GravityAndOrbitsColors.foregroundProperty;

      const measuringTapeNode = new MeasuringTapeNode( unitsProperty, model.showMeasuringTapeProperty, {
        basePositionProperty: scene.measuringTapeStartPointProperty,
        tipPositionProperty: scene.measuringTapeEndPointProperty,
        textBackgroundColor: GravityAndOrbitsColors.measuringTapeTextBackgroundColorProperty,
        textColor: measuringTapeTextColorProperty,

        // allows distances to be measured if the planets go outside of model bounds,
        // see https://github.com/phetsims/gravity-and-orbits/issues/281
        isTipDragBounded: false,

        significantFigures: 0,

        tandem: measuringTapeTandem,
        visiblePropertyOptions: { phetioReadOnly: true } // controlled by a checkbox
      } );

      scene.transformProperty.link( transform => measuringTapeNode.setModelViewTransform( transform ) );
      scene.modelBoundsProperty.link( bounds => {
        const basePosition = measuringTapeNode.basePositionProperty.get();
        measuringTapeNode.setDragBounds( bounds! );

        // if the position of the base has changed due to modifying the
        // drag bounds, we want to subtract the difference from the position
        // of the tip so that the measured value remains constant
        if ( !measuringTapeNode.basePositionProperty.get().equals( basePosition ) ) {
          const difference = basePosition.minus( measuringTapeNode.basePositionProperty.get() );
          measuringTapeNode.tipPositionProperty.set( measuringTapeNode.tipPositionProperty.get().minus( difference ) );
        }
      } );

      this.addChild( measuringTapeNode );
    }

    if ( phet.chipper.queryParameters.dev ) {
      const draggableAreaNode = new Rectangle( 0, 0, 0, 0, { stroke: 'blue', lineWidth: 4 } );
      this.addChild( draggableAreaNode );

      scene.modelBoundsProperty.link( bounds => {
        if ( bounds ) {
          draggableAreaNode.setRectBounds( scene.transformProperty.get().modelToViewBounds( bounds ) );
        }
      } );
    }

    scene.modelBoundsProperty.link( bounds => {

      // Tell each of the bodies about the stage size (in model coordinates) so they know if they are out of bounds
      for ( let i = 0; i < bodies.length; i++ ) {
        bodies[ i ].boundsProperty.set( scene.transformProperty.get().viewToModelBounds( STAGE_SIZE ) );
      }
    } );

    // If any body is out of bounds, show a "return object" button
    const anythingReturnable = DerivedProperty.or( isReturnableProperties );

    const returnObjectsButton = new TextPushButton( returnObjectsString, {
      font: new PhetFont( 16 ),
      textFill: 'black',
      x: 100,
      y: 100,
      visiblePropertyOptions: { phetioReadOnly: true },
      enabledPropertyOptions: { phetioReadOnly: true },
      listener: () => {

        // the return button should behave exactly like the rewind button
        // all objects should be restored to their saved state, and then
        // pause the orbital mode
        scene.rewind();
        scene.isPlayingProperty.set( false );
      },
      tandem: tandem.createTandem( 'returnObjectsButton' )
    } );
    this.addChild( returnObjectsButton );

    anythingReturnable.linkAttribute( returnObjectsButton, 'visible' );

    const scaleControl = new ZoomControl( scene.zoomLevelProperty, tandem.createTandem( 'zoomControl' ), {
      top: STAGE_SIZE.top + 10
    } );
    scaleControl.left = scaleControl.width / 2;
    this.addChild( scaleControl );
  }
}

// @static
GravityAndOrbitsSceneView.STAGE_SIZE = STAGE_SIZE;
GravityAndOrbitsSceneView.buttonBackgroundColor = buttonBackgroundColor;

gravityAndOrbits.register( 'GravityAndOrbitsSceneView', GravityAndOrbitsSceneView );
export default GravityAndOrbitsSceneView;