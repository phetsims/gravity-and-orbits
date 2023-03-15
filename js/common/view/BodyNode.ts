// Copyright 2014-2023, University of Colorado Boulder

/**
 * BodyNode renders one piccolo PNode for a Body, which can be at model or real scale.  It is also draggable,
 * which changes the position of the Body.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Body from '../model/Body.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { DragListener, Line, Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsColors from '../GravityAndOrbitsColors.js';
import GravityAndOrbitsScene from '../GravityAndOrbitsScene.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BodyRenderer from './BodyRenderer.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Multilink from '../../../../axon/js/Multilink.js';

class BodyNode extends Node {
  private readonly modelViewTransformProperty: Property<ModelViewTransform2>;
  public readonly body: Body;
  public readonly bodyRenderer: BodyRenderer;
  private readonly positionListener: ( position: Vector2, modelViewTransform: ModelViewTransform2 ) => void;
  private readonly diameterListener: () => void;
  private readonly modelBoundsListener: ( dragBounds: Bounds2 | null ) => void;

  /**
   * Constructor for BodyNode
   * @param body
   * @param labelAngle - Angle at which to show the name label, different for different BodyNodes so they
   *                              don't overlap too much
   * @param isPlayingProperty is the simulation playing?
   * @param scene
   * @param tandem
   */
  public constructor( body: Body, labelAngle: number, isPlayingProperty: Property<boolean>, scene: GravityAndOrbitsScene, tandem: Tandem ) {
    super( {
      cursor: 'pointer',
      tandem: tandem,
      pickable: true,
      phetioInputEnabledPropertyInstrumented: true
    } );

    const clock = scene.getClock();

    this.modelViewTransformProperty = scene.transformProperty;
    this.body = body;

    this.body.isCollidedProperty.link( isCollided => this.setVisible( !isCollided ) );

    this.bodyRenderer = this.body.createRenderer( this.getViewDiameter() );
    this.addChild( this.bodyRenderer );

    // images rotate the target body with the rotation property
    const rotationListener = ( rotation: number ) => {

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
      assert && assert( modelBounds !== null );

      return modelBounds!.eroded( diameter / 2 );
    } );

    // If a body is dragged while the sim is paused, it sets new "initial conditions" that can be rewound to
    const saveStateIfPaused = () => {

      if ( !isPlayingProperty.value ) {
        clock.setSimulationTime( 0.0 );

        // if paused, the state of the orbital system should be saved so that rewind will revert to the last placement of bodies
        scene.saveState();
      }
    };
    const dragListener = new DragListener( {
      positionProperty: body.positionProperty,
      transform: this.modelViewTransformProperty,
      dragBoundsProperty: dragBoundsProperty,
      start: () => {
        body.userControlled = true;

        // Clear the path when dragging starts.
        body.clearPath();

        saveStateIfPaused();
      },
      drag: () => {
        body.userModifiedPositionEmitter.emit();
        saveStateIfPaused();
      },
      end: () => {
        body.userControlled = false;
        saveStateIfPaused();
      },
      tandem: tandem.createTandem( 'dragListener' )
    } );

    this.addInputListener( dragListener );

    // create position and diameter listeners so that they can be unlinked for garbage collection and so that anonymous
    // closures are not necessary through multilink
    this.positionListener = ( position, modelViewTransform ) => {
      this.setTranslation( modelViewTransform.modelToViewPosition( position ) );
    };
    Multilink.multilink( [ this.body.positionProperty, this.modelViewTransformProperty ], this.positionListener );

    this.diameterListener = () => {
      const viewDiameter = this.getViewDiameter();
      this.bodyRenderer.setDiameter( viewDiameter );
      const viewCenter = this.bodyRenderer.bounds.center;

      // touch areas need to change with diameter
      const circle = Shape.circle( viewCenter.x, viewCenter.y, viewDiameter / 2 + body.touchDilation );
      this.touchArea = circle;
      this.mouseArea = circle;
    };
    Multilink.multilink( [ this.body.diameterProperty, this.modelViewTransformProperty ], this.diameterListener );

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
   */
  private createArrowIndicator( body: Body, labelAngle: number, tandem: Tandem ): Node {
    const node = new Node( {
      tandem: tandem,
      phetioDocumentation: 'When the body is too small to see (depending on the zoom level), this shows a line that ' +
                           'points to the body and indicates its name with a label.'
    } );
    const viewCenter = new Vector2( 0, 0 );
    const northEastVector = Vector2.createPolar( 1, labelAngle );
    const tip = northEastVector.times( 10 ).plus( viewCenter );
    const tail = northEastVector.times( 70 ).plus( viewCenter );

    const labelTextTandem = tandem.createTandem( 'labelText' );
    node.addChild( new Line( tail.x, tail.y, tip.x, tip.y, {
      stroke: GravityAndOrbitsColors.bodyLabelIndicatorProperty
    } ) );
    const labelText = new Text( body.labelStringProperty!, {
      font: new PhetFont( 18 ),
      fill: GravityAndOrbitsColors.foregroundProperty,
      maxWidth: 65,
      tandem: labelTextTandem
    } );

    // Eliminate artifacts seen on Windows chrome by adding an invisible rectangle underlay, see
    // https://github.com/phetsims/QA/issues/519
    // 1px is too small for ?stringTest=long because the underlay rectangle is reduced in size as well
    const antiArtifactRectangle = new Rectangle( {
      // A rectangle with no fill doesn't paint, so we paint with low or no opacity to make sure that region is painted
      fill: 'transparent'
    } );
    labelText.boundsProperty.link( bounds => {
      antiArtifactRectangle.rectBounds = bounds.dilated( 10 );
    } );
    const labelWithAntiArtifactRectangle = new Node( {
      children: [ antiArtifactRectangle, labelText ]
    } );
    labelWithAntiArtifactRectangle.localBoundsProperty.link( () => {
      labelWithAntiArtifactRectangle.centerX = tail.x;
      labelWithAntiArtifactRectangle.y = tail.y - this.bodyRenderer.height - 10;
    } );
    node.addChild( labelWithAntiArtifactRectangle );

    // when transform or mass changes diameter, check for visibility change of label
    const labelVisibilityListener = () => node.setVisible( this.getViewDiameter() <= 12 );
    this.body.diameterProperty.link( labelVisibilityListener );
    this.modelViewTransformProperty.link( labelVisibilityListener );

    return node;
  }

  /**
   * Get the diameter of the body in view coordinates.
   */
  private getViewDiameter(): number {
    const viewDiameter = this.modelViewTransformProperty.get().modelToViewDeltaX( this.body.diameterProperty.get() );
    return Math.max( viewDiameter, 2 );
  }
}

gravityAndOrbits.register( 'BodyNode', BodyNode );
export default BodyNode;
