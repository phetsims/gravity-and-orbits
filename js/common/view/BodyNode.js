// Copyright 2014-2019, University of Colorado Boulder

/**
 * BodyNode renders one piccolo PNode for a Body, which can be at model or real scale.  It is also draggable,
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
  const Line = require( 'SCENERY/nodes/Line' );
  const MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const TOUCH_DILATION = 15; // dilation factor, produces touch bounds which are easy to drag

  class BodyNode extends Node {

    /**
     * Constructor for BodyNode
     * @param {Body} body
     * @param {number} labelAngle - Angle at which to show the name label, different for different BodyNodes so they
     *                              don't overlap too much
     * @param {Property.<boolean>} isPlayingProperty is the simulation playing?
     * @param {GravityAndOrbitsScene} scene
     * @param {Tandem} tandem
     */
    constructor( body, labelAngle, isPlayingProperty, scene, tandem ) {
      super( { pickable: true, cursor: 'pointer', tandem: tandem } );

      const modelBoundsProperty = scene.modelBoundsProperty;
      const clock = scene.getClock();

      this.modelViewTransformProperty = scene.transformProperty; // @private
      this.body = body; // @public

      this.body.isCollidedProperty.link( isCollided => this.setVisible( !isCollided ) );

      this.bodyRenderer = this.body.createRenderer( this.getViewDiameter() ); // @public
      this.addChild( this.bodyRenderer );

      // images rotate the target body with the rotation property
      const rotationListener = rotation => {

        // if the body has a 'target mass' representation, only rotate that one
        if ( this.bodyRenderer.targetBodyRenderer ) {
          this.bodyRenderer.targetBodyRenderer.rotation = rotation;
        }
        else {
          this.bodyRenderer.rotation = rotation;
        }
      };
      body.rotationProperty.link( rotationListener );

      const dragHandler = new MovableDragHandler( this.body.positionProperty, {
        dragBounds: modelBoundsProperty.value,
        modelViewTransform: this.modelViewTransformProperty.value,
        startDrag: () => {
          body.userControlled = true;

          // when the dragging starts, we want to clear the path
          body.clearPath();
        },
        onDrag: () => {
          body.userModifiedPositionEmitter.emit();
        },
        endDrag: () => {
          body.userControlled = false;

          // reset the simulation time when the planet is released
          if ( isPlayingProperty.value !== true ) {
            clock.setSimulationTime( 0.0 );

            // if paused, on release, the state of the orbital system should be saved
            // so that rewind will revert to the last placement of bodies
            scene.saveState();
          }
        },
        tandem: tandem.createTandem( 'dragHandler' )
      } );
      this.addInputListener( dragHandler );

      // REVIEW: What's all this commented code about?
      // rotate the node with the rotation property
      // const rotationListener = function( rotation ) {
      //   if ( this.body.mass)
      //   this.bodyRenderer.rotation = rotation;
      // };
      // body.rotationProperty.link( rotationListener );

      // create position and diameter listeners so that they can be unlinked
      // for garbage collection and so that anonymous closures are not necessary
      // through multilink
      this.positionListener = ( position, modelViewTransform ) => {
        const blended = body.previousPosition.blend( body.positionProperty.value, clock.interpolationRatio );
        this.setTranslation( modelViewTransform.modelToViewPosition( blended ) );
      };
      Property.multilink( [ this.body.positionProperty, this.modelViewTransformProperty ], this.positionListener );

      this.diameterListener = ( position, modelViewTransform ) => {
        this.bodyRenderer.setDiameter( this.getViewDiameter() );

        // touch areas need to change with diameter
        this.touchArea = this.bodyRenderer.bounds.dilated( TOUCH_DILATION );
        this.mouseArea = this.bodyRenderer.bounds.dilated( TOUCH_DILATION );
      };
      Property.multilink( [ this.body.diameterProperty, this.modelViewTransformProperty ], this.diameterListener );

      this.modelViewTransformListener = modelViewTransform => dragHandler.setModelViewTransform( modelViewTransform );
      this.modelViewTransformProperty.link( this.modelViewTransformListener );

      this.modelBoundsListener = dragBounds => {

        // when changing the bounds, we want to set the bounds of the planet without modifying the position
        // of the planets.  We store the position, and restore once drag bounds have been set
        // these changes should never set rewindable values of the body Properties
        this.body.freezeRewindChangeProperty.set( true );
        const oldPosition = this.body.positionProperty.value;
        dragHandler.setDragBounds( dragBounds );
        this.body.positionProperty.set( oldPosition );

        // now unfreeze the Property rewindValues
        this.body.freezeRewindChangeProperty.set( false );

      };
      modelBoundsProperty.link( this.modelBoundsListener );

      // Points to the sphere with a text indicator and line when it is too small to see (in modes with realistic units)
      this.addChild( this.createArrowIndicator( this.body, labelAngle, tandem.createTandem( 'indicatorNode' ) ) );
    }

    /**
     * Return a Node that points to the sphere with a text indicator and line when it is too small to see (in modes
     * with realistic units)
     * @param {Body} body
     * @param {number} labelAngle
     * @param {Tandem} tandem
     * @private
     */
    createArrowIndicator( body, labelAngle, tandem ) {
      const node = new Node();
      const viewCenter = new Vector2( 0, 0 );
      const northEastVector = Vector2.createPolar( 1, labelAngle );
      const tip = northEastVector.times( 10 ).plus( viewCenter );
      const tail = northEastVector.times( 50 ).plus( viewCenter );

      node.addChild( new Line( tail.x, tail.y, tip.x, tip.y, { stroke: GravityAndOrbitsColorProfile.arrowIndicatorProperty } ) );
      const labelNode = new Text( body.labelString, {
        font: new PhetFont( 18 ),
        centerX: tail.x,
        y: tail.y - this.height - 10,
        fill: GravityAndOrbitsColorProfile.bodyNodeTextProperty,
        maxWidth: 75,
        tandem: tandem.createTandem( 'labelNode' )
      } );

      // For PhET-iO, re-center the node after the text changes size
      labelNode.on( 'bounds', () => {
        labelNode.centerX = tail.x;
      } );
      node.addChild( labelNode );

      // when transform or mass changes diameter, check for visibility change of label
      const labelVisibilityListener = () => node.setVisible( this.getViewDiameter() <= 10 );
      this.body.diameterProperty.link( labelVisibilityListener );
      this.modelViewTransformProperty.link( labelVisibilityListener );

      return node;
    }

    /**
     * Get the position of this body node mased on a transform and the model element.
     *
     * @param  {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param  {Body} body
     * @returns {Vector2}
     */
    getPosition( modelViewTransformProperty, body ) {
      return modelViewTransformProperty.get().modelToView( body.positionProperty.get() );
    }

    /**
     * Get the diameter of the body in view coordinates.
     *
     * @returns {number}
     */
    getViewDiameter() {
      const viewDiameter = this.modelViewTransformProperty.get().modelToViewDeltaX( this.body.diameterProperty.get() );
      return Math.max( viewDiameter, 2 );
    }
  }

  return gravityAndOrbits.register( 'BodyNode', BodyNode );
} );