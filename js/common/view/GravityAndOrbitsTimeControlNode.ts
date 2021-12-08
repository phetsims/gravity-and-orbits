// Copyright 2013-2021, University of Colorado Boulder

/**
 * Visual representation of speed control buttons.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import RestartButton from '../../../../scenery-phet/js/buttons/RestartButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsColors from '../GravityAndOrbitsColors.js';
import Body from '../model/Body.js';
import GravityAndOrbitsModel from '../model/GravityAndOrbitsModel.js';
import RewindableProperty from '../model/RewindableProperty.js';
import GravityAndOrbitsScene from '../GravityAndOrbitsScene.js';

// constants
const PLAY_PAUSE_BUTTON_RADIUS = 34;
const STEP_BUTTON_RADIUS = 23;
const PUSH_BUTTON_SPACING = 8;

type GravityAndOrbitsTimeControlNodeOptions = {
  tandem: Tandem
};

class GravityAndOrbitsTimeControlNode extends TimeControlNode {

  /**
   * @param {GravityAndOrbitsModel} model
   * @param {Object} [providedOptions]
   */
  constructor( model: GravityAndOrbitsModel, providedOptions?: Partial<GravityAndOrbitsTimeControlNodeOptions> ) {

    const options: GravityAndOrbitsTimeControlNodeOptions = merge( {
      tandem: Tandem.REQUIRED
    }, providedOptions ) as GravityAndOrbitsTimeControlNodeOptions;


    super( model.isPlayingProperty, {
      timeSpeedProperty: model.timeSpeedProperty,

      // @ts-ignore
      timeSpeeds: [ TimeSpeed.FAST, TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      playPauseStepButtonOptions: {
        playPauseStepXSpacing: PUSH_BUTTON_SPACING,
        playPauseButtonOptions: {
          radius: PLAY_PAUSE_BUTTON_RADIUS
        },
        stepForwardButtonOptions: {
          radius: STEP_BUTTON_RADIUS,
          listener: () => model.sceneProperty.value.getClock().stepClockWhilePaused()
        }
      },
      speedRadioButtonGroupOnLeft: true,
      speedRadioButtonGroupOptions: {
        labelOptions: {
          font: new PhetFont( 20 ),
          fill: GravityAndOrbitsColors.foregroundProperty,
          maxWidth: 200
        },
        radioButtonGroupOptions: {
          touchAreaDilation: 5
        }
      },
      tandem: options.tandem
    } );

    const restartButton = new RestartButton( {
      enabled: false,
      radius: STEP_BUTTON_RADIUS,
      xMargin: 9.5,
      yMargin: 9.5,
      listener: () => model.sceneProperty.value.rewind(),
      center: this.getPlayPauseButtonCenter().minusXY( PLAY_PAUSE_BUTTON_RADIUS + STEP_BUTTON_RADIUS + PUSH_BUTTON_SPACING, 0 ),
      tandem: options.tandem.createTandem( 'restartButton' )
    } );
    this.addChild( restartButton );

    // Enable/disable the rewind button based on whether any Property in that scene has changed.
    const dependencies = [ model.sceneProperty ];
    model.getScenes().forEach( scene => {
      scene.getBodies().forEach( body => {
        // @ts-ignore
        body.getRewindableProperties().forEach( ( property: RewindableProperty ) => {
          dependencies.push( property.differentProperty );
        } );
      } );
    } );
    const anyPropertyDifferentProperty = new DerivedProperty( dependencies, ( ...args: GravityAndOrbitsScene[] ) => {
      let changed = false;
      model.sceneProperty.value.getBodies().forEach( ( body: Body ) => {
        // @ts-ignore
        body.getRewindableProperties().forEach( ( property: RewindableProperty ) => {
          changed = changed || property.differentProperty.value;
        } );
      } );
      return changed;
    } );
    anyPropertyDifferentProperty.link( changed => restartButton.setEnabled( changed ) );
  }
}

gravityAndOrbits.register( 'GravityAndOrbitsTimeControlNode', GravityAndOrbitsTimeControlNode );
export default GravityAndOrbitsTimeControlNode;