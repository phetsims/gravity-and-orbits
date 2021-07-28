// Copyright 2014-2021, University of Colorado Boulder

/**
 * BodyNode renders one piccolo PNode for a Body, which can be at model or real scale.  It is also draggable,
 * which changes the position of the Body.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsColors from '../GravityAndOrbitsColors.js';

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
    super( {
      cursor: 'pointer',
      tandem: tandem,
      pickable: true,
      phetioInputEnabledPropertyInstrumented: true
    } );

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

    const dragBoundsProperty = new DerivedProperty( [ scene.modelBoundsProperty, body.diameterProperty ], ( modelBounds, diameter ) => {
      return modelBounds.eroded( diameter / 2 );
    } );
    const dragListener = new DragListener( {
      positionProperty: body.positionProperty,
      transform: this.modelViewTransformProperty.value,
      dragBoundsProperty: dragBoundsProperty,
      start: () => {
        body.userControlled = true;

        // Clear the path when dragging starts.
        body.clearPath();
      },
      drag: event => body.userModifiedPositionEmitter.emit(),
      end: () => {
        body.userControlled = false;

        // reset the simulation time when the planet is released
        if ( isPlayingProperty.value !== true ) {
          clock.setSimulationTime( 0.0 );

          // if paused, on release, the state of the orbital system should be saved so that rewind will revert to the
          // last placement of bodies
          scene.saveState();
        }
      },
      tandem: tandem.createTandem( 'dragListener' )
    } );

    this.addInputListener( dragListener );

    // create position and diameter listeners so that they can be unlinked for garbage collection and so that anonymous
    // closures are not necessary through multilink
    this.positionListener = ( position, modelViewTransform ) => {
      this.setTranslation( modelViewTransform.modelToViewPosition( position ) );
    };
    Property.multilink( [ this.body.positionProperty, this.modelViewTransformProperty ], this.positionListener );

    this.diameterListener = () => {
      const viewDiameter = this.getViewDiameter();
      this.bodyRenderer.setDiameter( viewDiameter );
      const viewCenter = this.bodyRenderer.bounds.center;

      // touch areas need to change with diameter
      const circle = Shape.circle( viewCenter.x, viewCenter.y, viewDiameter / 2 + body.touchDilation );
      this.touchArea = circle;
      this.mouseArea = circle;
    };
    Property.multilink( [ this.body.diameterProperty, this.modelViewTransformProperty ], this.diameterListener );

    this.modelViewTransformListener = modelViewTransform => dragListener.setTransform( modelViewTransform );
    this.modelViewTransformProperty.link( this.modelViewTransformListener );

    this.modelBoundsListener = dragBounds => {

      // when changing the bounds, we want to set the bounds of the planet without modifying the position
      // of the planets.  We store the position, and restore once drag bounds have been set
      // these changes should never set rewindable values of the body Properties
      this.body.freezeRewindChangeProperty.set( true );
      this.body.positionProperty.set( this.body.positionProperty.value );

      // now unfreeze the Property rewindValues
      this.body.freezeRewindChangeProperty.set( false );
    };
    scene.modelBoundsProperty.link( this.modelBoundsListener );

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
    const node = new Node( {
      tandem: tandem,
      phetioDocumentation: 'When the body is too small to see (depending on the zoom level), this shows a line that ' +
                           'points to the body and indicates its name with a label.'
    } );
    const viewCenter = new Vector2( 0, 0 );
    const northEastVector = Vector2.createPolar( 1, labelAngle );
    const tip = northEastVector.times( 10 ).plus( viewCenter );
    const tail = northEastVector.times( 70 ).plus( viewCenter );

    const labelNodeTandem = tandem.createTandem( 'labelNode' );
    node.addChild( new Line( tail.x, tail.y, tip.x, tip.y, {
      stroke: GravityAndOrbitsColors.bodyLabelIndicatorProperty
    } ) );
    const labelNode = new Text( body.labelString, {
      font: new PhetFont( 18 ),
      fill: GravityAndOrbitsColors.foregroundProperty,
      maxWidth: 65,
      tandem: labelNodeTandem
    } );

    // Eliminate artifacts seen on Windows chrome by adding an invisible rectangle underlay, see
    // https://github.com/phetsims/QA/issues/519
    // 1px is too small for ?stringTest=long because the underlay rectangle is reduced in size as well
    const antiArtifactRectangle = new Rectangle( labelNode.bounds.dilated( 10 ), {

      // A rectangle with no fill doesn't paint, so we paint with low or no opacity to make sure that region is painted
      fill: 'transparent'
    } );
    const labelWithAntiArtifactRectangle = new Node( {
      children: [ antiArtifactRectangle, labelNode ],
      centerX: tail.x,
      y: tail.y - this.height - 10
    } );
    node.addChild( labelWithAntiArtifactRectangle );

    // when transform or mass changes diameter, check for visibility change of label
    const labelVisibilityListener = () => node.setVisible( this.getViewDiameter() <= 12 );
    this.body.diameterProperty.link( labelVisibilityListener );
    this.modelViewTransformProperty.link( labelVisibilityListener );

    return node;
  }

  /**
   * Get the position of this body node mased on a transform and the model element.
   * @public
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
   * @public
   *
   * @returns {number}
   */
  getViewDiameter() {
    const viewDiameter = this.modelViewTransformProperty.get().modelToViewDeltaX( this.body.diameterProperty.get() );
    return Math.max( viewDiameter, 2 );
  }
}

gravityAndOrbits.register( 'BodyNode', BodyNode );
export default BodyNode;
