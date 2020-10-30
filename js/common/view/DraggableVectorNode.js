// Copyright 2014-2020, University of Colorado Boulder

/**
 * Used to show the draggable velocity vectors.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Shape from '../../../../kite/js/Shape.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import VectorNode from './VectorNode.js';

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
   * @param {Object} [options]
   * @constructor
   */
  constructor( body, transformProperty, visibleProperty, vectorProperty, scale, fill,
               outline, labelText, tandem, options ) {

    super( body, transformProperty, visibleProperty, vectorProperty, scale, fill, outline, tandem, options );

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
    const propertyListener = visible => {
      if ( visible ) {
        const tip = this.getTip();
        grabArea.center = tip;
        text.center = tip;
      }
    };
    Property.multilink( [ visibleProperty, vectorProperty, body.positionProperty, transformProperty ], propertyListener );

    // The velocity vector is rooted on the object, so we manage all of its drags by deltas.
    let previousPoint = null;

    // Add the drag handler
    const dragListener = new DragListener( {
      start: event => {
        previousPoint = transformProperty.value.viewToModelPosition( this.globalToParentPoint( event.pointer.point ) ).timesScalar( 1 / scale );
      },
      drag: event => {

        const currentPoint = transformProperty.value.viewToModelPosition( this.globalToParentPoint( event.pointer.point ) ).timesScalar( 1 / scale );
        if ( previousPoint ) {
          const delta = currentPoint.minus( previousPoint );
          body.velocityProperty.set( body.velocityProperty.get().plus( delta ) );
          body.userModifiedVelocityEmitter.emit();
        }

        previousPoint = currentPoint;
      },
      end: event => {},
      tandem: tandem.createTandem( 'dragListener' )
    } );
    grabArea.addInputListener( dragListener );

    // move behind the geometry created by the superclass
    grabArea.moveToBack();
    text.moveToBack();

    // For PhET-iO, when the node is made unpickable, don't show the drag circle
    const updateGrabAreaAndTextVisibility = () => {
      grabArea.visible = this.pickable !== false;
      text.visible = this.pickable !== false;
    };
    this.pickableProperty.link( updateGrabAreaAndTextVisibility );
  }
}

gravityAndOrbits.register( 'DraggableVectorNode', DraggableVectorNode );
export default DraggableVectorNode;