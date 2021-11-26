// Copyright 2014-2021, University of Colorado Boulder

/**
 * Used to show the draggable velocity vectors.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Shape from '../../../../kite/js/Shape.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { DragListener } from '../../../../scenery/js/imports.js';
import { Path } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import { Color } from '../../../../scenery/js/imports.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import VectorNode from './VectorNode.js';
import Body from '../model/Body.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';

class DraggableVectorNode extends VectorNode {

  /**
   * Constructor for DraggableVectorNode
   * @param {Body} body
   * @param {Property.<ModelViewTransform2>} transformProperty
   * @param {Property.<boolean>} visibleProperty
   * @param {Property.<Vector2>} vectorProperty
   * @param {number} scale
   * @param {Color} fill
   * @param {Color} outline
   * @param {string} labelText
   * @param {Tandem} tandem
   * @param {Object} [providedOptions]
   * @constructor
   */
  constructor( body: Body, transformProperty: Property<ModelViewTransform2>, visibleProperty: Property<boolean>, vectorProperty: Property<Vector2>, scale: number, fill: Color,
               outline: Color, labelText: string, tandem: Tandem, providedOptions?: object ) {

    super( body, transformProperty, visibleProperty, vectorProperty, scale, fill, outline, tandem, providedOptions );

    const tip = this.getTip();

    // a circle with text (a character) in the center, to help indicate what it represents
    // ("v" for velocity in this sim)
    const ellipse = Shape.ellipse( 0, 0, 18, 18, 0 );
    const grabArea = new Path( ellipse, {
      lineWidth: 3,
      stroke: Color.lightGray,
      cursor: 'pointer'
    } );

    const text = new Text( labelText, {
      font: new PhetFont( 22 ),
      fontWeight: 'bold',
      fill: Color.gray,
      maxWidth: 25
    } );
    text.center = tip;
    grabArea.center = tip;

    this.addChild( grabArea );
    this.addChild( text );

    // Center the grab area on the tip (see getTip()) when any of its dependencies change
    const propertyListener = ( visible: boolean ) => {
      if ( visible ) {
        const tip = this.getTip();
        grabArea.center = tip;
        text.center = tip;
      }
    };
    Property.multilink( [ visibleProperty, vectorProperty, body.positionProperty, transformProperty ], propertyListener );

    // The velocity vector is rooted on the object, so we manage all of its drags by deltas.
    let previousPoint: Vector2 | null = null;
    let previousValue: Vector2 | null = null;

    // Add the drag handler
    const dragListener = new DragListener( {
      start: ( event: { pointer: { point: Vector2; }; } ) => {
        previousPoint = transformProperty.value.viewToModelPosition( this.globalToParentPoint( event.pointer.point ) ).timesScalar( 1 / scale );
        previousValue = body.velocityProperty.get();
      },
      drag: ( event: { pointer: { point: Vector2; }; } ) => {

        const currentPoint = transformProperty.value.viewToModelPosition( this.globalToParentPoint( event.pointer.point ) ).timesScalar( 1 / scale );
        if ( previousPoint ) {
          const delta = currentPoint.minus( previousPoint );

          const proposedVelocity = previousValue!.plus( delta );
          const viewVector = this.transformProperty.get().modelToViewDelta( proposedVelocity.times( this.vectorNodeScale ) );
          if ( viewVector.magnitude < 10 ) {
            proposedVelocity.setXY( 0, 0 );
          }
          body.velocityProperty.set( proposedVelocity );
          body.userModifiedVelocityEmitter.emit();
        }
      },
      end: () => {},
      tandem: tandem.createTandem( 'dragListener' )
    } );
    grabArea.addInputListener( dragListener );

    // move behind the geometry created by the superclass
    grabArea.moveToBack();
    text.moveToBack();

    // For PhET-iO, when the node does not support input, don't show the drag circle
    this.inputEnabledProperty.link( ( inputEnabled: boolean ) => {
      grabArea.visible = inputEnabled;
      text.visible = inputEnabled;
    } );
  }
}

gravityAndOrbits.register( 'DraggableVectorNode', DraggableVectorNode );
export default DraggableVectorNode;