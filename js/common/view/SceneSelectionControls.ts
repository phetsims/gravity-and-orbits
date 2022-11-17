// Copyright 2015-2022, University of Colorado Boulder

/**
 * Container for scene selection controls.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Color, HStrut, Image, Node } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import resetArrow_png from '../../../../scenery-phet/images/resetArrow_png.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsColors from '../GravityAndOrbitsColors.js';
import Property from '../../../../axon/js/Property.js';
import GravityAndOrbitsScene from '../GravityAndOrbitsScene.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Interruptable from '../model/Interruptable.js';

type SceneSelectionControlsOptions = {
  tandem: Tandem;
};

class SceneSelectionControls extends Node {

  /**
   * @param sceneProperty
   * @param modes
   * @param [providedOptions] - This object contains options for main node of planet menu.
   */
  public constructor( sceneProperty: Property<GravityAndOrbitsScene>, modes: GravityAndOrbitsScene[], screenView: Interruptable, providedOptions?: Partial<SceneSelectionControlsOptions> ) {
    super( providedOptions );
    const options: SceneSelectionControlsOptions = merge( { tandem: Tandem.OPTIONAL }, providedOptions ) as SceneSelectionControlsOptions;

    const content = modes.map( scene => {
      return ( {
        value: scene,
        createNode: ( tandem: Tandem ) => scene.iconImage,
        tandemName: scene.radioButtonTandemName
      } );
    } );

    const radioButtonGroup = new RectangularRadioButtonGroup( sceneProperty, content, {
      spacing: 0,
      touchAreaYDilation: 0, // reduce to 0 to prevent overlap between buttons
      radioButtonOptions: {
        baseColor: 'rgba(0,0,0,0)',
        cornerRadius: 5,
        xMargin: 5,
        yMargin: 5,
        buttonAppearanceStrategyOptions: {
          selectedStroke: GravityAndOrbitsColors.foregroundProperty,
          selectedLineWidth: 2,
          deselectedLineWidth: 0
        }
      },
      tandem: options.tandem.createTandem( 'sceneSelectionRadioButtonGroup' )
    } );

    this.addChild( radioButtonGroup );

    const resetButtonTuples: Array<{ container: Node; sceneResetButton: SceneResetButton }> = modes.map( scene => {

      // Extra level so visibilty can be controlled by PhET-iO
      const sceneResetButton = new SceneResetButton( scene, screenView, {
        tandem: options.tandem.createTandem( scene.resetButtonTandemName )
      } );

      return {
        container: new Node( {
          children: [ sceneResetButton ]
        } ),
        sceneResetButton: sceneResetButton
      };
    } );

    resetButtonTuples.forEach( resetButtonTuple => this.addChild( resetButtonTuple.container ) );

    const updateResetButtons = () => {
      const selectedScene = sceneProperty.value;
      resetButtonTuples.forEach( resetButtonTuple => {

        const visible = selectedScene === resetButtonTuple.sceneResetButton.scene;
        resetButtonTuple.container.visible = visible;
        if ( visible ) {
          resetButtonTuple.container.leftCenter = radioButtonGroup.getButtonForValue( selectedScene ).rightCenter.plusXY( 10, 0 );
        }
      } );
    };
    sceneProperty.link( updateResetButtons );
    radioButtonGroup.boundsProperty.link( updateResetButtons );
    this.addChild( new HStrut( 219 ) );
  }
}

gravityAndOrbits.register( 'SceneSelectionControls', SceneSelectionControls );

class SceneResetButton extends RectangularPushButton {
  public readonly scene: GravityAndOrbitsScene;

  /**
   * @param scene
   * @param [providedOptions]
   */
  public constructor( scene: GravityAndOrbitsScene, screenView: Interruptable, providedOptions?: RectangularPushButtonOptions ) {
    const options = optionize<RectangularPushButtonOptions, EmptySelfOptions, RectangularPushButtonOptions>()( {
      content: new Node( {
        children: [
          new Image( resetArrow_png, { scale: 0.3 } )
        ]
      } ),
      xMargin: 5,
      yMargin: 3,
      baseColor: new Color( 220, 220, 220 ),
      listener: () => {
        screenView.interruptSubtreeInput();
        scene.resetScene();
      }
    }, providedOptions );

    super( options );

    this.scene = scene;
  }
}

gravityAndOrbits.register( 'SceneResetButton', SceneResetButton );

export default SceneSelectionControls;