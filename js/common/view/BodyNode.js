// Copyright 2014-2016, University of Colorado Boulder

/**
 * BodyNode renders one piccolo PNode for a Body, which can be at cartoon or real scale.  It is also draggable,
 * which changes the location of the Body.
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
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  // constants
  var TOUCH_DILATION = 15; // dilation factor, produces touch bounds which are easy to drag

  /**
   * Constructor for BodyNode
   * @param {Body} body
   * @param {number} labelAngle - Angle at which to show the name label, different for different BodyNodes so they
   *                              don't overlap too much
   * @param {Property.<boolean>} playButtonPressedProperty is the simulation playing?
   * @param {GravityAndORbtisMode} mode
   * @constructor
   */
  function BodyNode( body, labelAngle, playButtonPressedProperty, mode ) {
    Node.call( this, { pickable: true, cursor: 'pointer' } );

    var modelBoundsProperty = mode.modelBoundsProperty;
    var clock = mode.getClock();

    this.modelViewTransformProperty = mode.transformProperty; // @private
    this.body = body; // @public

    var self = this;

    this.body.collidedProperty.link( function( isCollided ) {
      self.visible = !isCollided;
    } );

    this.bodyRenderer = this.body.createRenderer( this.getViewDiameter() ); // @public
    this.addChild( this.bodyRenderer );

    var dragHandler = new MovableDragHandler( this.body.positionProperty, {
      dragBounds:modelBoundsProperty.value,
      modelViewTransform: self.modelViewTransformProperty.value,
      startDrag: function() {
        body.userControlled = true;

        // when the dragging starts, we want to clear the path
        body.clearPath();
      },
      onDrag: function() {
        body.userModifiedPositionEmitter.emit();
      },
      endDrag: function() {
        body.userControlled = false;

        // reset the simulation time when the planet is released
        if ( playButtonPressedProperty.value !== true ) {
          clock.setSimulationTime( 0.0 );

          // if paused, on release, the state of the orbital system should be saved
          // so that rewind will revert to the last placement of bodies
          mode.saveState();
        }
      }
    } );
    this.addInputListener( dragHandler );

    // create position and diameter listeners so that they can be unlinked
    // for garbage collectiona and so that anonymous closures are not necessary
    // through multilink
    this.positionListener = function( position, modelViewTransform ) {
      self.translation = modelViewTransform.modelToViewPosition( position );
    };
    Property.multilink( [ this.body.positionProperty, this.modelViewTransformProperty ], this.positionListener );

    this.diameterListener = function( position, modelViewTransform ) {
      self.bodyRenderer.setDiameter( self.getViewDiameter() );

      // touch areas need to change with diameter
      self.touchArea = self.bodyRenderer.bounds.dilated( TOUCH_DILATION );
      self.mouseArea = self.bodyRenderer.bounds.dilated( TOUCH_DILATION );
    };
    Property.multilink( [ this.body.diameterProperty, this.modelViewTransformProperty ], this.diameterListener );

    this.modelViewTransformListener = function( modelViewTransform ) {
      dragHandler.setModelViewTransform( modelViewTransform );
    };
    this.modelViewTransformProperty.link( this.modelViewTransformListener );

    this.modelBoundsListener = function( dragBounds ) {

      // when changing the bounds, we want to set the bounds of the planet without modifying the position
      // of the planets.  We store the position, and restore once drag bounds have been set
      // these changes should never set rewindable values of the body Properties
      self.body.freezeRewindChangeProperty.set( true );
      var oldPosition = self.body.positionProperty.value;
      dragHandler.setDragBounds( dragBounds );
      self.body.positionProperty.set( oldPosition );

      // now unfreeze the Property rewindValues
      self.body.freezeRewindChangeProperty.set( false );
      
    };
    modelBoundsProperty.link( this.modelBoundsListener );

    // Points to the sphere with a text indicator and line when it is too small to see (in modes with realistic units)
    this.addChild( this.createArrowIndicator( this.body, labelAngle ) );
  }

  gravityAndOrbits.register( 'BodyNode', BodyNode );

  return inherit( Node, BodyNode, {

    /**
     * Return a Node that points to the sphere with a text indicator and line when it is too small to see (in modes
     * with realistic units)
     * @param body
     * @param labelAngle
     * @private
     */
    createArrowIndicator: function( body, labelAngle ) {
      var self = this;
      var node = new Node();
      var viewCenter = new Vector2( 0, 0 );
      var northEastVector = Vector2.createPolar( 1, labelAngle );
      var tip = northEastVector.times( 10 ).plus( viewCenter );
      var tail = northEastVector.times( 50 ).plus( viewCenter );

      node.addChild( new Line( tail.x, tail.y, tip.x, tip.y, { stroke: GravityAndOrbitsColorProfile.arrowIndicatorProperty } ) );
      var text = new Text( body.labelString, {
        font: new PhetFont( 18 ),
        x: tail.x - this.width / 2 - 5,
        y: tail.y - this.height - 10,
        fill: GravityAndOrbitsColorProfile.bodyNodeTextProperty,
        maxWidth: 75
      } );
      node.addChild( text );

      // when transform or mass changes diameter, check for visibility change of label
      var labelVisibilityListener = function() {
        node.visible = self.getViewDiameter() <= 10;
      };
      this.body.diameterProperty.link( labelVisibilityListener );
      this.modelViewTransformProperty.link( labelVisibilityListener );

      return node;
    },

    /**
     * Get the position of this body node mased on a transform and the model element.
     *
     * @param  {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param  {Body} body
     * @return {Vector2}
     */
    getPosition: function( modelViewTransformProperty, body ) {
      return modelViewTransformProperty.get().modelToView( body.positionProperty.get() );
    },

    /**
     * Get the diameter of the body in view coordinates.
     *
     * @return {number}
     */
    getViewDiameter: function() {
      var viewDiameter = this.modelViewTransformProperty.get().modelToViewDeltaX( this.body.diameterProperty.get() );
      return Math.max( viewDiameter, 2 );
    }

  } );
} );
