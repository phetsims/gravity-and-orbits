// Copyright 2014-2022, University of Colorado Boulder

/**
 * Abstract class provides functionality for displaying the mass readout (in text) of a Body node.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsColors from '../GravityAndOrbitsColors.js';
import BodyNode from './BodyNode.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

type MassReadoutNodeOptions = {
  textMaxWidth: number;
};

abstract class MassReadoutNode extends Node {
  protected bodyNode: BodyNode;

  public constructor( bodyNode: BodyNode, visibleProperty: IReadOnlyProperty<boolean>, providedOptions?: Partial<MassReadoutNodeOptions> ) {
    super();
    const options: MassReadoutNodeOptions = merge( {
      textMaxWidth: 240
    }, providedOptions ) as MassReadoutNodeOptions;
    this.bodyNode = bodyNode;

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

    visibleProperty.link( visible => {
      this.visible = visible;
      updatePosition();
    } );
  }

  protected abstract createText(): string;
}

gravityAndOrbits.register( 'MassReadoutNode', MassReadoutNode );
export default MassReadoutNode;
