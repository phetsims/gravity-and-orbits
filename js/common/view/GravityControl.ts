// Copyright 2015-2021, University of Colorado Boulder

/**
 * Container for gravity on/off buttons.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import gravityAndOrbitsStrings from '../../gravityAndOrbitsStrings.js';
import GravityAndOrbitsColors from '../GravityAndOrbitsColors.js';
import Property from '../../../../axon/js/Property';
import Tandem from '../../../../tandem/js/Tandem';

const gravityString = gravityAndOrbitsStrings.gravity;

// strings
const offString = gravityAndOrbitsStrings.off;
const onString = gravityAndOrbitsStrings.on;

// constants
const FONT = new PhetFont( 14 );
const TEXT_OPTIONS = { font: FONT, fill: GravityAndOrbitsColors.foregroundProperty, maxWidth: 50 };
const RADIO_OPTIONS = { radius: 7 };

type GravityControlOptions = {
  tandem?: Tandem
}

class GravityControl extends Node {

  /**
   * @param {Property.<boolean>} gravityEnabledProperty
   * @param {Object} [options] - This object contains options for main node of gravity menu.
   */
  constructor( gravityEnabledProperty: Property, options?: GravityControlOptions ) {
    super( options );

    const gravityTextNode = new Text( gravityString, TEXT_OPTIONS );
    const onTextNode = new Text( onString, TEXT_OPTIONS );
    const offTextNode = new Text( offString, TEXT_OPTIONS );

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