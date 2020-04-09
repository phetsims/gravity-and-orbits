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
import SimpleDragHandler from '../../../../scenery/js/input/SimpleDragHandler.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import VectorNode from './VectorNode.js';

class GrabbableVectorNode extends VectorNode {

  /**
   * Constructor for GrabbableVectorNode
   * @param {Body} body
   * @param {Property.<ModelViewTransform2>} transformProperty
   * @param {Property.<boolean>} visibleProperty
   * @param {Property.<Vector2>} vectorProperty
   * @param {number} scale
   * @param {Color} fill
   * @param {Color} outline
   * @param {string} labelText
   * @param {Tandem} tandem
   * @constructor
   */
  constructor( body, transformProperty, visibleProperty, vectorProperty, scale, fill,
               outline, labelText, tandem ) {

    super( body, transformProperty, visibleProperty, vectorProperty, scale, fill, outline, tandem );

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

    // Add the drag handler
    grabArea.addInputListener( new SimpleDragHandler( {
      translate: event => {
        const modelDelta = transformProperty.get().viewToModelDelta( event.delta );
        body.velocityProperty.set( body.velocityProperty.get().plusXY( modelDelta.x / scale, modelDelta.y / scale ) );
        body.userModifiedVelocityEmitter.emit();
      },
      tandem: tandem.createTandem( 'dragHandler' )
    } ) );

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

gravityAndOrbits.register( 'GrabbableVectorNode', GrabbableVectorNode );
export default GrabbableVectorNode;