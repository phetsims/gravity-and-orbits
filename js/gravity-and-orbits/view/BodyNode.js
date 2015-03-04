// Copyright 2002-2014, University of Colorado

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
  var Color = require( 'SCENERY/util/Color' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var Body = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/Body' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Bounds2 = require( 'DOT/Bounds2' );


  /**
   * Constrains a point to some bounds.
   *
   * @param {Vector2} point
   * @param {Bounds2} bounds
   * @returns {Vector2}
   */
  function constrainBounds( point ) {
    var bounds = new Bounds2( 0, 0, 1024, 618 );
    if ( _.isUndefined( bounds ) || bounds.containsPoint( point ) ) {
      return point;
    }
    else {
      var xConstrained = Math.max( Math.min( point.x, bounds.maxX ), bounds.minX );
      var yConstrained = Math.max( Math.min( point.y, bounds.maxY ), bounds.minY );
      return new Vector2( xConstrained, yConstrained );
    }
  }

  /**
   *
   * @param {Body} body
   * @param {ModelViewTransform} modelViewTransform
   * @param {Vector2} mousePosition
   * @param {PComponent} parentComponent
   * @param {number} labelAngle
   * @param {boolean} whiteBackgroundProperty
   * @constructor
   */
  function BodyNode( body, modelViewTransform, //Keep track of the mouse position in case a body moves underneath a stationary mouse (in which case the mouse should become a hand cursor)
                     mousePosition, parentComponent, //Angle at which to show the name label, different for different BodyNodes so they don't overlap too much
                     labelAngle, whiteBackgroundProperty ) {

    Node.call( this, { pickable: true, cursor: 'pointer' } );

    // private attributes
    this.modelViewTransform = modelViewTransform;
    this.body = body;
    this.whiteBackgroundProperty = whiteBackgroundProperty;

    var thisNode = this;

    this.body.collidedProperty.link( function( isCollided ) {
      thisNode.visible = !isCollided;
    } );

    this.bodyRenderer = this.body.createRenderer( this.getViewDiameter() );
    this.addChild( this.bodyRenderer );
//    var cursorHandler = new CursorHandler();

    // Add drag handlers
//    this.addInputListener( cursorHandler );
    var startOffset;

    this.addInputListener( new SimpleDragHandler( {

      start: function( event ) {
        thisNode.body.setUserControlled( true );
        startOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( thisNode.translation );
      },
      drag: function( event ) {
        var parentPoint = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( startOffset );
        var delta = modelViewTransform.get().viewToModelDelta( parentPoint );
//        var delta = modelViewTransform.get().viewToModelDelta( event.getDeltaRelativeTo( parentPoint ) );
        thisNode.body.translate( delta.x, delta.y );
        thisNode.body.notifyUserModifiedPosition();
      },
      end: function( event ) {
        thisNode.body.setUserControlled( false );
      }
    } ) );

    this.body.positionProperty.link( function( pos ) {
      thisNode.translation = constrainBounds( modelViewTransform.get().modelToViewPosition( pos ) );
    });

    // TODO: is this necessary in JS version?
//    this.body.positionProperty.link( function() {
//      /* we need to determine whether the mouse is over the body both before and after the model change so
//       * that we can toggle the hand pointer over the body.
//       *
//       * otherwise the body can move over the mouse and be dragged without ever seeing the hand pointer
//       */
//      var isMouseOverBefore = this.bodyRenderer.getGlobalFullBounds().contains( mousePosition.get().toPoint2D() );
//      setOffset( getPosition( modelViewTransform, body ).toPoint2D() );
//      var isMouseOverAfter = bodyRenderer.getGlobalFullBounds().contains( mousePosition.get().toPoint2D() );
//      //Send mouse entered and mouse exited events when body moves underneath a stationary mouse (in which case the mouse should become a hand cursor)
//      if ( parentComponent != null ) {
//        if ( isMouseOverBefore && !isMouseOverAfter ) {
//          cursorHandler.mouseExited( new PInputEvent( null, null ).withAnonymousClassBody( {
//            getComponent: function() {
//              return parentComponent;
//            }
//          } ) );
//        }
//        if ( !isMouseOverBefore && isMouseOverAfter ) {
//          cursorHandler.mouseEntered( new PInputEvent( null, null ).withAnonymousClassBody( {
//            getComponent: function() {
//              return parentComponent;
//            }
//          } ) );
//        }
//      }
//    } );

    this.body.diameterProperty.link( function() {
      thisNode.bodyRenderer.setDiameter( thisNode.getViewDiameter() );
    } );

    //Points to the sphere with a text indicator and line, for when it is too small to see (in modes with realistic units)
    this.addChild( this.createArrowIndicator( this.body, labelAngle ) );
  }

  return inherit( Node, BodyNode, {

    //Points to the sphere with a text indicator and line, for when it is too small to see (in modes with realistic units)
    //private
    createArrowIndicator: function( body, labelAngle ) {
      var node = new Node();
      var viewCenter = new Vector2( 0, 0 );
      var northEastVector = Vector2.createPolar( 1, labelAngle );
      var tip = northEastVector.times( 10 ).plus( viewCenter );
      var tail = northEastVector.times( 50 ).plus( viewCenter );

      node.addChild( new ArrowNode( tail.x, tail.y, tip.x, tip.y, { fill: 'yellow' } ) );
      var text = new Text( body.getName(), {
        font: new PhetFont( 18 ),
        x: tail.x - this.width / 2 - 5,
        y: tail.y - this.height - 10
      } );
      node.addChild( text );

      this.whiteBackgroundProperty.link( function( whiteBackground ) {
        text.fill = whiteBackground ? Color.black : Color.white;
      } );

      // TODO finish this port
//      var updateVisibility = new PropertyChangeListener().withAnonymousClassBody( {
//        propertyChange: function( evt ) {
//          setVisible( bodyRenderer.getGlobalFullBounds().getWidth() <= 10 );
//        }
//      } );
//      this.bodyRenderer.addPropertyChangeListener( PROPERTY_FULL_BOUNDS, updateVisibility );
//      updateVisibility.propertyChange( null );
      return node;
    },

    //private
    getPosition: function( modelViewTransform, body ) {
      return modelViewTransform.get().modelToView( body.getPosition() );
    },

    //private
    getViewDiameter: function() {
      var viewDiameter = this.modelViewTransform.get().modelToViewDeltaX( this.body.getDiameter() );
      return Math.max( viewDiameter, 2 );
    },

    //Create a new image at the specified width. Use body.createRenderer() instead of bodyRenderer since we must specify a new width value
    renderImage: function( width ) {
      return this.body.createRenderer( width ).toImage( width, width, new Color( 0, 0, 0, 0 ) );
    },

    getBody: function() {
      return this.body;
    },

    getBodyRenderer: function() {
      return this.bodyRenderer;
    }
  } );
} );
