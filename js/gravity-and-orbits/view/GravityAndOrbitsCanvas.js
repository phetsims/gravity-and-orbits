// Copyright 2002-2015, University of Colorado

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
  var PathNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/PathNode' );
  var BodyNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/BodyNode' );
  var GridNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/GridNode' );
  var Color = require( 'SCENERY/util/Color' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Property = require( 'AXON/Property' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var GAOStrings = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GAOStrings' );
  var VectorNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/VectorNode' );
  var GrabbableVectorNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/GrabbableVectorNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ExplosionNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/ExplosionNode' );
  var SpeedRadioButtons = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/bottom-control-panel/SpeedRadioButtons' );
  var DayCounter = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/bottom-control-panel/DayCounter' );
  var ScaleSlider = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/ScaleSlider' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var TimeControlPanel = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/bottom-control-panel/TimeControlPanel' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );

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
    Rectangle.call( this, 0, 0, WIDTH, HEIGHT, { scale: SCALE } );
    var thisNode = this;

    var bodies = model.getBodies();
    var i;

    this.paths = []; // @private - used in step to step the paths
    for ( i = 0; i < bodies.length; i++ ) {
      var path = new PathNode( bodies[ i ], mode.transformProperty, module.showPathProperty, bodies[ i ].getColor(), STAGE_SIZE );
      this.paths.push( path );
      this.addChild( path );
    }

    var forceVectorColorFill = new Color( 50, 130, 215 );
    var forceVectorColorOutline = new Color( 64, 64, 64 );
    var velocityVectorColorFill = PhetColorScheme.RED_COLORBLIND;
    var velocityVectorColorOutline = new Color( 64, 64, 64 );

    // Use canvas coordinates to determine whether something has left the visible area
    var returnable = [];
    for ( i = 0; i < bodies.length; i++ ) {
      var bodyNode = new BodyNode( bodies[ i ], mode.transformProperty, bodies[ i ].getLabelAngle() );
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
        bodies[ i ].getForceProperty(), forceScale, forceVectorColorFill, forceVectorColorOutline ) );
    }

    // Add velocity vector nodes
    for ( i = 0; i < bodies.length; i++ ) {
      if ( !bodies[ i ].fixed ) {
        this.addChild( new GrabbableVectorNode( bodies[ i ], mode.transformProperty, module.showVelocityProperty,
          bodies[ i ].getVelocityProperty(), mode.getVelocityVectorScale(), velocityVectorColorFill, velocityVectorColorOutline,
          'V' ) );  // TODO: i18n of "V", also recommended to trim to 1 char
      }
    }

    // Add explosion nodes, which are always in the scene graph but only visible during explosions
    for ( i = 0; i < bodies.length; i++ ) {
      this.addChild( new ExplosionNode( bodies[ i ], mode.transformProperty ) );
    }

    // Add the node for the overlay grid, setting its visibility based on the module.showGridProperty
    var gridNode = new GridNode( mode.transformProperty, mode.getGridSpacing(), mode.getGridCenter() );
    module.showGridProperty.linkAttribute( gridNode, 'visible' );
    this.addChild( gridNode );

    // Add the speed control slider.
    this.addChild( new SpeedRadioButtons( mode.timeSpeedScaleProperty,
      { bottom: STAGE_SIZE.bottom - 5, left: STAGE_SIZE.left + 5, scale: 1.2 } ) );
    this.addChild( new DayCounter( mode.timeFormatter, model.clock,
      { bottom: STAGE_SIZE.bottom - 20, right: STAGE_SIZE.right - 30, scale: 1.2 } ) );

    // Control Panel and reset all button are now added in the screen view to reduce the size of the screen graph

    // Add play/pause, rewind, and step buttons
    var timeControlPanel = new TimeControlPanel( module, bodies,
      { bottom: STAGE_SIZE.bottom - 10, centerX: STAGE_SIZE.centerX, scale: 1.5 } );
    this.addChild( timeControlPanel );

    // Add measuring tape
    var unitsProperty = new Property( { name: GAOStrings.THOUSAND_MILES, multiplier: THOUSAND_MILES_MULTIPLIER } );
    var measuringTape = new MeasuringTape( unitsProperty, module.measuringTapeVisibleProperty, {
      basePositionProperty: mode.measuringTapeStartPointProperty,
      tipPositionProperty: mode.measuringTapeEndPointProperty,
      significantFigures: ( bodies[ 1 ].name === 'Satellite' ) ? 1 : 0 // space station gets 1 sig fig, the other bodies have 0
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
      bodies[ i ].getBounds().set( mode.transformProperty.get().viewToModelBounds( STAGE_SIZE ) );
    }

    // If any body is out of bounds, show a "return object" button
    var anythingReturnable = new DerivedProperty( returnable, function() {
      return _.any( arguments, _.identity );
    } );

    var returnButton = new TextPushButton( GAOStrings.RETURN_OBJECT, {
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

  return inherit( Rectangle, GravityAndOrbitsCanvas, {
    step: function( dt ) {
      for ( var i = 0; i < this.paths.length; i++ ) {
        this.paths[ i ].step( dt );
      }
    }
  }, {
    STAGE_SIZE: STAGE_SIZE,
    buttonBackgroundColor: buttonBackgroundColor
  } );
} );
