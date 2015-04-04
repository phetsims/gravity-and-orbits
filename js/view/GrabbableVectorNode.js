// Copyright 2002-2015, University of Colorado
/**
 * Used to show the draggable velocity vectors.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var Body = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/Body' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VectorNode = require( 'GRAVITY_AND_ORBITS/view/VectorNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * Constructor for GrabbableVectorNode
   * @param {Body} body
   * @param {Property.<ModelViewTransform>} transformProperty
   * @param {Property.<boolean>} visibleProperty
   * @param {Property.<Vector2>} vectorProperty
   * @param {number} scale
   * @param {Color} fill
   * @param {Color} outline
   * @param {string} labelText
   * @constructor
   */
  function GrabbableVectorNode( body, transformProperty, visibleProperty, vectorProperty, scale, fill, outline, labelText ) {

    VectorNode.call( this, body, transformProperty, visibleProperty, vectorProperty, scale, fill, outline );
    var thisNode = this;

    var tip = this.getTip();

    //a circle with text (a character) in the center, to help indicate what it represents ("v" for velocity in this sim)
    var ellipse = Shape.ellipse( 0, 0, 18, 18, 0 );
    var grabArea = new Path( ellipse, {
      lineWidth: 3,
      stroke: Color.lightGray,
      cursor: 'pointer'
    } );

    var text = new Text( labelText, {
      font: new PhetFont( 22 ),
      fontWeight: 'bold',
      fill: Color.gray
    } );
    text.center = tip;
    grabArea.center = tip;

    this.addChild( grabArea );
    this.addChild( text );

    //Center the grab area on the tip (see getTip()) when any of its dependencies change
    Property.multilink( [ vectorProperty, body.getPositionProperty(), transformProperty ],
      function() {
        var tip = thisNode.getTip();
        grabArea.center = tip;
        text.center = tip;
      } );

    //Add the drag handler
    grabArea.addInputListener( new SimpleDragHandler( {
      translate: function( event ) {
        var modelDelta = transformProperty.get().viewToModelDelta( event.delta );
        body.setVelocity( body.getVelocity().plusXY( modelDelta.x / scale, modelDelta.y / scale ) );
        body.notifyUserModifiedVelocity();
      }
    } ) );

    //move behind the geometry created by the superclass
    grabArea.moveToBack();
    text.moveToBack();
  }

  return inherit( VectorNode, GrabbableVectorNode );
} );

