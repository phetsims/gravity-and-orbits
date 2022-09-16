// Copyright 2014-2022, University of Colorado Boulder

/**
 * Abstract class provides functionality for displaying the mass readout (in text) of a Body node.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Text } from '../../../../scenery/js/imports.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsColors from '../GravityAndOrbitsColors.js';
import BodyNode from './BodyNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import Panel from '../../../../sun/js/Panel.js';

export type MassReadoutNodeOptions = {
  textMaxWidth?: number;
};

abstract class MassReadoutNode extends Panel {
  protected bodyNode: BodyNode;

  protected readonly stringProperty;

  public constructor( bodyNode: BodyNode, visibleProperty: TReadOnlyProperty<boolean>, providedOptions?: MassReadoutNodeOptions ) {

    const options: MassReadoutNodeOptions = merge( {
      textMaxWidth: 240
    }, providedOptions ) as MassReadoutNodeOptions;

    const stringProperty = new StringProperty( '-' );

    const readoutText = new Text( stringProperty, {
      pickable: false,
      font: new PhetFont( 18 ),
      maxWidth: options.textMaxWidth,
      fill: GravityAndOrbitsColors.foregroundProperty
    } );

    // Expand text area to repaint artifacts
    super( readoutText, {
      visibleProperty: visibleProperty,
      stroke: null,
      fill: new Color( 0, 0, 1, 0.0001 ),
      cornerRadius: 0
    } );

    this.bodyNode = bodyNode;

    this.stringProperty = stringProperty;
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

    bodyNode.body.massProperty.lazyLink( updatePosition );
    this.stringProperty.lazyLink( updatePosition );
    visibleProperty.lazyLink( updatePosition );
  }
}

gravityAndOrbits.register( 'MassReadoutNode', MassReadoutNode );
export default MassReadoutNode;
