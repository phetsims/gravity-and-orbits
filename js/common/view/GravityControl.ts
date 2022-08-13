// Copyright 2015-2022, University of Colorado Boulder

/**
 * Container for gravity on/off buttons.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import gravityAndOrbitsStrings from '../../gravityAndOrbitsStrings.js';
import GravityAndOrbitsColors from '../GravityAndOrbitsColors.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

// constants
const FONT = new PhetFont( 14 );
const TEXT_OPTIONS = { font: FONT, fill: GravityAndOrbitsColors.foregroundProperty, maxWidth: 50 };
const RADIO_OPTIONS = { radius: 7 };

type GravityControlOptions = PhetioObjectOptions;

class GravityControl extends Node {

  /**
   * @param gravityEnabledProperty
   * @param [providedOptions] - This object contains options for main node of gravity menu.
   */
  public constructor( gravityEnabledProperty: Property<boolean>, providedOptions?: GravityControlOptions ) {
    super( providedOptions );

    const options = optionize<GravityControlOptions, EmptySelfOptions, PhetioObjectOptions>()( {
      tandem: Tandem.OPTIONAL
    }, providedOptions );

    const gravityTextNode = new Text( gravityAndOrbitsStrings.gravity, { ...TEXT_OPTIONS, textProperty: gravityAndOrbitsStrings.gravityProperty } );
    const onTextNode = new Text( gravityAndOrbitsStrings.on, { ...TEXT_OPTIONS, textProperty: gravityAndOrbitsStrings.onProperty } );
    const offTextNode = new Text( gravityAndOrbitsStrings.off, { ...TEXT_OPTIONS, textProperty: gravityAndOrbitsStrings.offProperty } );

    this.addLinkedElement( gravityEnabledProperty, {
      tandem: options.tandem.createTandem( 'gravityEnabledProperty' )
    } );

    this.addChild( new HBox( {
      spacing: 10, bottom: 2, children: [
        gravityTextNode,
        new AquaRadioButton( gravityEnabledProperty, true, onTextNode, merge( { tandem: options.tandem.createTandem( 'gravityOnRadioButton' ) }, RADIO_OPTIONS ) ),
        new AquaRadioButton( gravityEnabledProperty, false, offTextNode, merge( { tandem: options.tandem.createTandem( 'gravityOffRadioButton' ) }, RADIO_OPTIONS ) )
      ]
    } ) );
  }
}

gravityAndOrbits.register( 'GravityControl', GravityControl );
export default GravityControl;