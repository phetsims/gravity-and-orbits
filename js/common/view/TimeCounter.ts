// Copyright 2013-2022, University of Colorado Boulder

/**
 * Visual representation of day counter.
 * Contains clear button and numeric counter.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import { Node, NodeOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsStrings from '../../GravityAndOrbitsStrings.js';
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
  public constructor( timeFormatter: ( timeProperty: TProperty<number>, tandem: Tandem ) => TReadOnlyProperty<string>, clock: GravityAndOrbitsClock, tandem: Tandem, providedOptions?: NodeOptions ) {
    super();

    // day text counter
    const dayText = new Text( timeFormatter( clock.timeProperty, tandem.createTandem( 'formattedTimeProperty' ) ), {
      font: new PhetFont( {
        family: StopwatchNode.NUMBER_FONT_FAMILY,
        size: FONT_SIZE
      } ),
      fill: GravityAndOrbitsColors.foregroundProperty,
      maxWidth: 200
    } );

    const isTimeNonZeroProperty = new DerivedProperty( [ clock.timeProperty ], time => time !== 0 );

    const clearButton = new TextPushButton( GravityAndOrbitsStrings.clearStringProperty, {
      font: new PhetFont( FONT_SIZE ),
      listener: () => clock.setSimulationTime( 0 ),
      maxTextWidth: 200,
      tandem: tandem.createTandem( 'clearButton' ),
      enabledProperty: isTimeNonZeroProperty
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