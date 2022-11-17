// Copyright 2015-2022, University of Colorado Boulder

/**
 * Control panel used to change the mass of the various bodies. This is the panel in the lower right section of the screen that holds sliders
 * for adjusting the mass of bodies.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, HStrut, Node, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsStrings from '../../GravityAndOrbitsStrings.js';
import GravityAndOrbitsColors from '../GravityAndOrbitsColors.js';
import GravityAndOrbitsConstants from '../GravityAndOrbitsConstants.js';
import MassSlider from './MassSlider.js';
import Body from '../model/Body.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { EmptySelfOptions, optionize3, OptionizeDefaults } from '../../../../phet-core/js/optionize.js';
import merge from '../../../../phet-core/js/merge.js';

// constants
const CONTROL_FONT = new PhetFont( 14 );
const LABEL_MAP = {
  planet: GravityAndOrbitsStrings.planetMassStringProperty,
  satellite: GravityAndOrbitsStrings.satelliteMassStringProperty,
  star: GravityAndOrbitsStrings.starMassStringProperty,
  moon: GravityAndOrbitsStrings.moonMassStringProperty
};

type MassControlPanelOptions = VBoxOptions & PickRequired<VBoxOptions, 'tandem'>;

class MassControlPanel extends VBox {

  public constructor( massSettableBodies: Body[], providedOptions?: MassControlPanelOptions ) {

    const defaults: OptionizeDefaults<EmptySelfOptions, VBoxOptions> = merge( GravityAndOrbitsConstants.CONTROL_PANEL_OPTIONS, {

      // Managed by the simulation, can be buggy if independently controlled by studio
      visiblePropertyOptions: { phetioReadOnly: true }
    } );

    const options = optionize3<MassControlPanelOptions, EmptySelfOptions, VBoxOptions>()( {}, defaults, providedOptions );

    const children = [];

    for ( let i = 0; i < massSettableBodies.length; i++ ) {

      const massSettableBody = massSettableBodies[ i ];
      const massSettableBodyTandem = options.tandem.createTandem( `${massSettableBody.tandemName}ControlNode` );
      const sliderNode = new Node( { tandem: massSettableBodyTandem } );

      const massLabelText = new Text( LABEL_MAP[ massSettableBody.type ], {
        font: CONTROL_FONT,
        fontWeight: 'bold',
        fill: GravityAndOrbitsColors.foregroundProperty,
        maxWidth: 175,
        tandem: massSettableBodyTandem.createTandem( 'massLabelText' )
      } );

      const icon = new Node( {
        children: [ massSettableBody.createRenderer( 14 ) ],
        tandem: massSettableBodyTandem.createTandem( 'icon' )
      } );

      // Top component that shows the body's name and icon
      const labelHBox = new HBox( { children: [ icon, massLabelText ], spacing: 10 } );

      sliderNode.addChild( labelHBox );

      const sliderVBox = new VBox( {
        top: labelHBox.bottom + 8,
        children: [
          new HStrut( 220 ),

          new MassSlider(
            massSettableBody,
            massSettableBody.massProperty.value / 2,
            massSettableBody.massProperty.value * 2,
            massSettableBody.tickValue,
            massSettableBody.tickLabelProperty,
            massSettableBodyTandem.createTandem( 'massSlider' )
          )
        ]
      } );

      sliderNode.addChild( sliderVBox );
      children.push( sliderNode );
    }

    super( { children: children, spacing: 15, y: 5, align: 'left' } );
  }
}

gravityAndOrbits.register( 'MassControlPanel', MassControlPanel );
export default MassControlPanel;