// Copyright 2015-2021, University of Colorado Boulder

/**
 * Control panel used to change the mass of the various bodies. This is the panel in the lower right section of the screen that holds sliders
 * for adjusting the mass of bodies.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import gravityAndOrbitsStrings from '../../gravityAndOrbitsStrings.js';
import GravityAndOrbitsColors from '../GravityAndOrbitsColors.js';
import GravityAndOrbitsConstants from '../GravityAndOrbitsConstants.js';
import BodyMassControl from './BodyMassControl.js';
import Body from '../model/Body.js';
import Tandem from '../../../../tandem/js/Tandem.js';

const moonMassString = gravityAndOrbitsStrings.moonMass;
const planetMassString = gravityAndOrbitsStrings.planetMass;
const satelliteMassString = gravityAndOrbitsStrings.satelliteMass;
const starMassString = gravityAndOrbitsStrings.starMass;

// constants
const CONTROL_FONT = new PhetFont( 14 );
const LABEL_MAP = {
  planet: planetMassString,
  satellite: satelliteMassString,
  star: starMassString,
  moon: moonMassString
};

type MassControlPanelOptions = {
  tandem: Tandem
};

class MassControlPanel extends VBox {

  constructor( massSettableBodies: Body[], providedOptions?: Partial<MassControlPanelOptions> ) {

    const options = merge( {}, GravityAndOrbitsConstants.CONTROL_PANEL_OPTIONS, {

      // Managed by the simulation, can be buggy if independently controlled by studio
      visiblePropertyOptions: { phetioReadOnly: true }
    }, providedOptions ) as MassControlPanelOptions;

    const children = [];

    for ( let i = 0; i < massSettableBodies.length; i++ ) {

      const massSettableBody = massSettableBodies[ i ];
      const massSettableBodyTandem = options.tandem.createTandem( `${massSettableBody.tandemName}ControlNode` );
      const sliderNode = new Node( { tandem: massSettableBodyTandem } );

      const label = new Text( LABEL_MAP[ massSettableBody.type ], {
        font: CONTROL_FONT,
        fontWeight: 'bold',
        fill: GravityAndOrbitsColors.foregroundProperty,
        maxWidth: 175,
        tandem: massSettableBodyTandem.createTandem( 'massLabel' )
      } );

      const icon = new Node( {
        children: [ massSettableBody.createRenderer( 14 ) ],
        tandem: massSettableBodyTandem.createTandem( 'icon' )
      } );

      // Top component that shows the body's name and icon
      const labelHBox = new HBox( { children: [ icon, label ], spacing: 10 } );

      sliderNode.addChild( labelHBox );

      const sliderVBox = new VBox( {
        top: labelHBox.bottom + 8,
        children: [
          new HStrut( 220 ),
          new BodyMassControl(
            massSettableBody,
            massSettableBody.massProperty.value / 2,
            massSettableBody.massProperty.value * 2,
            massSettableBody.tickValue,
            massSettableBody.tickLabel,
            massSettableBodyTandem.createTandem( 'massControl' )
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