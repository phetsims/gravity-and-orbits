// Copyright 2013-2022, University of Colorado Boulder

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
import { Node } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import { VBox } from '../../../../scenery/js/imports.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import gravityAndOrbitsStrings from '../../gravityAndOrbitsStrings.js';
import GravityAndOrbitsColors from '../GravityAndOrbitsColors.js';
import GravityAndOrbitsClock from '../model/GravityAndOrbitsClock.js';

const clearString = gravityAndOrbitsStrings.clear;

// constants
const FONT_SIZE = 22;

class TimeCounter extends Node {
  private timeListener: ( time: number ) => void;

  /**
   * @param {function} timeFormatter
   * @param {GravityAndOrbitsClock} clock
   * @param {Tandem} tandem
   * @param [providedOptions]
   */
  constructor( timeFormatter: ( time: number ) => string, clock: GravityAndOrbitsClock, tandem: Tandem, providedOptions?: { bottom: number; right: number; scale: number } ) {
    super();

    // day text counter
    const dayText = new Text( '', {
      font: new PhetFont( {
        family: StopwatchNode.NUMBER_FONT_FAMILY,
        size: FONT_SIZE
      } ),
      fill: GravityAndOrbitsColors.foregroundProperty,
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

    this.mutate( merge( { tandem: tandem }, providedOptions ) );
  }
}

gravityAndOrbits.register( 'TimeCounter', TimeCounter );
export default TimeCounter;