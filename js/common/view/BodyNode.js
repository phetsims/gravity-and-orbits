// Copyright 2014-2017, University of Colorado Boulder

/**
 * BodyNode renders one piccolo PNode for a Body, which can be at cartoon or real scale.  It is also draggable,
 * which changes the location of the Body.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const TOUCH_DILATION = 15; // dilation factor, produces touch bounds which are easy to drag

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

    const modelBoundsProperty = mode.modelBoundsProperty;
    const clock = mode.getClock();

    this.modelViewTransformProperty = mode.transformProperty; // @private
    this.body = body; // @public

    const self = this;

    this.body.collidedProperty.link( function( isCollided ) {
      self.visible = !isCollided;
    } );

    this.bodyRenderer = this.body.createRenderer( this.getViewDiameter() ); // @public
    this.addChild( this.bodyRenderer );

    // images rotate the target body with the rotation property
    const rotationListener = function( rotation ) {

      // if the body has a 'target mass' representation, only rotate that one
      if ( self.bodyRenderer.targetBodyRenderer ) {
        self.bodyRenderer.targetBodyRenderer.rotation = rotation;
      }
      else {
        self.bodyRenderer.rotation = rotation;
      }
    };
    body.rotationProperty.link( rotationListener );

    const dragHandler = new MovableDragHandler( this.body.positionProperty, {
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

    // rotate the node with the rotation property
    // const rotationListener = function( rotation ) {
    //   if ( self.body.mass)
    //   self.bodyRenderer.rotation = rotation;
    // };
    // body.rotationProperty.link( rotationListener );

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
      const oldPosition = self.body.positionProperty.value;
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
      const self = this;
      const node = new Node();
      const viewCenter = new Vector2( 0, 0 );
      const northEastVector = Vector2.createPolar( 1, labelAngle );
      const tip = northEastVector.times( 10 ).plus( viewCenter );
      const tail = northEastVector.times( 50 ).plus( viewCenter );

      node.addChild( new Line( tail.x, tail.y, tip.x, tip.y, { stroke: GravityAndOrbitsColorProfile.arrowIndicatorProperty } ) );
      const text = new Text( body.labelString, {
        font: new PhetFont( 18 ),
        x: tail.x - this.width / 2 - 5,
        y: tail.y - this.height - 10,
        fill: GravityAndOrbitsColorProfile.bodyNodeTextProperty,
        maxWidth: 75
      } );
      node.addChild( text );

      // when transform or mass changes diameter, check for visibility change of label
      const labelVisibilityListener = function() {
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
     * @returns {Vector2}
     */
    getPosition: function( modelViewTransformProperty, body ) {
      return modelViewTransformProperty.get().modelToView( body.positionProperty.get() );
    },

    /**
     * Get the diameter of the body in view coordinates.
     *
     * @returns {number}
     */
    getViewDiameter: function() {
      const viewDiameter = this.modelViewTransformProperty.get().modelToViewDeltaX( this.body.diameterProperty.get() );
      return Math.max( viewDiameter, 2 );
    }
  } );
} );