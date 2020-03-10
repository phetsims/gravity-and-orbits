// Copyright 2015-2020, University of Colorado Boulder

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
import Panel from '../../../../sun/js/Panel.js';
import gravityAndOrbitsStrings from '../../gravity-and-orbits-strings.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsColorProfile from '../GravityAndOrbitsColorProfile.js';
import GravityAndOrbitsConstants from '../GravityAndOrbitsConstants.js';
import BodyMassControl from './BodyMassControl.js';

const moonMassString = gravityAndOrbitsStrings.moonMass;
const planetMassString = gravityAndOrbitsStrings.planetMass;
const satelliteMassString = gravityAndOrbitsStrings.satelliteMass;
const starMassString = gravityAndOrbitsStrings.starMass;

// constants
const CONTROL_FONT = new PhetFont( 14 );
const LABEL_MAP = {
  PLANET: planetMassString,
  SATELLITE: satelliteMassString,
  STAR: starMassString,
  MOON: moonMassString
};

class MassControlPanel extends Panel {

  /**
   * @param massSettableBodies
   * @param options
   */
  constructor( massSettableBodies, options ) {

    options = merge( {}, GravityAndOrbitsConstants.CONTROL_PANEL_OPTIONS, {
      phetioComponentOptions: {

        // Managed by the simulation, can be buggy if independently controlled by studio
        visibleProperty: { phetioReadOnly: true }
      }
    }, options );

    const children = [];

    for ( let i = 0; i < massSettableBodies.length; i++ ) {
      const sliderNode = new Node();
      const massSettableBody = massSettableBodies[ i ];
      const label = new Text( LABEL_MAP[ massSettableBody.type.name ], {
        font: CONTROL_FONT,
        fontWeight: 'bold',
        fill: GravityAndOrbitsColorProfile.panelTextProperty,
        maxWidth: 175,
        tandem: options.tandem.createTandem( massSettableBody.labelTandemName )
      } );

      const icon = new Node( {
        children: [ massSettableBody.createRenderer( 14 ) ],
        tandem: options.tandem.createTandem( massSettableBody.iconTandemName )
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
            options.tandem.createTandem( massSettableBody.bodyMassControlTandemName )
          )
        ]
      } );

      sliderNode.addChild( sliderVBox );
      children.push( sliderNode );
    }

    const vBox = new VBox( { children: children, spacing: 15, y: 5, align: 'left' } );
    super( vBox, options );
  }
}

gravityAndOrbits.register( 'MassControlPanel', MassControlPanel );
export default MassControlPanel;