// Copyright 2014-2019, University of Colorado Boulder

/**
 * Provides the play area for a single GravityAndOrbitsMode.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * @see GravityAndOrbitsMode
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

  class GravityAndOrbitsPlayArea extends Rectangle {

    /**
     * Constructor for GravityAndOrbitsPlayArea
     * @param {GravityAndOrbitsModel} model
     * @param {GravityAndOrbitsModule} module
     * @param {GravityAndOrbitsMode} mode
     * @param {number} forceScale
     */
    constructor( model, module, mode, forceScale ) {

      // each orbit mode has its own play area with a CanvasNode for rendering paths
      // each canvas should be excluded from the DOM when invisible, with the exception of iOS Safari,
      // which performs worse in this case when toggling visibility
      const excludeInvisible = !platform.mobileSafari;

      super( 0, 0, WIDTH, HEIGHT, { scale: SCALE, excludeInvisible: excludeInvisible } );

      const bodies = model.getBodies();

      this.addChild( new PathsCanvasNode( bodies, mode.transformProperty, module.showPathProperty, STAGE_SIZE ) );

      const forceVectorColorFill = new Color( 50, 130, 215 );
      const forceVectorColorOutline = new Color( 64, 64, 64 );
      const velocityVectorColorFill = PhetColorScheme.RED_COLORBLIND;
      const velocityVectorColorOutline = new Color( 64, 64, 64 );

      // Use canvas coordinates to determine whether something has left the visible area
      const returnable = [];
      for ( let i = 0; i < bodies.length; i++ ) {
        const bodyNode = new BodyNode( bodies[ i ], bodies[ i ].labelAngle, module.playButtonPressedProperty, mode );
        const massReadoutNode = mode.massReadoutFactory( bodyNode, module.showMassProperty );
        this.addChild( bodyNode );
        bodyNode.addChild( massReadoutNode );

        ( bodyNode => {
          const property = new DerivedProperty( [ bodies[ i ].positionProperty, mode.zoomLevelProperty ], () => {

            // the return objects button should be visible when a body is out of bounds
            // and not at the rewind position
            const atRewindPosition = bodyNode.body.positionProperty.equalsRewindPoint();
            return !STAGE_SIZE.intersectsBounds( bodyNode.bounds ) && !atRewindPosition;
          } );
          returnable.push( property );
        } )( bodyNode );
      }

      // Add gravity force vector nodes
      for ( let i = 0; i < bodies.length; i++ ) {
        this.addChild( new VectorNode( bodies[ i ], mode.transformProperty, module.showGravityForceProperty,
          bodies[ i ].forceProperty, forceScale, forceVectorColorFill, forceVectorColorOutline ) );
      }

      // Add velocity vector nodes
      for ( let i = 0; i < bodies.length; i++ ) {
        if ( !bodies[ i ].fixed ) {
          this.addChild( new GrabbableVectorNode( bodies[ i ], mode.transformProperty, module.showVelocityProperty,
            bodies[ i ].velocityProperty, mode.velocityVectorScale, velocityVectorColorFill, velocityVectorColorOutline,
            vString ) );
        }
      }

      // Add explosion nodes, which are always in the scene graph but only visible during explosions
      for ( let i = 0; i < bodies.length; i++ ) {
        this.addChild( new ExplosionNode( bodies[ i ], mode.transformProperty ) );
      }

      // Add the node for the overlay grid, setting its visibility based on the module.showGridProperty
      const gridNode = new GridNode( mode.transformProperty, mode.gridSpacing, mode.gridCenter, 28 );
      module.showGridProperty.linkAttribute( gridNode, 'visible' );
      this.addChild( gridNode );

      this.addChild( new DayCounter( mode.timeFormatter, model.clock,
        { bottom: STAGE_SIZE.bottom - 20, right: STAGE_SIZE.right - 50, scale: 1.2 } ) );

      // Control Panel and reset all button are now added in the screen view to reduce the size of the screen graph

      // Add play/pause, rewind, and step buttons
      const timeControlPanel = new TimeControlPanel( module.modeProperty, module.playButtonPressedProperty, bodies,
        { bottom: STAGE_SIZE.bottom - 10, centerX: STAGE_SIZE.centerX, scale: 1.5 } );
      this.addChild( timeControlPanel );

      // Add measuring tape
      const unitsProperty = new Property( { name: thousandMilesString, multiplier: THOUSAND_MILES_MULTIPLIER } );
      const measuringTapeNode = new MeasuringTapeNode( unitsProperty, module.measuringTapeVisibleProperty, {
        basePositionProperty: mode.measuringTapeStartPointProperty,
        tipPositionProperty: mode.measuringTapeEndPointProperty,
        isTipDragBounded: false,
        textBackgroundColor: 'rgba( 0, 0, 0, 0.65 )',

        // space station gets 1 sig fig, the other bodies have 0
        significantFigures: ( bodies[ 1 ].name === GravityAndOrbitsBodies.SATELLITE ) ? 1 : 0
      } );

      mode.transformProperty.link( transform => measuringTapeNode.setModelViewTransform( transform ) );
      mode.modelBoundsProperty.link( bounds => {
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
          bodies[ i ].boundsProperty.set( mode.transformProperty.get().viewToModelBounds( STAGE_SIZE ) );
        }
      } );

      // measuring tape text should change with color Profile
      GravityAndOrbitsColorProfile.measuringTapeTextProperty.linkAttribute( measuringTapeNode, 'textColor' );
      this.addChild( measuringTapeNode );

      // If any body is out of bounds, show a "return object" button
      // REVIEW: why does this need arguments.  Should there be a better pattern here?
      const anythingReturnable = new DerivedProperty( returnable, function() {
        return _.some( arguments, _.identity );
      } );

      const returnButton = new TextPushButton( returnObjectsString, {
        font: new PhetFont( 16 ),
        textFill: 'black',
        x: 100,
        y: 100,
        listener: () => {

          // the return button should behave exactly like the rewind button
          // all objects should be restored to their saved state, and then
          // pause the orbital mode
          mode.rewind();
          mode.playButtonPressedProperty.set( false );
        }
      } );
      this.addChild( returnButton );

      anythingReturnable.linkAttribute( returnButton, 'visible' );

      // Zoom controls
      const scaleSlider = new ScaleSlider( mode.zoomLevelProperty, { top: STAGE_SIZE.top + 10 } );
      scaleSlider.left = scaleSlider.width / 2;
      this.addChild( scaleSlider );
    }
  }

  // @static
  GravityAndOrbitsPlayArea.STAGE_SIZE = STAGE_SIZE;
  GravityAndOrbitsPlayArea.buttonBackgroundColor = buttonBackgroundColor;

  return gravityAndOrbits.register( 'GravityAndOrbitsPlayArea', GravityAndOrbitsPlayArea );
} );