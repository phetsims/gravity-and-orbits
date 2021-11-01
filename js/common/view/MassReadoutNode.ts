// Copyright 2014-2021, University of Colorado Boulder

/**
 * Abstract class provides functionality for displaying the mass readout (in text) of a Body node.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsColors from '../GravityAndOrbitsColors.js';
import BodyNode from './BodyNode.js';

type MassReadoutNodeOptions = {
  textMaxWidth: number
};

abstract class MassReadoutNode extends Node {
  protected bodyNode: BodyNode;

  constructor( bodyNode: BodyNode, visibleProperty: Property<boolean>, providedOptions?: Partial<MassReadoutNodeOptions> ) {
    super();
    const options: MassReadoutNodeOptions = merge( {
      textMaxWidth: 240
    }, providedOptions ) as MassReadoutNodeOptions;
    this.bodyNode = bodyNode; // @protected

    const readoutText = new Text( this.createText(), {
      pickable: false,
      font: new PhetFont( 18 ),
      maxWidth: options.textMaxWidth,
      fill: GravityAndOrbitsColors.foregroundProperty
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

    visibleProperty.link( ( visible: boolean ) => {
      this.visible = visible;
      updatePosition();
    } );
  }

  protected abstract createText(): string
}

gravityAndOrbits.register( 'MassReadoutNode', MassReadoutNode );
export default MassReadoutNode;
