// Copyright 2014-2019, University of Colorado Boulder

/**
 * Provides the play area for a single GravityAndOrbitsScene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * @see GravityAndOrbitsScene
 */
define( require => {
  'use strict';

  // modules
  const BodyNode = require( 'GRAVITY_AND_ORBITS/common/view/BodyNode' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Color = require( 'SCENERY/util/Color' );
  const DayCounter = require( 'GRAVITY_AND_ORBITS/common/view/DayCounter' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const ExplosionNode = require( 'GRAVITY_AND_ORBITS/common/view/ExplosionNode' );
  const GravityAndOrbitsBodies = require( 'GRAVITY_AND_ORBITS/common/model/GravityAndOrbitsBodies' );
  const GrabbableVectorNode = require( 'GRAVITY_AND_ORBITS/common/view/GrabbableVectorNode' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  const GridNode = require( 'GRAVITY_AND_ORBITS/common/view/GridNode' );
  const MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  const PathsCanvasNode = require( 'GRAVITY_AND_ORBITS/common/view/PathsCanvasNode' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const platform = require( 'PHET_CORE/platform' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ScaleSlider = require( 'GRAVITY_AND_ORBITS/common/view/ScaleSlider' );
  const TextPushButton = require( 'SUN/buttons/TextPushButton' );
  const TimeControlPanel = require( 'GRAVITY_AND_ORBITS/common/view/TimeControlPanel' );
  const VectorNode = require( 'GRAVITY_AND_ORBITS/common/view/VectorNode' );

  // strings
  const returnObjectsString = require( 'string!GRAVITY_AND_ORBITS/returnObjects' );
  const thousandMilesString = require( 'string!GRAVITY_AND_ORBITS/thousandMiles' );
  const vString = require( 'string!GRAVITY_AND_ORBITS/v' );

  // constants
  const SCALE = 0.8; // these numbers come from trying to match the original MLL port of this sim
  const WIDTH = 790 * ( 1 / SCALE );
  const HEIGHT = 618 * ( 1 / SCALE );
  const STAGE_SIZE = new Bounds2( 0, 0, WIDTH, HEIGHT );
  const buttonBackgroundColor = new Color( 255, 250, 125 );
  const METERS_PER_MILE = 0.000621371192;
  const THOUSAND_MILES_MULTIPLIER = METERS_PER_MILE / 1000;

  class GravityAndOrbitsSceneView extends Rectangle {

    /**
     * Constructor for GravityAndOrbitsSceneView
     * @param {GravityAndOrbitsScene} scene
     * @param {GravityAndOrbitsModel} model
     * @param {Tandem} tandem
     */
    constructor( scene, model, tandem ) {
      const forceScale = scene.forceScale;

      // each orbit mode has its own play area with a CanvasNode for rendering paths
      // each canvas should be excluded from the DOM when invisible, with the exception of iOS Safari,
      // which performs worse in this case when toggling visibility
      const excludeInvisible = !platform.mobileSafari;

      super( 0, 0, WIDTH, HEIGHT, { scale: SCALE, excludeInvisible: excludeInvisible } );

      const bodies = scene.physicsEngine.getBodies();

      this.addChild( new PathsCanvasNode( bodies, scene.transformProperty, model.showPathProperty, STAGE_SIZE ) );

      const forceVectorColorFill = new Color( 50, 130, 215 );
      const forceVectorColorOutline = new Color( 64, 64, 64 );
      const velocityVectorColorFill = PhetColorScheme.RED_COLORBLIND;
      const velocityVectorColorOutline = new Color( 64, 64, 64 );

      // Use canvas coordinates to determine whether something has left the visible area
      const isReturnableProperties = [];
      bodies.forEach( body => {
        const bodyNode = new BodyNode( body, body.labelAngle, model.isPlayingProperty, scene, tandem.createTandem( body.bodyNodeTandemName ) );
        const massReadoutNode = scene.massReadoutFactory( bodyNode, model.showMassProperty );
        this.addChild( bodyNode );
        bodyNode.addChild( massReadoutNode );

        const isReturnableProperty = new DerivedProperty( [ body.positionProperty, scene.zoomLevelProperty ], () => {

          // the return objects button should be visible when a body is out of bounds
          // and not at the rewind position
          const atRewindPosition = bodyNode.body.positionProperty.equalsRewindValue();
          return !STAGE_SIZE.intersectsBounds( bodyNode.bounds ) && !atRewindPosition;
        } );
        isReturnableProperties.push( isReturnableProperty );
      } );

      // Add gravity force vector nodes
      for ( let i = 0; i < bodies.length; i++ ) {
        this.addChild( new VectorNode( bodies[ i ], scene.transformProperty, model.showGravityForceProperty,
          bodies[ i ].forceProperty, forceScale, forceVectorColorFill, forceVectorColorOutline ) );
      }

      // Add velocity vector nodes
      for ( let i = 0; i < bodies.length; i++ ) {
        if ( bodies[ i ].isMovableProperty.value ) {
          this.addChild( new GrabbableVectorNode( bodies[ i ], scene.transformProperty, model.showVelocityProperty,
            bodies[ i ].velocityProperty, scene.velocityVectorScale, velocityVectorColorFill, velocityVectorColorOutline,
            vString, tandem.createTandem( 'vectorNode' + i ) ) );
        }
      }

      // Add explosion nodes, which are always in the scene graph but only visible during explosions
      for ( let i = 0; i < bodies.length; i++ ) {
        this.addChild( new ExplosionNode( bodies[ i ], scene.transformProperty ) );
      }

      // Add the node for the overlay grid, setting its visibility based on the model.showGridProperty
      const gridNode = new GridNode( scene.transformProperty, scene.gridSpacing, scene.gridCenter, 28 );
      model.showGridProperty.linkAttribute( gridNode, 'visible' );
      this.addChild( gridNode );

      this.addChild( new DayCounter( scene.timeFormatter, scene.physicsEngine.clock, tandem.createTandem( 'dayCounter' ), {
        bottom: STAGE_SIZE.bottom - 20,
        right: STAGE_SIZE.right - 50,
        scale: 1.2
      } ) );

      // Control Panel and reset all button are now added in the screen view to reduce the size of the screen graph

      // Add play/pause, rewind, and step buttons
      const timeControlPanel = new TimeControlPanel( model, bodies, tandem.createTandem( 'timeControlPanel' ), {
        bottom: STAGE_SIZE.bottom - 10,
        centerX: STAGE_SIZE.centerX,
        scale: 1.5
      } );
      this.addChild( timeControlPanel );

      // Add measuring tape
      const unitsProperty = new Property( { name: thousandMilesString, multiplier: THOUSAND_MILES_MULTIPLIER } );
      const measuringTapeNode = new MeasuringTapeNode( unitsProperty, model.showMeasuringTapeProperty, {
        basePositionProperty: scene.measuringTapeStartPointProperty,
        tipPositionProperty: scene.measuringTapeEndPointProperty,
        textBackgroundColor: 'rgba( 0, 0, 0, 0.65 )',

        // allows distances to be measured if the planets go outside of model bounds,
        // see https://github.com/phetsims/gravity-and-orbits/issues/281
        isTipDragBounded: false,

        // space station gets 1 sig fig, the other bodies have 0
        significantFigures: ( bodies[ 1 ].name === GravityAndOrbitsBodies.SATELLITE ) ? 1 : 0
      } );

      scene.transformProperty.link( transform => measuringTapeNode.setModelViewTransform( transform ) );
      scene.modelBoundsProperty.link( bounds => {
        const basePosition = measuringTapeNode.basePositionProperty.get();
        measuringTapeNode.setDragBounds( bounds );

        // if the position of the base has changed due to modifying the
        // drag bounds, we want to subtract the difference from the position
        // of the tip so that the measured value remains constant
        if ( !measuringTapeNode.basePositionProperty.get().equals( basePosition ) ) {
          const difference = basePosition.minus( measuringTapeNode.basePositionProperty.get() );
          measuringTapeNode.tipPositionProperty.set( measuringTapeNode.tipPositionProperty.get().minus( difference ) );
        }

        // Tell each of the bodies about the stage size (in model coordinates) so they know if they are out of bounds
        for ( let i = 0; i < bodies.length; i++ ) {
          bodies[ i ].boundsProperty.set( scene.transformProperty.get().viewToModelBounds( STAGE_SIZE ) );
        }
      } );

      // measuring tape text should change with color Profile
      GravityAndOrbitsColorProfile.measuringTapeTextProperty.linkAttribute( measuringTapeNode, 'textColor' );
      this.addChild( measuringTapeNode );

      // If any body is out of bounds, show a "return object" button
      const anythingReturnable = DerivedProperty.or( isReturnableProperties );

      const returnButton = new TextPushButton( returnObjectsString, {
        font: new PhetFont( 16 ),
        textFill: 'black',
        x: 100,
        y: 100,
        listener: () => {

          // the return button should behave exactly like the rewind button
          // all objects should be restored to their saved state, and then
          // pause the orbital mode
          scene.rewind();
          scene.isPlayingProperty.set( false );
        },
        tandem: tandem.createTandem( 'returnButton' )
      } );
      this.addChild( returnButton );

      anythingReturnable.linkAttribute( returnButton, 'visible' );

      // Zoom controls
      const scaleControl = new ScaleSlider( scene.zoomLevelProperty, tandem.createTandem( 'scaleControl' ), { // TODO: Rename class to ScaleControl
        top: STAGE_SIZE.top + 10
      } );
      scaleControl.left = scaleControl.width / 2;
      this.addChild( scaleControl );
    }
  }

  // @static
  GravityAndOrbitsSceneView.STAGE_SIZE = STAGE_SIZE;
  GravityAndOrbitsSceneView.buttonBackgroundColor = buttonBackgroundColor;

  return gravityAndOrbits.register( 'GravityAndOrbitsSceneView', GravityAndOrbitsSceneView );
} );