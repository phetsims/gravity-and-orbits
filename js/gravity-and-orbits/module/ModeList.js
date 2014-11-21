// Copyright 2002-2014, University of Colorado

/**
 * ModeList enumerates and declares the possible modes in the GravityAndOrbitsModule, such as 'Sun & Earth' mode.
 * Models (and the bodies they contain) are created in ModeList.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var GAOStrings = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GAOStrings' );
//  var GravityAndOrbitsApplication = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsApplication' );
  var Body = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/Body' );
  var BodyState = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/BodyState' );
  var GravityAndOrbitsClock = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/GravityAndOrbitsClock' );
  var GravityAndOrbitsModel = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/GravityAndOrbitsModel' );
  var BodyNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/BodyNode' );
  var BodyConfiguration = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/BodyConfiguration' );
  var ModeConfig = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/ModeConfig' );
  var GravityAndOrbitsMode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/GravityAndOrbitsMode' );
  var BodyRenderer = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/BodyRenderer' );
  var EarthMassReadoutNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/EarthMassReadoutNode' );
  var SpaceStationMassReadoutNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/SpaceStationMassReadoutNode' );
  var VectorNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/VectorNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var UserComponents = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/UserComponents' );
//  var milesToMeters = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/MeasuringTape/milesToMeters' );//static

  // These constants are only used in ModeList, and ModeList is used to create the specific model instantiations,
  // so we keep them here instead of the model
  var SUN_RADIUS = 6.955E8;
  var SUN_MASS = 1.989E30;
  var EARTH_RADIUS = 6.371E6;
  var EARTH_MASS = 5.9736E24;
  var EARTH_PERIHELION = 147098290E3;
  var EARTH_ORBITAL_SPEED_AT_PERIHELION = 30300;
  var MOON_MASS = 7.3477E22;
  var MOON_RADIUS = 1737.1E3;
  var MOON_EARTH_SPEED = -1.01E3;
  var MOON_SPEED = MOON_EARTH_SPEED;
  var MOON_PERIGEE = 391370E3;
  var MOON_X = EARTH_PERIHELION;
  var MOON_Y = MOON_PERIGEE;
  // see http://en.wikipedia.org/wiki/International_Space_Station
  var SPACE_STATION_RADIUS = 109;
  var SPACE_STATION_MASS = 369914;
  var SPACE_STATION_SPEED = 7706;
  var SPACE_STATION_PERIGEE = 347000;

  var SECONDS_PER_MINUTE = 60;

  // static class: SunEarthModeConfig
  function SunEarthModeConfig() {
    this.sun = new BodyConfiguration( SUN_MASS, SUN_RADIUS, 0, 0, 0, 0 );
    this.earth = new BodyConfiguration( EARTH_MASS, EARTH_RADIUS, EARTH_PERIHELION, 0, 0, EARTH_ORBITAL_SPEED_AT_PERIHELION );
    this.timeScale = 1;
    ModeConfig.call( this, 1.25 );
    this.initialMeasuringTapeLocation = new Line2D.Number( (this.sun.x + this.earth.x) / 3, -this.earth.x / 2, (this.sun.x + this.earth.x) / 3 + milesToMeters( 50000000 ), -this.earth.x / 2 );
    this.forceScale = VectorNode.FORCE_SCALE * 120;
  }

  inherit( ModeConfig, SunEarthModeConfig, {
    getBodies: function() {
      return [ this.sun, this.earth ];
    }
  } );

  // static class: SunEarthMoonModeConfig
  function SunEarthMoonModeConfig() {
    this.sun = new BodyConfiguration( SUN_MASS, SUN_RADIUS, 0, 0, 0, 0 );
    this.earth = new BodyConfiguration( EARTH_MASS, EARTH_RADIUS, EARTH_PERIHELION, 0, 0, EARTH_ORBITAL_SPEED_AT_PERIHELION );
    this.moon = new BodyConfiguration( MOON_MASS, MOON_RADIUS, MOON_X, MOON_Y, MOON_SPEED, EARTH_ORBITAL_SPEED_AT_PERIHELION );
    this.timeScale = 1;
    ModeConfig.call( this, 1.25 );
    this.initialMeasuringTapeLocation = new Line2D.Number( (this.sun.x + this.earth.x) / 3, -this.earth.x / 2, (this.sun.x + this.earth.x) / 3 + milesToMeters( 50000000 ), -this.earth.x / 2 );
    this.forceScale = VectorNode.FORCE_SCALE * 120;
  }

  inherit( ModeConfig, SunEarthMoonModeConfig, {
    getBodies: function() {
      return [ this.sun, this.earth, this.moon ];
    }
  } );

  // static class: EarthMoonModeConfig
  function EarthMoonModeConfig() {
    this.earth = new BodyConfiguration( EARTH_MASS, EARTH_RADIUS, EARTH_PERIHELION, 0, 0, 0 );
    this.moon = new BodyConfiguration( MOON_MASS, MOON_RADIUS, MOON_X, MOON_Y, MOON_SPEED, 0 );
    ModeConfig.call( this, 400 );
    this.initialMeasuringTapeLocation = new Line2D.Number( this.earth.x + this.earth.radius * 2, -this.moon.y * 0.7, this.earth.x + this.earth.radius * 2 + milesToMeters( 100000 ), -this.moon.y * 0.7 );
    this.forceScale = VectorNode.FORCE_SCALE * 45;
  }

  inherit( ModeConfig, EarthMoonModeConfig, {
    getBodies: function() {
      return [ this.earth, this.moon ];
    }
  } );

  // static class: EarthSpaceStationModeConfig
  function EarthSpaceStationModeConfig() {
    this.earth = new BodyConfiguration( EARTH_MASS, EARTH_RADIUS, 0, 0, 0, 0 );
    this.spaceStation = new BodyConfiguration( SPACE_STATION_MASS, SPACE_STATION_RADIUS, SPACE_STATION_PERIGEE + EARTH_RADIUS + SPACE_STATION_RADIUS, 0, 0, SPACE_STATION_SPEED );
    ModeConfig.call( this, 21600 );
    //Sampled at runtime from MeasuringTape
    this.initialMeasuringTapeLocation = new Line2D.Number( 3162119, 7680496, 6439098, 7680496 );
    this.forceScale = VectorNode.FORCE_SCALE * 3E13;
  }

  inherit( ModeConfig, EarthSpaceStationModeConfig, {
    getBodies: function() {
      return [ this.earth, this.spaceStation ];
    }
  } );

  /**
   * Creates a BodyRenderer that just shows the specified image
   * @param {string} image
   * @returns {*}
   */
  var getImageRenderer = function( image ) {
    return function( body, viewDiameter ) {
      return new BodyRenderer.ImageRenderer( body, viewDiameter, image );
    }
  };

  /**
   *Creates a BodyRenderer that shows an image when at the targetMass, otherwise shows a shaded sphere
   * @param {string} image
   * @param {number} targetMass
   * @returns {*}
   */
  var getRenderer = function( image, targetMass ) {
    //the mass for which to use the image
    return function( body, viewDiameter ) {
      return new BodyRenderer.SwitchableBodyRenderer( body, targetMass, new BodyRenderer.ImageRenderer( body, viewDiameter, image ), new BodyRenderer.SphereRenderer( body, viewDiameter ) );
    }
  };

  /**
   * Have to artificially scale up the time readout so that Sun/Earth/Moon mode has a stable orbit with correct periods
   * @param scale
   * @returns {*}
   */
  var scaledDays = function( scale ) {
    return function( time ) {
      var value = (time / GravityAndOrbitsClock.SECONDS_PER_DAY * scale);
      var units = (value == 1) ? GAOStrings.EARTH_DAY : GAOStrings.EARTH_DAYS;
      return MessageFormat.format( GAOStrings.PATTERN_VALUE_UNITS, value, units );
    }
  };

  // non-static inner class: SpaceStation
  function SpaceStation( earthSpaceStation, maxPathLength ) {
    Body.call(
      this,
      UserComponents.satellite,
      GAOStrings.SATELLITE,
      earthSpaceStation.spaceStation.x,
      earthSpaceStation.spaceStation.y,
      ( earthSpaceStation.spaceStation.radius * 2000 ),
      earthSpaceStation.spaceStation.vx,
      earthSpaceStation.spaceStation.vy,
      earthSpaceStation.spaceStation.mass,
      Color.gray,
      Color.white,
      getImageRenderer( 'space-station.png' ),
      ( -Math.PI / 4),
      true,
      maxPathLength,
      true,
      earthSpaceStation.spaceStation.mass,
      GAOStrings.SPACE_STATION,
      p.playButtonPressed,
      p.stepping,
      p.rewinding,
      earthSpaceStation.spaceStation.fixed );
  }

  inherit( Body, SpaceStation );

  // non-static inner class: Moon
  function Moon( massSettable, maxPathLength, massReadoutBelow, body ) {
    Body.call(
      this,
      UserComponents.moon,
      GAOStrings.MOON,
      body.x,
      body.y,
      ( body.radius * 2 ),
      body.vx,
      body.vy,
      body.mass,
      Color.magenta,
      Color.white, //putting this number too large makes a kink or curly-q in the moon trajectory, which should be avoided
      getRenderer( 'moon.png', body.mass ),
      ( -3 * Math.PI / 4 ),
      massSettable,
      maxPathLength,
      massReadoutBelow,
      body.mass,
      GAOStrings.OUR_MOON,
      p.playButtonPressed,
      p.stepping,
      p.rewinding,
      body.fixed );
  }

  inherit( Body, Moon, {
    doReturnBody: function( model ) {
      Body.prototype.doReturnBody( model );
      var earth = model.getBody( 'Planet' );
      //Restore the moon near the earth and with the same relative velocity vector
      if ( earth != null ) {
        var relativePosition = this.positionProperty.initialValue.minus( earth.positionProperty.initialValue );
        this.positionProperty.set( earth.getPosition().plus( relativePosition ) );
        var relativeVelocity = this.velocityProperty.initialValue.minus( earth.velocityProperty.initialValue );
        this.velocityProperty.set( earth.getVelocity().plus( relativeVelocity ) );
      }
      else {
        throw new Error( 'Couldn\'t find planet.' );
      }
    }
  } );

  // non-static inner class: Earth
  function Earth( maxPathLength, body ) {
    Body.call(
      this,
      UserComponents.planet,
      GAOStrings.PLANET,
      body.x,
      body.y,
      ( body.radius * 2 ),
      body.vx,
      body.vy,
      body.mass,
      Color.gray,
      Color.lightGray,
      getRenderer( 'earth_satellite.gif', body.mass ),
      ( -Math.PI / 4 ),
      true,
      maxPathLength,
      true,
      body.mass,
      GAOStrings.EARTH,
      p.playButtonPressed,
      p.stepping,
      p.rewinding,
      body.fixed );
  }

  inherit( Body, Earth );

  // non-static inner class: Sun
  function Sun( maxPathLength, body ) {
    // Function for rendering the sun
    // private
    var SUN_RENDERER = function( body, viewDiameter ) {
      return new BodyRenderer.SphereRenderer( body, viewDiameter );
    };

    Body.call(
      this,
      UserComponents.star,
      GAOStrings.STAR,
      body.x,
      body.y,
      ( body.radius * 2 ),
      body.vx,
      body.vy,
      body.mass,
      Color.yellow,
      Color.white,
      SUN_RENDERER,
      ( -Math.PI / 4 ),
      true,
      maxPathLength,
      true,
      body.mass,
      OUR_SUN,
      p.playButtonPressed,
      p.stepping,
      p.rewinding,
      body.fixed );
    this.body = body;
  }

  inherit( Body, Sun, {
    updateBodyStateFromModel: function( bodyState ) {
      //store the original position in case it must be restored
      var position = this.getPosition();
//      super.updateBodyStateFromModel( bodyState );
      Body.prototype.updateBodyStateFromModel.call( this, bodyState );
      //Sun shouldn't move in cartoon modes
      if ( this.body.fixed ) {
        this.setPosition( position.getX(), position.getY() );
        this.setVelocity( new Vector2() );
      }
    }
  } );

  /**
   * Create a function that converts SI (seconds) to a string indicating elapsed minutes, used in formatting the elapsed clock readout
   * @param time
   * @returns {*}
   */
  var formatMinutes = function( time ) {
    var value = (time / SECONDS_PER_MINUTE);
    var units = (value == 1) ? GAOStrings.EARTH_MINUTE : GAOStrings.EARTH_MINUTES;
    return MessageFormat.format( GAOStrings.PATTERN_VALUE_UNITS, value, units );
  };

  /**
   *
   * @param {ModeListParameterList} p
   * @param {SunEarthModeConfig} sunEarth
   * @param {SunEarthMoonModeConfig} sunEarthMoon
   * @param {EarthMoonModeConfig} earthMoon
   * @param {EarthSpaceStationModeConfig} earthSpaceStation
   * @returns {*}
   * @constructor
   */
  function ModeList( p, sunEarth, sunEarthMoon, earthMoon, earthSpaceStation ) {

    //private
    this.p = p;
    this.modes = []; // in the java version this class extended ArrayList

    sunEarth.center();
    sunEarthMoon.center();
    earthMoon.center();
    earthSpaceStation.center();

    var readoutInEarthMasses = function( bodyNode, visible ) {
      return new EarthMassReadoutNode( bodyNode, visible );
    };

    //Create the actual modes (GravityAndOrbitsModes) from the specifications passed in (ModeConfigs).
    var SEC_PER_YEAR = 365 * 24 * 60 * 60;
    var SUN_MODES_VELOCITY_SCALE = 4.48E6;
    this.modes.push( new GravityAndOrbitsMode(
      UserComponents.sunEarthRadioButton,
      sunEarth.forceScale,
      false,
      sunEarth.dt,
      scaledDays( sunEarth.timeScale ),
      this.createIconImage( true, true, false, false ),
      SEC_PER_YEAR,
      SUN_MODES_VELOCITY_SCALE,
      readoutInEarthMasses,
      sunEarth.initialMeasuringTapeLocation,
      sunEarth.zoom,
      new Vector2( 0, 0 ),
      ( sunEarth.earth.x / 2 ),
      new Vector2( 0, 0 ),
      p,
      // this was not an argument in the Java version but a double brace initialization
      function() {
        this.addBody( new Sun( this.getMaxPathLength(), sunEarth.sun ) );
        this.addBody( new Earth( this.getMaxPathLength(), sunEarth.earth ) );
      } ) );

    this.modes.push( new GravityAndOrbitsMode(
      UserComponents.sunEarthMoonRadioButton,
      sunEarthMoon.forceScale,
      false,
      sunEarthMoon.dt,
      scaledDays( sunEarthMoon.timeScale ),
      this.createIconImage( true, true, true, false ),
      SEC_PER_YEAR,
      SUN_MODES_VELOCITY_SCALE,
      readoutInEarthMasses,
      sunEarthMoon.initialMeasuringTapeLocation,
      sunEarthMoon.zoom,
      new Vector2( 0, 0 ),
      ( sunEarthMoon.earth.x / 2 ),
      new Vector2( 0, 0 ),
      p,
      function() {
        this.addBody( new Sun( this.getMaxPathLength(), sunEarthMoon.sun ) );
        this.addBody( new Earth( this.getMaxPathLength(), sunEarthMoon.earth ) );
        this.addBody( new Moon(//no room for the slider
          false, this.getMaxPathLength(), false, //so it doesn't intersect with earth mass readout
          sunEarthMoon.moon ) );
      } ) );

    var SEC_PER_MOON_ORBIT = 28 * 24 * 60 * 60;
    this.modes.push( new GravityAndOrbitsMode(
      UserComponents.earthMoonRadioButton,
      earthMoon.forceScale,
      false,
      ( GravityAndOrbitsClock.DEFAULT_DT / 3 ), // actual days
      scaledDays( 1.0 ),
      this.createIconImage( false, true, true, false ),
      SEC_PER_MOON_ORBIT,
      ( SUN_MODES_VELOCITY_SCALE * 0.06 ),
      readoutInEarthMasses,
      earthMoon.initialMeasuringTapeLocation,
      earthMoon.zoom,
      new Vector2( earthMoon.earth.x, 0 ),
      ( earthMoon.moon.y / 2 ),
      new Vector2( earthMoon.earth.x, 0 ),
      p,
      function() {
        //scale so it is a similar size to other modes
        this.addBody( new Earth( this.getMaxPathLength(), earthMoon.earth ) );
        this.addBody( new Moon( true, this.getMaxPathLength(), true, earthMoon.moon ) );
      } ) );

    var spaceStationMassReadoutFactory = function( bodyNode, visible ) {
      return new SpaceStationMassReadoutNode( bodyNode, visible );
    };

    this.modes.push( new GravityAndOrbitsMode(
      UserComponents.earthSpaceStationRadioButton,
      earthSpaceStation.forceScale,
      false,
      ( GravityAndOrbitsClock.DEFAULT_DT * 9E-4 ),
      formatMinutes,
      this.createIconImage( false, true, false, true ),
      5400,
      ( SUN_MODES_VELOCITY_SCALE / 10000 ),
      spaceStationMassReadoutFactory,
      earthSpaceStation.initialMeasuringTapeLocation,
      earthSpaceStation.zoom,
      new Vector2( earthSpaceStation.earth.x, 0 ),
      ( earthSpaceStation.spaceStation.x - earthSpaceStation.earth.x ),
      new Vector2( earthSpaceStation.earth.x, 0 ),
      p,
      function() {
        this.addBody( new Earth( this.getMaxPathLength(), earthSpaceStation.earth ) );
        this.addBody( new SpaceStation( earthSpaceStation, this.getMaxPathLength() ) );
    } ) );
  }

  inherit( Object, ModeList, {

      /**
       * @private
       *
       * Creates an image that can be used for the mode icon, showing the nodes of each body in the mode.
       * @param sun
       * @param earth
       * @param moon
       * @param spaceStation
       * @returns {Image}
       */
      createIconImage: function( sun, earth, moon, spaceStation ) {

        //distance between icons
        var inset = 5;
        var node = new Node();

        function addIcon( inset, icon, visible ) {
          node.addChild( icon );
          icon.setOffset( getFullBounds().getMaxX() + inset + icon.getFullBounds().getWidth() / 2, 0 );
          icon.setVisible( visible );
        }

        node.addChild( new PhetPPath( new Rectangle.Number( 20, 0, 1, 1 ), new Color( 0, 0, 0, 0 ) ) );
        addIcon( inset, new PImage( new BodyRenderer.SphereRenderer( Color.yellow, Color.white, 30 ).toImage() ), sun );
        addIcon( inset, new PImage( multiScaleToWidth( GravityAndOrbitsApplication.RESOURCES.getImage( 'earth_satellite.gif' ), 30 ) ), earth );
        addIcon( inset, new PImage( multiScaleToWidth( GravityAndOrbitsApplication.RESOURCES.getImage( 'moon.png' ), 30 ) ), moon );
        addIcon( inset, new PImage( multiScaleToWidth( GravityAndOrbitsApplication.RESOURCES.getImage( 'space-station.png' ), 30 ) ), spaceStation );

        return node;
//        node.toImage()?

      }

    },

    //statics
    {
      SUN_RADIUS: SUN_RADIUS,
      SUN_MASS: SUN_MASS,
      EARTH_RADIUS: EARTH_RADIUS,
      EARTH_MASS: EARTH_MASS,
      EARTH_PERIHELION: EARTH_PERIHELION,
      EARTH_ORBITAL_SPEED_AT_PERIHELION: EARTH_ORBITAL_SPEED_AT_PERIHELION,
      MOON_MASS: MOON_MASS,
      MOON_RADIUS: MOON_RADIUS,
      MOON_EARTH_SPEED: MOON_EARTH_SPEED,
      MOON_SPEED: MOON_SPEED,
      MOON_PERIGEE: MOON_PERIGEE,
      MOON_X: MOON_X,
      MOON_Y: MOON_Y,
      SPACE_STATION_RADIUS: SPACE_STATION_RADIUS,
      SPACE_STATION_MASS: SPACE_STATION_MASS,
      SPACE_STATION_SPEED: SPACE_STATION_SPEED,
      SPACE_STATION_PERIGEE: SPACE_STATION_PERIGEE
    } );

  return {
    ModeList: ModeList, // the original Java class

    // These were public static inner classes
    SunEarthModeConfig: SunEarthModeConfig,
    SunEarthMoonModeConfig: SunEarthMoonModeConfig,
    EarthMoonModeConfig: EarthMoonModeConfig,
    EarthSpaceStationModeConfig: EarthSpaceStationModeConfig
  }
} );
