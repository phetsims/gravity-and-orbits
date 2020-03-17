// Copyright 2013-2020, University of Colorado Boulder

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
import TimeControlSpeed from '../../../../scenery-phet/js/TimeControlSpeed.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsColorProfile from '../GravityAndOrbitsColorProfile.js';

// constants
const PLAY_PAUSE_BUTTON_RADIUS = 34;
const STEP_BUTTON_RADIUS = 23;
const PUSH_BUTTON_SPACING = 8;

class GravityAndOrbitsTimeControlNode extends TimeControlNode {

  /**
   * @param {GravityAndOrbitsModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    super( model.isPlayingProperty, {
      timeControlSpeedProperty: model.timeControlSpeedProperty,
      timeControlSpeeds: [ TimeControlSpeed.FAST, TimeControlSpeed.NORMAL, TimeControlSpeed.SLOW ],
      playPauseStepButtonOptions: {
        playPauseStepXSpacing: PUSH_BUTTON_SPACING,
        playPauseButtonOptions: {
          radius: PLAY_PAUSE_BUTTON_RADIUS
        },
        stepForwardButtonOptions: {
          radius: STEP_BUTTON_RADIUS,
          isPlayingProperty: model.isPlayingProperty,
          listener: () => model.sceneProperty.value.getClock().stepClockWhilePaused()
        }
      },
      speedRadioButtonGroupOnLeft: true,
      speedRadioButtonGroupOptions: {
        labelOptions: {
          font: new PhetFont( 20 ),
          fill: GravityAndOrbitsColorProfile.bottomControlTextProperty,
          maxWidth: 200
        },
        radioButtonGroupOptions: {
          spacing: 3,
          touchAreaDilation: 5
        }
      },
      tandem: options.tandem
    } );

    const restartButton = new RestartButton( {
      enabled: false,
      radius: STEP_BUTTON_RADIUS,
      listener: () => model.sceneProperty.value.rewind(),
      center: this.getPlayPauseButtonCenter().minusXY( PLAY_PAUSE_BUTTON_RADIUS + STEP_BUTTON_RADIUS + PUSH_BUTTON_SPACING, 0 ),
      tandem: options.tandem.createTandem( 'restartButton' )
    } );
    this.addChild( restartButton );

    // Enable/disable the rewind button based on whether any Property in that scene has changed.
    const dependencies = [ model.sceneProperty ];
    model.getScenes().forEach( scene => {
      scene.getBodies().forEach( body => {
        body.getRewindableProperties().forEach( property => {
          dependencies.push( property.differentProperty );
        } );
      } );
    } );
    const anyPropertyDifferentProperty = new DerivedProperty( dependencies, () => {
      let changed = false;
      model.sceneProperty.value.getBodies().forEach( body => {
        body.getRewindableProperties().forEach( property => {
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