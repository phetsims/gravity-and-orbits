// Copyright 2002-2015, University of Colorado

/**
 * BodyNode renders one piccolo PNode for a Body, which can be at cartoon or real scale.  It is also draggable, which changes
 * the location of the Body.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Line = require( 'SCENERY/nodes/Line' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var GravityAndOrbitsColors = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsColors' );

  /**
   * Constructor for BodyNode
   * @param {Body} body
   * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
   * @param {number} labelAngle - Angle at which to show the name label, different for different BodyNodes so they don't overlap too much
   * @constructor
   */
  function BodyNode( body, modelViewTransformProperty, labelAngle ) {
    Node.call( this, { pickable: true, cursor: 'pointer' } );

    this.modelViewTransformProperty = modelViewTransformProperty; // @private
    this.body = body; // @private

    var thisNode = this;

    this.body.collidedProperty.link( function( isCollided ) {
      thisNode.visible = !isCollided;
    } );

    this.bodyRenderer = this.body.createRenderer( this.getViewDiameter() );
    this.addChild( this.bodyRenderer );

    var dragHandler = new MovableDragHandler( this.body.positionProperty, {
      startDrag: function() {
        body.userControlled = true;
      },
      onDrag: function() {
        body.notifyUserModifiedPosition();
      },
      endDrag: function() {
        body.userControlled = false;
      }
    } );
    this.addInputListener( dragHandler );

    Property.multilink( [ this.body.positionProperty, modelViewTransformProperty ], function( position, modelViewTransform ) {
      thisNode.translation = modelViewTransform.modelToViewPosition( position );
    } );

    Property.multilink( [ this.body.diameterProperty, modelViewTransformProperty ], function( diameter, modelViewTransform ) {
      thisNode.bodyRenderer.setDiameter( thisNode.getViewDiameter() );
    } );

    this.modelViewTransformProperty.link( function( modelViewTransform ) {
      dragHandler.setModelViewTransform( modelViewTransform );
    } );

    // Points to the sphere with a text indicator and line, for when it is too small to see (in modes with realistic units)
    this.addChild( this.createArrowIndicator( this.body, labelAngle ) );
  }

  return inherit( Node, BodyNode, {

    /**
     * Points to the sphere with a text indicator and line, for when it is too small to see (in modes with realistic units)
     * @param body
     * @param labelAngle
     * @private
     */
    createArrowIndicator: function( body, labelAngle ) {
      var thisNode = this;
      var node = new Node();
      var viewCenter = new Vector2( 0, 0 );
      var northEastVector = Vector2.createPolar( 1, labelAngle );
      var tip = northEastVector.times( 10 ).plus( viewCenter );
      var tail = northEastVector.times( 50 ).plus( viewCenter );

      node.addChild( new Line( tail.x, tail.y, tip.x, tip.y, { stroke: 'yellow' } ) );
      var text = new Text( body.getName(), {
        font: new PhetFont( 18 ),
        x: tail.x - this.width / 2 - 5,
        y: tail.y - this.height - 10,
        fill: 'white'
      } );
      node.addChild( text );

      GravityAndOrbitsColors.link( 'bodyNodeText', function( color ) {
        text.fill = color;
      } );

      this.body.diameterProperty.link( function() {
        node.visible = thisNode.getViewDiameter() <= 10;
      } );

      return node;
    },

    // @private
    getPosition: function( modelViewTransformProperty, body ) {
      return modelViewTransformProperty.get().modelToView( body.getPosition() );
    },

    // @private
    getViewDiameter: function() {
      var viewDiameter = this.modelViewTransformProperty.get().modelToViewDeltaX( this.body.getDiameter() );
      return Math.max( viewDiameter, 2 );
    },

    getBody: function() {
      return this.body;
    },

    getBodyRenderer: function() {
      return this.bodyRenderer;
    }
  } );
} );
