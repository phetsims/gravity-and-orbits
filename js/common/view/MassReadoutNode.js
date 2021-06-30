// Copyright 2014-2020, University of Colorado Boulder

/**
 * Abstract class provides functionality for displaying the mass readout (in text) of a Body node.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsColorProfile from '../GravityAndOrbitsColorProfile.js';

class MassReadoutNode extends Node {
  constructor( bodyNode, visibleProperty, options ) {
    super();
    options = merge( {
      textMaxWidth: 240
    }, options );
    this.bodyNode = bodyNode; // @protected

    const readoutText = new Text( this.createText(), {
      pickable: false,
      font: new PhetFont( 18 ),
      maxWidth: options.textMaxWidth,
      fill: GravityAndOrbitsColorProfile.bodyNodeTextProperty
    } );
    this.addChild( readoutText );

    const updatePosition = () => {
      const bounds = bodyNode.bodyRenderer.getBounds();

      this.x = bounds.centerX - this.width / 2;
      if ( bodyNode.body.massReadoutBelow ) {
        this.y = bounds.maxX + this.height;
      }
      else {
        this.y = bounds.minY - this.height;
      }
    };

    bodyNode.body.massProperty.link( () => {
      readoutText.setText( this.createText() );
      updatePosition();
    } );

    visibleProperty.link( visible => {
      this.visible = visible;
      updatePosition();
    } );
  }
}

gravityAndOrbits.register( 'MassReadoutNode', MassReadoutNode );
export default MassReadoutNode;
