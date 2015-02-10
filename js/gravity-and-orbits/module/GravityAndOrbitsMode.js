// Copyright 2002-2014, University of Colorado

/**
 * A GravityAndOrbitsMode behaves like a module, it has its own model, control panel, canvas, and remembers its state when you leave and come back.  It is created with defaults from ModeList.Mode.
 * <p/>
 * The sim was designed this way so that objects are replaced instead of mutated.
 * For instance, when switching from Mode 1 to Mode 2, instead of removing Mode 1 bodies from the model, storing their state, and replacing with the Mode 2 bodies,
 * this paradigm just replaces the entire model instance.
 * <p/>
 * The advantage of this approach is that model states, canvas states and control panels are always correct, and it is impossible to end up with a bug in which you have
 * a mixture of components from multiple modes.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var UserComponents = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/UserComponents' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
//  var GAORadioButton = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/controlpanel/GAORadioButton' );
//  var GravityAndOrbitsControlPanel = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/controlpanel/GravityAndOrbitsControlPanel' );
  var Body = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/Body' );
//  var GravityAndOrbitsClock = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/GravityAndOrbitsClock' );
  var GravityAndOrbitsModel = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/GravityAndOrbitsModel' );
  var BodyNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/BodyNode' );
  var GravityAndOrbitsCanvas = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/GravityAndOrbitsCanvas' );
  var Node = require( 'SCENERY/nodes/Node' );
//  var createRectangleInvertedYMapping = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform.createRectangleInvertedYMapping' );//static

  // the play area only takes up the left side of the canvas; the control panel is on the right side
  var PLAY_AREA_WIDTH = GravityAndOrbitsCanvas.STAGE_SIZE.width * 0.60;
  var PLAY_AREA_HEIGHT = GravityAndOrbitsCanvas.STAGE_SIZE.height;

  /**
   * Create a new GravityAndOrbitsMode that shares ModeListParameterList values with other modes
   *
   * @param {UserComponent} userComponent
   * @param {number} forceScale
   * @param {boolean} active
   * @param {number} dt
   * @param {function<number, string>} timeFormatter
   * @param {Image} iconImage
   * @param {number} defaultOrbitalPeriod
   * @param {number} velocityVectorScale
   * @param {function<BodyNode, Property<boolean>, Node>} massReadoutFactory
   * @param {Line} initialMeasuringTapeLocation
   * @param {number} defaultZoomScale
   * @param {Vector2} zoomOffset
   * @param {number} gridSpacing
   * @param {Vector2} gridCenter
   * @param {ModeListParameterList} p
   * @constructor
   */
  function GravityAndOrbitsMode( userComponent, forceScale, active, dt, timeFormatter, iconImage, defaultOrbitalPeriod, velocityVectorScale, massReadoutFactory, initialMeasuringTapeLocation, defaultZoomScale, zoomOffset, gridSpacing, gridCenter, p ) {

    // public Properties from the java version
    PropertySet.call( this, {
      transform: 0, // mvt
      active: active, // boolean
      deviatedFromDefaults: false,
      timeSpeedScale: 0, // number
      measuringTapeStartPoint: new Vector2( initialMeasuringTapeLocation.p1 ),
      measuringTapeEndPoint: new Vector2( initialMeasuringTapeLocation.p2 ),
      zoomLevel: 1 // additional scale factor on top of defaultZoomScale
    } );

    var thisMode = this;

    //private
    this.canvas = null;

    // Flag to indicate whether any value has deviated from the original value (which was originally used for showing a reset button, but not anymore)
    // private
    this.deviatedFromDefaults = new Property( false );

    //additional scale factor on top of defaultZoomScale
    this.zoomLevel = new Property( 1.0 );
    this.userComponent = userComponent; // private
    this.dt = dt; // private
    this.p = p;
    this.forceScale = forceScale; // private
    this.iconImage = iconImage; // private

    // Precomputed value for the orbital period under default conditions (i.e. no other changes),
    // for purposes of determining the path length (about 2 orbits)
    this.defaultOrbitalPeriod = defaultOrbitalPeriod; // private

    // How much to scale (shrink or grow) the velocity vectors; a mapping from meters/second to stage coordinates
    this.velocityVectorScale = velocityVectorScale; // private
    this.gridSpacing = gridSpacing; // in meters, private
    this.gridCenter = gridCenter; // private
    this.rewindingProperty = p.rewinding; // save a reference to the rewinding property of p
    this.timeSpeedScaleProperty = p.timeSpeedScale;
    this.active = new Property( active );
    this.timeFormatter = timeFormatter; // private

    // Function that creates a PNode to readout the mass for the specified body node (with the specified visibility flag)
    this.massReadoutFactory = massReadoutFactory;

    this.transform = new Property( thisMode.createTransform( defaultZoomScale, zoomOffset ) );

    this.zoomLevel.link( function() {
      thisMode.transform.set( thisMode.createTransform( defaultZoomScale, zoomOffset ) );
    } );

    this.transform.link( function( t ) {
      console.log( t );
    } );

    // private
    this.model = new GravityAndOrbitsModel( p.gravityEnabled );

    // When the user pauses the clock, assume they will change some other parameters as well, and set a new rewind point
    this.rewindClockTime = 0; // private

//    this.getClock().addClockListener( new ClockAdapter().withAnonymousClassBody( {
//      clockPaused: function( clockEvent ) {
//        thisMode.rewindClockTime = clockEvent.getSimulationTime();
//      }
//    } ) );

//    Property.multilink( [p.playButtonPressed, this.active], function( playButtonPressed, active ) {
//      thisMode.model.getClock().setRunning( playButtonPressed && active );
//    } );
  }

  return inherit( PropertySet, GravityAndOrbitsMode, {

    /**
     * @private
     *
     * Create the transform from model coordinates to stage coordinates
     * @param defaultZoomScale
     * @param zoomOffset
     * @returns {*}
     */
    createTransform: function( defaultZoomScale, zoomOffset ) {
      var targetRectangle = this.getTargetRectangle( defaultZoomScale * this.zoomLevel.get(), zoomOffset );
//      var x = targetRectangle.getMinX();
//      var y = targetRectangle.getMinY();
//      var w = targetRectangle.getMaxX() - x;
//      var h = targetRectangle.getMaxY() - y;
      var minX = targetRectangle.x;
      var minY = targetRectangle.y;
      var maxX = targetRectangle.x + targetRectangle.width;
      var maxY = targetRectangle.y + targetRectangle.height;
      return ModelViewTransform2.createRectangleInvertedYMapping( new Bounds2( minX, minY, maxX, maxY ), new Bounds2( 0, 0, PLAY_AREA_WIDTH, PLAY_AREA_HEIGHT ) );
    },

    /**
     * Find the rectangle that should be viewed in the model
     * @param targetScale
     * @param targetCenterModelPoint
     * @returns {Rectangle}
     */
    getTargetRectangle: function( targetScale, targetCenterModelPoint ) {
      var z = targetScale * 1.5E-9;
      var modelWidth = PLAY_AREA_WIDTH / z;
      var modelHeight = PLAY_AREA_HEIGHT / z;
      return new Rectangle( -modelWidth / 2 + targetCenterModelPoint.x, -modelHeight / 2 + targetCenterModelPoint.y, modelWidth, modelHeight );
    },

    /**
     * Gets the number of points that should be used to draw a trace, should be enough so that two periods for the default orbit are visible.
     */
    getMaxPathLength: function() {
      //couldn't use 2 as requested because it caused an awkward looking behavior for the lunar orbit
      var numberOfPathPeriods = 1.5;
      return (Math.ceil( numberOfPathPeriods * this.defaultOrbitalPeriod / this.dt ));
    },

    getClock: function() {
      return this.model.getClock();
    },

    /**
     *
     * @param body
     */
    addBody: function( body ) {
      this.model.addBody( body );
//      var updater = new SimpleObserver().withAnonymousClassBody( {
//        update: function() {
//          this.deviatedFromDefaults.set( true );
//        }
//      } );
      var thisMode = this;
      var update = function() {
        thisMode.deviatedFromDefaults.set( true );
//        updater.update();
      };
      body.getMassProperty().link( update );
      body.addUserModifiedPositionListener( update );
      body.addUserModifiedVelocityListener( update );
    },

    getModel: function() {
      return this.model;
    },

    reset: function() {
      // reset the clock
      this.model.getClock().resetSimulationTime();
      this.model.resetAll();
      this.deviatedFromDefaults.reset();
      this.measuringTapeStartPoint.reset();
      this.measuringTapeEndPoint.reset();
      this.zoomLevel.reset();
    },

    getCanvas: function() {
      return this.canvas;
    },

    /**
     *
     * @param module
     */
    init: function( module ) {
      this.canvas = new GravityAndOrbitsCanvas( this.model, module, this, this.forceScale );
    },

    /**
     * Create a control for the specified mode
     * @param modeProperty
     * @returns {*}
     */
    newControl: function( modeProperty ) {
      return new JPanel().withAnonymousClassBody( {
        initializer: function() {
          setForeground( GravityAndOrbitsControlPanel.FOREGROUND );
          add( new GAORadioButton( userComponent, null, modeProperty, GravityAndOrbitsMode.this ) );
          add( new JLabel( new ImageIcon( iconImage ) ).withAnonymousClassBody( {
            initializer: function() {
              addMouseListener( new MouseAdapter().withAnonymousClassBody( {
                mouseReleased: function( e ) {
                  SimSharingManager.sendUserMessage( chain( userComponent, "icon" ), UserComponentTypes.icon, pressed );
                  //Make it so clicking on the icon also activates the mode
                  modeProperty.set( GravityAndOrbitsMode.this );
                }
              } ) );
            }
          } ) );
        }
      } );
    },

    /**
     *
     * @returns {*}
     */
    getTimeFormatter: function() {
      return this.timeFormatter;
    },

    /**
     * Return the bodies to their original states when the user presses "reset" (not "reset all")
     */
    resetMode: function() {
      this.model.resetBodies();
      this.deviatedFromDefaults.set( false );
      //Same as pressing "clear" in the FloatingClockControlNode
      this.getClock().setSimulationTime( 0.0 );
    },

    /**
     *
     * @returns {*}
     */
    getVelocityVectorScale: function() {
      return this.velocityVectorScale;
    },

    /**
     * Restore the last set of initial conditions that were set while the sim was paused.
     */
    rewind: function() {
      this.rewindingProperty.set( true );
      this.getClock().setSimulationTime( rewindClockTime );
      var bodies = this.model.getBodies();
      for ( var i = 0; i < bodies.length; i++ ) {
        bodies[i].rewind();
      }
      this.rewindingProperty.set( false );
    },

    getGridSpacing: function() {
      return this.gridSpacing;
    },

    getGridCenter: function() {
      return this.gridCenter;
    }
  } );
} );
