// Copyright 2013-2020, University of Colorado Boulder

/**
 * Visual representation of speed radio buttons.
 * Three different modes: slow/normal/fast motion.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import gravityAndOrbitsStrings from '../../gravity-and-orbits-strings.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsColorProfile from '../GravityAndOrbitsColorProfile.js';
import SpeedType from '../model/SpeedType.js';

const fastForwardString = gravityAndOrbitsStrings.fastForward;
const normalString = gravityAndOrbitsStrings.normal;
const slowMotionString = gravityAndOrbitsStrings.slowMotion;

class SpeedRadioButtons extends VerticalAquaRadioButtonGroup {

  /**
   * @param {Property.<number>} speedProperty - The rate of flow of time.
   * @param {Object} [options]
   * @constructor
   */
  constructor( speedProperty, options ) {

    options = merge( {
      spacing: 1,
      touchAreaDilation: 5,
      radioButtonOptions: { radius: 8 }
    }, options );

    const textOptions = {
      font: new PhetFont( 18 ),
      fill: GravityAndOrbitsColorProfile.bottomControlTextProperty,
      maxWidth: 200
    };
    const fastText = new Text( fastForwardString, textOptions );
    const normalText = new Text( normalString, textOptions );
    const slowText = new Text( slowMotionString, textOptions );

    super( speedProperty, [
      { value: SpeedType.FAST_FORWARD, node: fastText, tandemName: 'fastForwardRadioButton' },
      { value: SpeedType.NORMAL, node: normalText, tandemName: 'normalSpeedRadioButton' },
      { value: SpeedType.SLOW_MOTION, node: slowText, tandemName: 'slowMotionRadioButton' }
    ], options );
  }
}

gravityAndOrbits.register( 'SpeedRadioButtons', SpeedRadioButtons );
export default SpeedRadioButtons;