// Copyright 2014-2017, University of Colorado Boulder

/**
 * Used to show the draggable velocity vectors.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Shape = require( 'KITE/Shape' );
  const SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VectorNode = require( 'GRAVITY_AND_ORBITS/common/view/VectorNode' );

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
  function GrabbableVectorNode( body, transformProperty, visibleProperty, vectorProperty, scale, fill,
                                outline, labelText ) {

    VectorNode.call( this, body, transformProperty, visibleProperty, vectorProperty, scale, fill, outline );
    const self = this;

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
    const propertyListener = function( visible ) {
      if ( visible ) {
        const tip = self.getTip();
        grabArea.center = tip;
        text.center = tip;
      }
    };
    Property.multilink( [ visibleProperty, vectorProperty, body.positionProperty, transformProperty ], propertyListener );

    // Add the drag handler
    grabArea.addInputListener( new SimpleDragHandler( {
      translate: function( event ) {
        const modelDelta = transformProperty.get().viewToModelDelta( event.delta );
        body.velocityProperty.set( body.velocityProperty.get().plusXY( modelDelta.x / scale, modelDelta.y / scale ) );
        body.userModifiedVelocityEmitter.emit();
      }
    } ) );

    // move behind the geometry created by the superclass
    grabArea.moveToBack();
    text.moveToBack();
  }

  gravityAndOrbits.register( 'GrabbableVectorNode', GrabbableVectorNode );

  return inherit( VectorNode, GrabbableVectorNode );
} );