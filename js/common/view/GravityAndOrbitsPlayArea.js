// Copyright 2014-2015, University of Colorado Boulder

/**
 * Provides the play area for a single GravityAndOrbitsMode.
 *
 * @author Sam Reid
 * @author Aaron Davis
 * @see GravityAndOrbitsMode
 */
define( function( require ) {
  'use strict';

  // modules
  var BodyNode = require( 'GRAVITY_AND_ORBITS/common/view/BodyNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Color = require( 'SCENERY/util/Color' );
  var DayCounter = require( 'GRAVITY_AND_ORBITS/common/view/DayCounter' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var ExplosionNode = require( 'GRAVITY_AND_ORBITS/common/view/ExplosionNode' );
  var GAOBodiesEnum = require( 'GRAVITY_AND_ORBITS/common/model/GAOBodiesEnum' );
  var GrabbableVectorNode = require( 'GRAVITY_AND_ORBITS/common/view/GrabbableVectorNode' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  var GridNode = require( 'GRAVITY_AND_ORBITS/common/view/GridNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  var PathsCanvasNode = require( 'GRAVITY_AND_ORBITS/common/view/PathsCanvasNode' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var platform = require( 'PHET_CORE/platform' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ScaleSlider = require( 'GRAVITY_AND_ORBITS/common/view/ScaleSlider' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var TimeControlPanel = require( 'GRAVITY_AND_ORBITS/common/view/TimeControlPanel' );
  var VectorNode = require( 'GRAVITY_AND_ORBITS/common/view/VectorNode' );

  // strings
  var returnObjectsString = require( 'string!GRAVITY_AND_ORBITS/returnObjects' );
  var thousandMilesString = require( 'string!GRAVITY_AND_ORBITS/thousandMiles' );
  var vString = require( 'string!GRAVITY_AND_ORBITS/v' );

  // constants
  var SCALE = 0.8; // these numbers come from trying to match the original MLL port of this sim
  var WIDTH = 790 * ( 1 / SCALE );
  var HEIGHT = 618 * ( 1 / SCALE );
  var STAGE_SIZE = new Bounds2( 0, 0, WIDTH, HEIGHT );
  var buttonBackgroundColor = new Color( 255, 250, 125 );
  var METERS_PER_MILE = 0.000621371192;
  var THOUSAND_MILES_MULTIPLIER = METERS_PER_MILE / 1000;

  /**
   * Constructor for GravityAndOrbitsPlayArea
   * @param {GravityAndOrbitsModel} model
   * @param {GravityAndOrbitsModule} module
   * @param {GravityAndOrbitsMode} mode
   * @param {number} forceScale
   * @constructor
   */
  function GravityAndOrbitsPlayArea( model, module, mode, forceScale ) {

    // each orbit mode has its own play area with a CanvasNode for rendering paths
    // each canvas should be excluded from the DOM when invisible, with the exception of iOS Safari,
    // which performs worse in this case when toggling visibility
    var excludeInvisible = !platform.mobileSafari;
    
    Rectangle.call( this, 0, 0, WIDTH, HEIGHT, { scale: SCALE, excludeInvisible: excludeInvisible } );
    var self = this;

    var bodies = model.getBodies();
    var i;

    this.addChild( new PathsCanvasNode( bodies, mode.transformProperty, module.showPathProperty, STAGE_SIZE ) );

    var forceVectorColorFill = new Color( 50, 130, 215 );
    var forceVectorColorOutline = new Color( 64, 64, 64 );
    var velocityVectorColorFill = PhetColorScheme.RED_COLORBLIND;
    var velocityVectorColorOutline = new Color( 64, 64, 64 );

    // Use canvas coordinates to determine whether something has left the visible area
    var returnable = [];
    for ( i = 0; i < bodies.length; i++ ) {
      var bodyNode = new BodyNode( bodies[ i ], bodies[ i ].labelAngle, module.playButtonPressedProperty, mode );
      var massReadoutNode = mode.massReadoutFactory( bodyNode, module.showMassProperty );
      self.addChild( bodyNode );
      bodyNode.addChild( massReadoutNode );

      (function( bodyNode ) {
        var property = new DerivedProperty( [ bodies[ i ].positionProperty, mode.zoomLevelProperty ], function() {

          // the return objects button should be visible when a body is out of bounds
          // and not at the rewind position
          var atRewindPosition = bodyNode.body.positionProperty.equalsRewindPoint();
          return !STAGE_SIZE.intersectsBounds( bodyNode.bounds ) && !atRewindPosition;
        } );
        returnable.push( property );
      })( bodyNode );
    }

    // Add gravity force vector nodes
    for ( i = 0; i < bodies.length; i++ ) {
      this.addChild( new VectorNode( bodies[ i ], mode.transformProperty, module.showGravityForceProperty,
        bodies[ i ].forceProperty, forceScale, forceVectorColorFill, forceVectorColorOutline ) );
    }

    // Add velocity vector nodes
    for ( i = 0; i < bodies.length; i++ ) {
      if ( !bodies[ i ].fixed ) {
        this.addChild( new GrabbableVectorNode( bodies[ i ], mode.transformProperty, module.showVelocityProperty,
          bodies[ i ].velocityProperty, mode.velocityVectorScale, velocityVectorColorFill, velocityVectorColorOutline,
          vString ) );
      }
    }

    // Add explosion nodes, which are always in the scene graph but only visible during explosions
    for ( i = 0; i < bodies.length; i++ ) {
      this.addChild( new ExplosionNode( bodies[ i ], mode.transformProperty ) );
    }

    // Add the node for the overlay grid, setting its visibility based on the module.showGridProperty
    var gridNode = new GridNode( mode.transformProperty, mode.gridSpacing, mode.gridCenter, 28 );
    module.showGridProperty.linkAttribute( gridNode, 'visible' );
    this.addChild( gridNode );

    this.addChild( new DayCounter( mode.timeFormatter, model.clock,
      { bottom: STAGE_SIZE.bottom - 20, right: STAGE_SIZE.right - 50, scale: 1.2 } ) );

    // Control Panel and reset all button are now added in the screen view to reduce the size of the screen graph

    // Add play/pause, rewind, and step buttons
    var timeControlPanel = new TimeControlPanel( module.modeProperty, module.playButtonPressedProperty, bodies,
      { bottom: STAGE_SIZE.bottom - 10, centerX: STAGE_SIZE.centerX, scale: 1.5 } );
    this.addChild( timeControlPanel );

    // Add measuring tape
    var unitsProperty = new Property( { name: thousandMilesString, multiplier: THOUSAND_MILES_MULTIPLIER } );
    var measuringTapeNode = new MeasuringTapeNode( unitsProperty, module.measuringTapeVisibleProperty, {
      basePositionProperty: mode.measuringTapeStartPointProperty,
      tipPositionProperty: mode.measuringTapeEndPointProperty,
      isTipDragBounded: false,

      // space station gets 1 sig fig, the other bodies have 0
      significantFigures: ( bodies[ 1 ].name === GAOBodiesEnum.SATELLITE ) ? 1 : 0
    } );

    mode.transformProperty.link( function( transform ) {
      measuringTapeNode.setModelViewTransform( transform );
    } );
    mode.modelBoundsProperty.link( function( bounds ) {
      var basePosition = measuringTapeNode.basePositionProperty.get();
      measuringTapeNode.setDragBounds( bounds );

      // if the position of the base has changed due to modifying the
      // drag bounds, we want to subtract the difference from the position
      // of the tip so that the measured value remains constant
      if ( !measuringTapeNode.basePositionProperty.get().equals( basePosition ) ) {
        var difference = basePosition.minus( measuringTapeNode.basePositionProperty.get() );
        measuringTapeNode.tipPositionProperty.set( measuringTapeNode.tipPositionProperty.get().minus( difference ) );
      }

      // Tell each of the bodies about the stage size (in model coordinates) so they know if they are out of bounds
      for ( i = 0; i < bodies.length; i++ ) {
        bodies[ i ].boundsProperty.set( mode.transformProperty.get().viewToModelBounds( STAGE_SIZE ) );
      }
    } );

    // measuring tape text should change with color Profile
    GravityAndOrbitsColorProfile.measuringTapeTextProperty.linkAttribute( measuringTapeNode, 'textColor' );
    this.addChild( measuringTapeNode );

    // If any body is out of bounds, show a "return object" button
    var anythingReturnable = new DerivedProperty( returnable, function() {
      return _.some( arguments, _.identity );
    } );

    var returnButton = new TextPushButton( returnObjectsString, {
      font: new PhetFont( 16 ),
      textFill: 'black',
      x: 100,
      y: 100,
      listener: function() {

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
    var scaleSlider = new ScaleSlider( mode.zoomLevelProperty, { top: STAGE_SIZE.top + 10 } );
    scaleSlider.left = scaleSlider.width / 2;
    this.addChild( scaleSlider );
  }

  gravityAndOrbits.register( 'GravityAndOrbitsPlayArea', GravityAndOrbitsPlayArea );

  return inherit( Rectangle, GravityAndOrbitsPlayArea, {}, {
    STAGE_SIZE: STAGE_SIZE,
    buttonBackgroundColor: buttonBackgroundColor
  } );
} );
