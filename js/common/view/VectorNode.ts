// Copyright 2014-2022, University of Colorado Boulder

/**
 * Draws a vector for a Body, such as a force vector or velocity vector.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import { Color, Node } from '../../../../scenery/js/imports.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import Body from '../model/Body.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

// constants
const FORCE_SCALE = 76.0 / 5.179E15;

class VectorNode extends Node {
  private body: Body;
  private vectorProperty: Property<Vector2>;
  protected transformProperty: Property<ModelViewTransform2>;
  private readonly propertyListener: ( visible: boolean ) => void;
  static FORCE_SCALE: number;
  protected readonly vectorNodeScale: number;

  /**
   * @param {Body} body
   * @param {Property.<ModelViewTransform2>} transformProperty
   * @param {Property.<boolean>} visibleProperty
   * @param {Property.<Vector2>} vectorProperty
   * @param {number} scale
   * @param {Color} fill
   * @param {Color} outline
   * @param {Tandem} tandem
   * @param {Object} [providedOptions]
   */
  constructor( body: Body, transformProperty: Property<ModelViewTransform2>, visibleProperty: Property<boolean>, vectorProperty: Property<Vector2>, scale: number, fill: Color, outline: Color, tandem: Tandem, providedOptions?: object ) {
    const options = merge( {
      tandem: tandem,
      visiblePropertyOptions: { phetioReadOnly: true }
    }, providedOptions );
    super( options );

    this.body = body; // @private
    this.vectorProperty = vectorProperty; // @private
    this.body = body; // @private
    this.transformProperty = transformProperty; // @private
    this.vectorNodeScale = scale; // @private

    // Only show if the body hasn't collided
    const shouldBeShownProperty = new DerivedProperty(
      [ visibleProperty, body.isCollidedProperty ], ( visible, collided ) => visible && !collided
    );
    shouldBeShownProperty.linkAttribute( this, 'visible' );

    const arrowNode = new ArrowNode( 0, 0, 0, 0, {
      headHeight: 15,
      headWidth: 15,
      tailWidth: 5,
      fill: fill,
      stroke: outline,
      pickable: false,
      boundsMethod: 'none',
      isHeadDynamic: true,
      scaleTailToo: true
    } );

    this.propertyListener = visible => {
      if ( visible ) {
        const tail = this.getTail();
        const tip = this.getTip( tail );
        arrowNode.setTailAndTip( tail.x, tail.y, tip.x, tip.y );
      }
    };
    Property.multilink( [ visibleProperty, vectorProperty, body.positionProperty, transformProperty ], this.propertyListener );

    this.addChild( arrowNode );
  }

  private getTail(): Vector2 {
    return this.transformProperty.get().modelToViewPosition( this.body.positionProperty.get() );
  }

  protected getTip( tail: Vector2 = this.getTail() ): Vector2 {
    const force = this.transformProperty.get().modelToViewDelta( this.vectorProperty.get().times( this.vectorNodeScale ) );
    return new Vector2( force.x + tail.x, force.y + tail.y );
  }
}

VectorNode.FORCE_SCALE = FORCE_SCALE;
gravityAndOrbits.register( 'VectorNode', VectorNode );
export default VectorNode;