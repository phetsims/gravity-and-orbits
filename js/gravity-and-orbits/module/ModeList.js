// Copyright 2002-2015, University of Colorado Boulder

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
  var Line = require( 'SCENERY/nodes/Line' );
  var Vector2 = require( 'DOT/Vector2' );
  var Body = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/Body' );
  var GravityAndOrbitsClock = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/GravityAndOrbitsClock' );
  var BodyConfiguration = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/BodyConfiguration' );
  var ModeConfig = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/ModeConfig' );
  var GravityAndOrbitsMode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/GravityAndOrbitsMode' );
  var BodyRenderer = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/BodyRenderer' );
  var EarthMassReadoutNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/EarthMassReadoutNode' );
  var SpaceStationMassReadoutNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/SpaceStationMassReadoutNode' );
  var VectorNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/VectorNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );
  var GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsConstants' );

  // strings
  var earthDaysString = require( 'string!GRAVITY_AND_ORBITS/earthDays' );
  var earthDayString = require( 'string!GRAVITY_AND_ORBITS/earthDay' );
  var patternValueUnitsString = require( 'string!GRAVITY_AND_ORBITS/pattern.0value.1units' );
  var earthMinuteString = require( 'string!GRAVITY_AND_ORBITS/earthMinute' );
  var earthMinutesString = require( 'string!GRAVITY_AND_ORBITS/earthMinutes' );
  var satelliteString = require( 'string!GRAVITY_AND_ORBITS/satellite' );
  var spaceStationString = require( 'string!GRAVITY_AND_ORBITS/spaceStation' );
  var moonString = require( 'string!GRAVITY_AND_ORBITS/moon' );
  var ourMoonString = require( 'string!GRAVITY_AND_ORBITS/ourMoon' );
  var planetString = require( 'string!GRAVITY_AND_ORBITS/planet' );
  var earthString = require( 'string!GRAVITY_AND_ORBITS/earth' );
  var starString = require( 'string!GRAVITY_AND_ORBITS/star' );
  var ourSunString = require( 'string!GRAVITY_AND_ORBITS/ourSun' );

  // images
  var earthMipmap = require( 'mipmap!GRAVITY_AND_ORBITS/earth.png' );
  var moonMipmap = require( 'mipmap!GRAVITY_AND_ORBITS/moon.png' );
  var spaceStationMipmap = require( 'mipmap!GRAVITY_AND_ORBITS/space-station.png' );
  var bodyMipmap = require( 'mipmap!GRAVITY_AND_ORBITS/body.png' );
  var sunMipmap = require( 'mipmap!GRAVITY_AND_ORBITS/sun.png' );

  // These constants are only used in ModeList, and ModeList is used to create the specific model instantiations,
  // so we keep them here instead of the model
  var SUN_RADIUS = 6.955E8;
  var SUN_MASS = 1.989E30;
  var EARTH_RADIUS = 6.371E6;
  var EARTH_MASS = GravityAndOrbitsConstants.EARTH_MASS;
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
  var SPACE_STATION_MASS = GravityAndOrbitsConstants.SPACE_STATION_MASS;
  var SPACE_STATION_SPEED = 7706;
  var SPACE_STATION_PERIGEE = 347000;

  var SECONDS_PER_MINUTE = 60;
  var FORCE_SCALE = VectorNode.FORCE_SCALE;

  // not originally in this file
  var METERS_PER_MILE = 0.000621371192;

  var DEFAULT_DT = GravityAndOrbitsClock.DEFAULT_DT;

  function milesToMeters( modelDistance ) {
    return modelDistance / METERS_PER_MILE;
  }

  // static class: SunEarthModeConfig
  function SunEarthModeConfig() {
    this.sun = new BodyConfiguration( SUN_MASS, SUN_RADIUS, 0, 0, 0, 0 );
    this.earth = new BodyConfiguration(
      EARTH_MASS, EARTH_RADIUS, EARTH_PERIHELION, 0, 0, EARTH_ORBITAL_SPEED_AT_PERIHELION );
    this.timeScale = 1;
    ModeConfig.call( this, 1.25 );
    this.initialMeasuringTapeLocation = new Line(
      (this.sun.x + this.earth.x) / 3,
      -this.earth.x / 2,
      (this.sun.x + this.earth.x) / 3 + milesToMeters( 50000000 ),
      -this.earth.x / 2 );
    this.forceScale = FORCE_SCALE * 120;
  }

  inherit( ModeConfig, SunEarthModeConfig, {
    getBodies: function() {
      return [ this.sun, this.earth ];
    }
  } );

  // static class: SunEarthMoonModeConfig
  function SunEarthMoonModeConfig() {
    this.sun = new BodyConfiguration( SUN_MASS, SUN_RADIUS, 0, 0, 0, 0 );
    this.earth = new BodyConfiguration(
      EARTH_MASS, EARTH_RADIUS, EARTH_PERIHELION, 0, 0, EARTH_ORBITAL_SPEED_AT_PERIHELION );
    this.moon = new BodyConfiguration(
      MOON_MASS, MOON_RADIUS, MOON_X, MOON_Y, MOON_SPEED, EARTH_ORBITAL_SPEED_AT_PERIHELION );
    this.timeScale = 1;
    ModeConfig.call( this, 1.25 );
    this.initialMeasuringTapeLocation = new Line(
      (this.sun.x + this.earth.x) / 3,
      -this.earth.x / 2,
      (this.sun.x + this.earth.x) / 3 + milesToMeters( 50000000 ),
      -this.earth.x / 2 );
    this.forceScale = FORCE_SCALE * 120;
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
    this.initialMeasuringTapeLocation = new Line(
      this.earth.x + this.earth.radius * 2,
      -this.moon.y * 0.7,
      this.earth.x + this.earth.radius * 2 + milesToMeters( 100000 ),
      -this.moon.y * 0.7 );
    this.forceScale = FORCE_SCALE * 45;
  }

  inherit( ModeConfig, EarthMoonModeConfig, {
    getBodies: function() {
      return [ this.earth, this.moon ];
    }
  } );

  // static class: EarthSpaceStationModeConfig
  function EarthSpaceStationModeConfig() {
    this.earth = new BodyConfiguration( EARTH_MASS, EARTH_RADIUS, 0, 0, 0, 0 );
    this.spaceStation = new BodyConfiguration( SPACE_STATION_MASS, SPACE_STATION_RADIUS,
      SPACE_STATION_PERIGEE + EARTH_RADIUS + SPACE_STATION_RADIUS, 0, 0, SPACE_STATION_SPEED );
    ModeConfig.call( this, 21600 );

    // Sampled at runtime from MeasuringTape
    this.initialMeasuringTapeLocation = new Line( 3162119, 7680496, 6439098, 7680496 );
    this.forceScale = FORCE_SCALE * 3E13;
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
    };
  };

  /**
   * Creates a BodyRenderer that shows an image when at the targetMass, otherwise shows a shaded sphere
   * @param {string} image
   * @param {number} targetMass
   * @returns {*}
   */
  var getRenderer = function( image, targetMass ) {
    //the mass for which to use the image
    return function( body, viewDiameter ) {
      return new BodyRenderer.SwitchableBodyRenderer( body, targetMass,
        new BodyRenderer.ImageRenderer( body, viewDiameter, image ),
        new BodyRenderer.ImageRenderer( body, viewDiameter, bodyMipmap ) );
    };
  };

  /**
   * Have to artificially scale up the time readout so that Sun/Earth/Moon mode has a stable orbit with correct periods
   * @param scale
   * @returns {*}
   */
  var scaledDays = function( scale ) {
    return function( time ) {
      var value = (time / GravityAndOrbitsClock.SECONDS_PER_DAY * scale);
      var units = (value === 1) ? earthDayString : earthDaysString;
      return StringUtils.format( patternValueUnitsString, Util.toFixed( value, 0 ), units );
    };
  };

  /**
   * Create a function that converts SI (seconds) to a string indicating elapsed minutes, used in formatting the
   * elapsed clock readout
   * @param time
   * @returns {*}
   */
  var formatMinutes = function( time ) {
    var value = (time / SECONDS_PER_MINUTE);
    var units = (value === 1) ? earthMinuteString : earthMinutesString;
    return StringUtils.format( patternValueUnitsString, Util.toFixed( value, 0 ), units );
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

    // non-static inner class: SpaceStation
    function SpaceStation( earthSpaceStation, maxPathLength ) {
      Body.call(
        this,
        satelliteString,
        earthSpaceStation.spaceStation.x,
        earthSpaceStation.spaceStation.y,
        ( earthSpaceStation.spaceStation.radius * 2000 ),
        earthSpaceStation.spaceStation.vx,
        earthSpaceStation.spaceStation.vy,
        earthSpaceStation.spaceStation.mass,
        Color.gray,
        Color.white,
        getImageRenderer( spaceStationMipmap ),
        ( -Math.PI / 4),
        true,
        maxPathLength,
        true,
        earthSpaceStation.spaceStation.mass,
        spaceStationString,
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
        moonString,
        body.x,
        body.y,
        ( body.radius * 2 ),
        body.vx,
        body.vy,
        body.mass,
        Color.magenta,
        Color.white,
        getRenderer( moonMipmap, body.mass ),
        ( -3 * Math.PI / 4 ),
        massSettable,
        maxPathLength,
        massReadoutBelow,
        body.mass,
        ourMoonString,
        p.playButtonPressed,
        p.stepping,
        p.rewinding,
        body.fixed );
    }

    inherit( Body, Moon, {
      doReturnBody: function( model ) {
        Body.prototype.doReturnBody.call( this, model );
        var earth = model.getBody( planetString );

        // Restore the moon near the earth and with the same relative velocity vector
        if ( earth ) {
          var relativePosition = this.positionProperty.initialValue.minus( earth.positionProperty.initialValue );
          this.positionProperty.set( earth.positionProperty.get().plus( relativePosition ) );
          var relativeVelocity = this.velocityProperty.initialValue.minus( earth.velocityProperty.initialValue );
          this.velocityProperty.set( earth.velocityProperty.get().plus( relativeVelocity ) );
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
        planetString,
        body.x,
        body.y,
        ( body.radius * 2 ),
        body.vx,
        body.vy,
        body.mass,
        Color.gray,
        Color.lightGray,
        getRenderer( earthMipmap, body.mass ),
        ( -Math.PI / 4 ),
        true,
        maxPathLength,
        true,
        body.mass,
        earthString,
        p.playButtonPressed,
        p.stepping,
        p.rewinding,
        body.fixed );
    }

    inherit( Body, Earth );

    // non-static inner class: Sun
    function Sun( maxPathLength, body ) {
      // Function for rendering the sun
      // @private
      var SUN_RENDERER = function( body, viewDiameter ) {
        return new BodyRenderer.ImageRenderer( body, viewDiameter, sunMipmap );
      };

      Body.call(
        this,
        starString,
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
        ourSunString,
        p.playButtonPressed,
        p.stepping,
        p.rewinding,
        body.fixed );
      this.body = body;
    }

    inherit( Body, Sun );

    // @private
    this.p = p;
    this.modes = []; // in the java version this class extended ArrayList

    sunEarth.center();
    sunEarthMoon.center();
    earthMoon.center();
    earthSpaceStation.center();

    var readoutInEarthMasses = function( bodyNode, visible ) {
      return new EarthMassReadoutNode( bodyNode, visible );
    };

    // Create the actual modes (GravityAndOrbitsModes) from the specifications passed in (ModeConfigs).
    var SEC_PER_YEAR = 365 * 24 * 60 * 60;
    var SUN_MODES_VELOCITY_SCALE = 4.48E6;
    this.modes.push( new GravityAndOrbitsMode(
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
      p ) );

    this.modes[ 0 ].addBody( new Sun( this.modes[ 0 ].getMaxPathLength(), sunEarth.sun ) );
    this.modes[ 0 ].addBody( new Earth( this.modes[ 0 ].getMaxPathLength(), sunEarth.earth ) );

    this.modes.push( new GravityAndOrbitsMode(
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
      p ) );

    this.modes[ 1 ].addBody( new Sun( this.modes[ 1 ].getMaxPathLength(), sunEarthMoon.sun ) );
    this.modes[ 1 ].addBody( new Earth( this.modes[ 1 ].getMaxPathLength(), sunEarthMoon.earth ) );
    this.modes[ 1 ].addBody( new Moon( // no room for the slider
      false, this.modes[ 1 ].getMaxPathLength(), false, // so it doesn't intersect with earth mass readout
      sunEarthMoon.moon ) );

    var SEC_PER_MOON_ORBIT = 28 * 24 * 60 * 60;
    this.modes.push( new GravityAndOrbitsMode(
      earthMoon.forceScale,
      false,
      ( DEFAULT_DT / 3 ), // actual days
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
      p ) );

    this.modes[ 2 ].addBody( new Earth( this.modes[ 2 ].getMaxPathLength(), earthMoon.earth ) );
    this.modes[ 2 ].addBody( new Moon( true, this.modes[ 2 ].getMaxPathLength(), true, earthMoon.moon ) );

    var spaceStationMassReadoutFactory = function( bodyNode, visible ) {
      return new SpaceStationMassReadoutNode( bodyNode, visible );
    };

    this.modes.push( new GravityAndOrbitsMode(
      earthSpaceStation.forceScale,
      false,
      ( DEFAULT_DT * 9E-4 ),
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
      p ) );

    this.modes[ 3 ].addBody( new Earth( this.modes[ 3 ].getMaxPathLength(), earthSpaceStation.earth ) );
    this.modes[ 3 ].addBody( new SpaceStation( earthSpaceStation, this.modes[ 3 ].getMaxPathLength() ) );
  }

  inherit( Object, ModeList, {

    /**
     * @private
     *
     * Creates an image that can be used for the mode icon, showing the nodes of each body in the mode.
     * @param {boolean} sun
     * @param {boolean} earth
     * @param {boolean} moon
     * @param {boolean} spaceStation
     * @returns {Image}
     */
    createIconImage: function( sun, earth, moon, spaceStation ) {
      var children = [
        new Image( sunMipmap, { visible: sun } ),
        new Image( earthMipmap, { visible: earth } ),
        new Image( moonMipmap, { visible: moon } ),
        new Image( spaceStationMipmap, { visible: spaceStation } )
      ];

      for ( var i = 0; i < children.length; i++ ) {
        children[ i ].setScaleMagnitude( 25 / children[ i ].width );
      }

      return new HBox( { children: children, spacing: 20 } );
    }
  } );

  return {
    ModeList: ModeList, // the original Java class

    // These were public static inner classes
    SunEarthModeConfig: SunEarthModeConfig,
    SunEarthMoonModeConfig: SunEarthMoonModeConfig,
    EarthMoonModeConfig: EarthMoonModeConfig,
    EarthSpaceStationModeConfig: EarthSpaceStationModeConfig
  };
} );
