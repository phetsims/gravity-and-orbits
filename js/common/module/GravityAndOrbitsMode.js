// Copyright 2014-2015, University of Colorado Boulder

/**
 * A GravityAndOrbitsMode behaves like a module, it has its own model, control panel, canvas, and remembers its state
 * when you leave and come back. It is created with defaults from ModeList.Mode.
 * <p/>
 * The sim was designed this way so that objects are replaced instead of mutated.
 * For instance, when switching from Mode 1 to Mode 2, instead of removing Mode 1 bodies from the model,
 * storing their state, and replacing with the Mode 2 bodies, this paradigm just replaces the entire model instance.
 * <p/>
 * The advantage of this approach is that model states, canvas states and control panels are always correct,
 * and it is impossible to end up with a bug in which you have a mixture of components from multiple modes.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Rectangle = require( 'DOT/Rectangle' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Property = require( 'AXON/Property' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var GravityAndOrbitsModel = require( 'GRAVITY_AND_ORBITS/common/model/GravityAndOrbitsModel' );
  var GravityAndOrbitsClock = require( 'GRAVITY_AND_ORBITS/common/model/GravityAndOrbitsClock' );
  var GravityAndOrbitsCanvas = require( 'GRAVITY_AND_ORBITS/common/view/GravityAndOrbitsCanvas' );
  var GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  // constants
  var PLAY_AREA_WIDTH = GravityAndOrbitsCanvas.STAGE_SIZE.width;
  var PLAY_AREA_HEIGHT = GravityAndOrbitsCanvas.STAGE_SIZE.height;

  /**
   * Create a new GravityAndOrbitsMode that shares ModeListParameterList values with other modes
   * @param {number} forceScale
   * @param {boolean} active
   * @param {number} dt
   * @param {function.<number, string>} timeFormatter
   * @param {Node} iconImage
   * @param {number} defaultOrbitalPeriod
   * @param {number} velocityVectorScale
   * @param {function.<BodyNode, Property.<boolean>, Node>} massReadoutFactory
   * @param {Line} initialMeasuringTapeLocation
   * @param {number} defaultZoomScale
   * @param {Vector2} zoomOffset
   * @param {number} gridSpacing
   * @param {Vector2} gridCenter
   * @param {ModeListParameterList} p
   * @constructor
   */
  function GravityAndOrbitsMode( forceScale, active, dt, timeFormatter, iconImage, defaultOrbitalPeriod,
                                 velocityVectorScale, massReadoutFactory, initialMeasuringTapeLocation,
                                 defaultZoomScale, zoomOffset, gridSpacing, gridCenter, p ) {

    // @public
    PropertySet.call( this, {
      active: active, // @public {boolean}

      // Flag to indicate whether any value has deviated from the original value
      deviatedFromDefaults: false, // @private
      measuringTapeStartPoint: initialMeasuringTapeLocation.p1,
      measuringTapeEndPoint: initialMeasuringTapeLocation.p2,
      zoomLevel: 1 // additional scale factor on top of defaultZoomScale
    } );

    var thisMode = this;

    this.canvas = null; // @public

    this.dt = dt; // @private
    this.p = p; // @private
    this.forceScale = forceScale; // @private
    this.iconImage = iconImage; // @private

    // Precomputed value for the orbital period under default conditions (i.e. no other changes),
    // for purposes of determining the path length (about 2 orbits)
    this.defaultOrbitalPeriod = defaultOrbitalPeriod; // @private

    // How much to scale (shrink or grow) the velocity vectors; a mapping from meters/second to stage coordinates
    this.velocityVectorScale = velocityVectorScale; // @public
    this.gridSpacing = gridSpacing; // @public - in meters
    this.gridCenter = gridCenter; // @public
    this.rewindingProperty = p.rewindingProperty; // save a reference to the rewinding property of p
    this.timeSpeedScaleProperty = p.timeSpeedScaleProperty; // @public
    this.timeFormatter = timeFormatter; // @public

    // Function that creates a Node to readout the mass for the specified body node (with the specified visibility flag)
    this.massReadoutFactory = massReadoutFactory;

    this.modelBoundsProperty = new Property(); // @public - not in the Java version, needed for movableDragHandler bounds
    this.transformProperty = new Property( thisMode.createTransform( defaultZoomScale, zoomOffset ) ); // @public

    this.zoomLevelProperty.link( function() {
      thisMode.transformProperty.set( thisMode.createTransform( defaultZoomScale, zoomOffset ) );
    } );

    // @private
    this.model = new GravityAndOrbitsModel(
      new GravityAndOrbitsClock( dt, p.steppingProperty, this.timeSpeedScaleProperty ), p.gravityEnabledProperty );

    // When the user pauses the clock, assume they will change some other parameters as well, and set a new rewind point
    this.rewindClockTime = 0; // @private

    this.getClock().runningProperty.onValue( false, function() {
      thisMode.rewindClockTime = thisMode.getClock().getSimulationTime();
    } );

    Property.multilink( [ p.playButtonPressedProperty, this.activeProperty ], function( playButtonPressed, active ) {
      thisMode.model.clock.setRunning( playButtonPressed && active );
    } );
  }

  gravityAndOrbits.register( 'GravityAndOrbitsMode', GravityAndOrbitsMode );

  return inherit( PropertySet, GravityAndOrbitsMode, {

    /**
     * @private
     * Create the transform from model coordinates to stage coordinates
     * @param defaultZoomScale
     * @param zoomOffset
     * @returns {*}
     */
    createTransform: function( defaultZoomScale, zoomOffset ) {
      var targetRectangle = this.getTargetRectangle( defaultZoomScale * this.zoomLevelProperty.get(), zoomOffset );
      var minX = targetRectangle.x;
      var minY = targetRectangle.y;
      var maxX = targetRectangle.x + targetRectangle.width;
      var maxY = targetRectangle.y + targetRectangle.height;
      var modelBounds = new Bounds2( minX, minY, maxX, maxY );
      this.modelBoundsProperty.set( modelBounds );
      return ModelViewTransform2.createRectangleInvertedYMapping(
        modelBounds, new Bounds2( 0, 0, PLAY_AREA_WIDTH, PLAY_AREA_HEIGHT ) );
    },

    /**
     * @private
     * Find the rectangle that should be viewed in the model
     * @param targetScale
     * @param targetCenterModelPoint
     * @returns {Rectangle}
     */
    getTargetRectangle: function( targetScale, targetCenterModelPoint ) {
      var z = targetScale * 1.5E-9;
      var modelWidth = PLAY_AREA_WIDTH / z;
      var modelHeight = PLAY_AREA_HEIGHT / z;
      return new Rectangle(
        -modelWidth / 2 + targetCenterModelPoint.x,
        -modelHeight / 2 + targetCenterModelPoint.y,
        modelWidth,
        modelHeight );
    },

    /**
     * @public
     * Gets the number of points that should be used to draw a trace, should be enough so that two periods for the
     * default orbit are visible.
     * TODO: Remove this, it makes more sense for the maxPathLength to be computed in view coordinates
     */
    getMaxPathLength: function() {

      // couldn't use 2 as requested because it caused an awkward looking behavior for the lunar orbit
      var numberOfPathPeriods = 1.5;
      return ( Math.ceil( numberOfPathPeriods * this.defaultOrbitalPeriod / this.dt ) );
    },

    // @public
    getClock: function() {
      return this.model.clock;
    },

    // @public
    getBodies: function() {
      return this.model.getBodies();
    },

    /**
     * @public
     * @param body
     */
    addBody: function( body ) {
      this.model.addBody( body );
      var thisMode = this;
      var update = function() {
        thisMode.deviatedFromDefaultsProperty.set( true );
      };
      body.massProperty.link( update );
      body.on( GravityAndOrbitsConstants.USER_MODIFIED_POSITION, update );
      body.on( GravityAndOrbitsConstants.USER_MODIFIED_VELOCITY, update );
    },

    /**
     * @public
     * @override
     */
    reset: function() {
      PropertySet.prototype.reset.call( this );

      // reset the clock
      this.model.clock.resetSimulationTime();
      this.model.resetAll();
    },

    /**
     * @public
     * @param module
     */
    init: function( module ) {
      this.canvas = new GravityAndOrbitsCanvas( this.model, module, this, this.forceScale );
    },

    /**
     * @public
     * Return the bodies to their original states when the user presses "reset" (not "reset all")
     */
    resetMode: function() {
      this.model.resetBodies();
      this.deviatedFromDefaultsProperty.set( false );
      this.getClock().setSimulationTime( 0.0 );
    },

    /**
     * @public
     * Restore the last set of initial conditions that were set while the sim was paused.
     */
    rewind: function() {
      this.rewindingProperty.set( true );
      this.getClock().setSimulationTime( this.rewindClockTime );
      var bodies = this.model.getBodies();
      for ( var i = 0; i < bodies.length; i++ ) {
        bodies[ i ].rewind();
      }
      this.rewindingProperty.set( false );
    },

    /**
     * @public
     * @returns {Array.<Body>} - All bodies in the mode for which the mass can be changed
     */
    getMassSettableBodies: function() {
      var bodies = this.getBodies();
      var massSettableBodies = [];
      for ( var i = 0; i < bodies.length; i++ ) {
        if ( bodies[ i ].massSettable ) {
          massSettableBodies.push( bodies[ i ] );
        }
      }
      return massSettableBodies;
    }

  } );
} );
