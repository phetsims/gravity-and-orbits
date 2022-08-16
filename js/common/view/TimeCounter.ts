// Copyright 2013-2022, University of Colorado Boulder

/**
 * Visual representation of day counter.
 * Contains clear button and numeric counter.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import TProperty from '../../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import { Node, NodeOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import gravityAndOrbitsStrings from '../../gravityAndOrbitsStrings.js';
import GravityAndOrbitsColors from '../GravityAndOrbitsColors.js';
import GravityAndOrbitsClock from '../model/GravityAndOrbitsClock.js';

// constants
const FONT_SIZE = 22;

class TimeCounter extends Node {

  /**
   * @param timeFormatter
   * @param clock
   * @param tandem
   * @param [providedOptions]
   */
  public constructor( timeFormatter: ( timeProperty: TProperty<number> ) => TReadOnlyProperty<string>, clock: GravityAndOrbitsClock, tandem: Tandem, providedOptions?: NodeOptions ) {
    super();

    // day text counter
    const dayText = new Text( timeFormatter( clock.timeProperty ), {
      font: new PhetFont( {
        family: StopwatchNode.NUMBER_FONT_FAMILY,
        size: FONT_SIZE
      } ),
      fill: GravityAndOrbitsColors.foregroundProperty,
      maxWidth: 200
    } );

    const clearButton = new TextPushButton( gravityAndOrbitsStrings.clearProperty, {
      font: new PhetFont( FONT_SIZE ),
      listener: () => clock.setSimulationTime( 0 ),
      maxWidth: 200,
      tandem: tandem.createTandem( 'clearButton' ),
      widthSizable: true
    } );

    // update text representation of day
    clock.timeProperty.link( time => {
      assert && assert( !isNaN( time ), 'time should be a number' );
      clearButton.enabled = time !== 0;
    } );

    this.addChild( new VBox( {
      align: 'right',

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