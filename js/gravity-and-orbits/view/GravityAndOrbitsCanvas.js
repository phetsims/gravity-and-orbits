// Copyright 2002-2015, University of Colorado Boulder

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
  var inherit = require( 'PHET_CORE/inherit' );
  var PathsNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/PathsNode' );
  var BodyNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/BodyNode' );
  var GridNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/GridNode' );
  var Color = require( 'SCENERY/util/Color' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Property = require( 'AXON/Property' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var VectorNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/VectorNode' );
  var GrabbableVectorNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/GrabbableVectorNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ExplosionNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/ExplosionNode' );
  var DayCounter = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/bottom-control-panel/DayCounter' );
  var ScaleSlider = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/ScaleSlider' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var TimeControlPanel = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/bottom-control-panel/TimeControlPanel' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );

  // strings
  var thousandMilesString = require( 'string!GRAVITY_AND_ORBITS/thousandMiles' );
  var returnObjectString = require( 'string!GRAVITY_AND_ORBITS/returnObject' );
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
   *
   * @param {GravityAndOrbitsModel} model
   * @param {GravityAndOrbitsModule} module
   * @param {GravityAndOrbitsMode} mode
   * @param {number} forceScale
   * @constructor
   */
  function GravityAndOrbitsCanvas( model, module, mode, forceScale ) {

    //Rectangle.call( this, 0, 0, WIDTH, HEIGHT, { fill: 'rgba(220,220,220,0.3)', scale: SCALE } );
    Rectangle.call( this, 0, 0, WIDTH, HEIGHT, { scale: SCALE, excludeInvisible: true } );
    var thisNode = this;

    var bodies = model.getBodies();
    var i;

    this.addChild( new PathsNode( bodies, mode.transformProperty, module.showPathProperty, STAGE_SIZE ) );

    var forceVectorColorFill = new Color( 50, 130, 215 );
    var forceVectorColorOutline = new Color( 64, 64, 64 );
    var velocityVectorColorFill = PhetColorScheme.RED_COLORBLIND;
    var velocityVectorColorOutline = new Color( 64, 64, 64 );

    // Use canvas coordinates to determine whether something has left the visible area
    var returnable = [];
    for ( i = 0; i < bodies.length; i++ ) {
      var bodyNode = new BodyNode( bodies[ i ], mode.transformProperty, bodies[ i ].labelAngle );
      var massReadoutNode = mode.massReadoutFactory( bodyNode, module.showMassProperty );
      thisNode.addChild( bodyNode );
      bodyNode.addChild( massReadoutNode );

      (function( bodyNode ) {
        var property = new DerivedProperty( [ bodies[ i ].positionProperty ], function() {
          return !STAGE_SIZE.intersectsBounds( bodyNode.bounds );
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
    var gridNode = new GridNode( mode.transformProperty, mode.gridSpacing, mode.gridCenter );
    module.showGridProperty.linkAttribute( gridNode, 'visible' );
    this.addChild( gridNode );

    this.addChild( new DayCounter( mode.timeFormatter, model.clock,
      { bottom: STAGE_SIZE.bottom - 20, right: STAGE_SIZE.right - 50, scale: 1.2 } ) );

    // Control Panel and reset all button are now added in the screen view to reduce the size of the screen graph

    // Add play/pause, rewind, and step buttons
    var timeControlPanel = new TimeControlPanel( module, bodies,
      { bottom: STAGE_SIZE.bottom - 10, centerX: STAGE_SIZE.centerX, scale: 1.5 } );
    this.addChild( timeControlPanel );

    // Add measuring tape
    var unitsProperty = new Property( { name: thousandMilesString, multiplier: THOUSAND_MILES_MULTIPLIER } );
    var measuringTape = new MeasuringTape( unitsProperty, module.measuringTapeVisibleProperty, {
      basePositionProperty: mode.measuringTapeStartPointProperty,
      tipPositionProperty: mode.measuringTapeEndPointProperty,

      // space station gets 1 sig fig, the other bodies have 0
      significantFigures: ( bodies[ 1 ].name === 'Satellite' ) ? 1 : 0
    } );

    mode.transformProperty.link( function( transform ) {
      measuringTape.setModelViewTransform( transform );
    } );
    mode.modelBoundsProperty.link( function( bounds ) {
      measuringTape.setDragBounds( bounds );
    } );
    this.addChild( measuringTape );

    // Tell each of the bodies about the stage size (in model coordinates) so they know if they are out of bounds
    for ( i = 0; i < bodies.length; i++ ) {
      bodies[ i ].boundsProperty.set( mode.transformProperty.get().viewToModelBounds( STAGE_SIZE ) );
    }

    // If any body is out of bounds, show a "return object" button
    var anythingReturnable = new DerivedProperty( returnable, function() {
      return _.any( arguments, _.identity );
    } );

    var returnButton = new TextPushButton( returnObjectString, {
      font: new PhetFont( 16 ),
      textFill: 'white',
      x: 100,
      y: 100,
      listener: function() {
        model.returnBodies();
        module.playButtonPressedProperty.set( false );
      }
    } );
    this.addChild( returnButton );

    anythingReturnable.linkAttribute( returnButton, 'visible' );

    // Zoom controls
    var scaleSlider = new ScaleSlider( mode.zoomLevelProperty, { top: STAGE_SIZE.top + 10 } );
    scaleSlider.left = scaleSlider.width / 2;
    this.addChild( scaleSlider );
  }

  return inherit( Rectangle, GravityAndOrbitsCanvas, {}, {
    STAGE_SIZE: STAGE_SIZE,
    buttonBackgroundColor: buttonBackgroundColor
  } );
} );
