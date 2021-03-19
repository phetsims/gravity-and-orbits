// Copyright 2013-2020, University of Colorado Boulder

/**
 * Visual representation of day counter.
 * Contains clear button and numeric counter.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import gravityAndOrbitsStrings from '../../gravityAndOrbitsStrings.js';
import GravityAndOrbitsColorProfile from '../GravityAndOrbitsColorProfile.js';

const clearString = gravityAndOrbitsStrings.clear;

// constants
const FONT_SIZE = 22;

class TimeCounter extends Node {

  /**
   * @param {function} timeFormatter
   * @param {GravityAndOrbitsClock} clock
   * @param {Tandem} tandem
   * @param [options]
   */
  constructor( timeFormatter, clock, tandem, options ) {
    super();

    // day text counter
    const dayText = new Text( '', {
      font: new PhetFont( {

        // In the Android app on the Galaxy Tab A SM-T580 (but not the Samsung A51, Android 10), StopwatchNode.NUMBER_FONT_FAMILY
        // fails the sim from starting up. That problem will be investigated in https://github.com/phetsims/scenery-phet/issues/674
        // But to unblock Gravity and Orbits, we use a fallback font family that has been tested on the device to work ok.
        // Once we have progress in https://github.com/phetsims/scenery-phet/issues/674, this should be revisited.
        family: StopwatchNode.NUMBER_FONT_FAMILY,
        size: FONT_SIZE
      } ),
      fill: GravityAndOrbitsColorProfile.bottomControlTextProperty,
      maxWidth: 200
    } );

    const clearButton = new TextPushButton( clearString, {
      font: new PhetFont( FONT_SIZE ),
      listener: () => clock.setSimulationTime( 0 ),
      maxWidth: 200,
      tandem: tandem.createTandem( 'clearButton' )
    } );

    // update text representation of day
    this.timeListener = time => {
      assert && assert( !isNaN( time ), 'time should be a number' );
      dayText.setText( timeFormatter( time ) );
      dayText.right = clearButton.right;
      clearButton.enabled = ( time !== 0 );
    };
    clock.timeProperty.link( this.timeListener );

    this.addChild( new VBox( {
      align: 'right',

      // Prevent the "Clear" button from moving when the number text changes
      resize: false,
      spacing: 4,
      children: [
        dayText,
        clearButton
      ]
    } ) );

    this.mutate( merge( { tandem: tandem }, options ) );
  }
}

gravityAndOrbits.register( 'TimeCounter', TimeCounter );
export default TimeCounter;