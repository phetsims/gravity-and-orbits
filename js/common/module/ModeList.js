// Copyright 2014-2015, University of Colorado Boulder

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
  var Body = require( 'GRAVITY_AND_ORBITS/common/model/Body' );
  var GravityAndOrbitsClock = require( 'GRAVITY_AND_ORBITS/common/model/GravityAndOrbitsClock' );
  var BodyConfiguration = require( 'GRAVITY_AND_ORBITS/common/module/BodyConfiguration' );
  var ModeConfig = require( 'GRAVITY_AND_ORBITS/common/module/ModeConfig' );
  var GravityAndOrbitsMode = require( 'GRAVITY_AND_ORBITS/common/module/GravityAndOrbitsMode' );
  var BodyRenderer = require( 'GRAVITY_AND_ORBITS/common/view/BodyRenderer' );
  var EarthMassReadoutNode = require( 'GRAVITY_AND_ORBITS/common/view/EarthMassReadoutNode' );
  var SpaceStationMassReadoutNode = require( 'GRAVITY_AND_ORBITS/common/view/SpaceStationMassReadoutNode' );
  var VectorNode = require( 'GRAVITY_AND_ORBITS/common/view/VectorNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );
  var GAOBodiesEnum = require( 'GRAVITY_AND_ORBITS/common/model/GAOBodiesEnum' );
  var GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  // strings
  var earthDaysString = require( 'string!GRAVITY_AND_ORBITS/earthDays' );
  var earthDayString = require( 'string!GRAVITY_AND_ORBITS/earthDay' );
  var pattern0Value1UnitsString = require( 'string!GRAVITY_AND_ORBITS/pattern.0value.1units' );
  var earthMinuteString = require( 'string!GRAVITY_AND_ORBITS/earthMinute' );
  var earthMinutesString = require( 'string!GRAVITY_AND_ORBITS/earthMinutes' );
  // var satelliteString = require( 'string!GRAVITY_AND_ORBITS/satellite' );
  var spaceStationString = require( 'string!GRAVITY_AND_ORBITS/spaceStation' );
  // var moonString = require( 'string!GRAVITY_AND_ORBITS/moon' );
  var ourMoonString = require( 'string!GRAVITY_AND_ORBITS/ourMoon' );
  // var planetString = require( 'string!GRAVITY_AND_ORBITS/planet' );
  var earthString = require( 'string!GRAVITY_AND_ORBITS/earth' );
  // var starString = require( 'string!GRAVITY_AND_ORBITS/star' );
  var ourSunString = require( 'string!GRAVITY_AND_ORBITS/ourSun' );

  // images
  var sunImage = require( 'image!GRAVITY_AND_ORBITS/sun.png' );
  var earthImage = require( 'image!GRAVITY_AND_ORBITS/earth.png' );
  var moonImage = require( 'image!GRAVITY_AND_ORBITS/moon.png' );
  var genericPlanetImage = require( 'image!GRAVITY_AND_ORBITS/planet_generic.png' );
  var genericMoonImage = require( 'image!GRAVITY_AND_ORBITS/moon_generic.png' );
  var spaceStationImage = require( 'image!GRAVITY_AND_ORBITS/space-station.png' );

  // These constants are only used in ModeList, and ModeList is used to create the specific model instantiations,
  // so we keep them here instead of the model.
  var SUN_RADIUS = 6.955E8; // km
  var SUN_MASS = 1.989E30; // kg
  var EARTH_RADIUS = 6.371E6;
  var EARTH_MASS = GravityAndOrbitsConstants.EARTH_MASS;
  var EARTH_PERIHELION = 147098290E3; // km, distance from the sun at the closest point
  var EARTH_ORBITAL_SPEED_AT_PERIHELION = 30300; // m/s
  var MOON_MASS = 7.3477E22;
  var MOON_RADIUS = 1737.1E3;
  var MOON_EARTH_SPEED = -1.01E3;
  var MOON_SPEED = MOON_EARTH_SPEED;
  var MOON_PERIGEE = 391370E3; // km, distance from earth at closet point
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

  var ModeList = {
    ModeList: ModeListModule, // the original Java class

    // These were public static inner classes
    SunEarthModeConfig: SunEarthModeConfig,
    SunEarthMoonModeConfig: SunEarthMoonModeConfig,
    EarthMoonModeConfig: EarthMoonModeConfig,
    EarthSpaceStationModeConfig: EarthSpaceStationModeConfig
  };

  gravityAndOrbits.register( 'ModeList', ModeList );

  /**
   * Constructor for ModeListModule.
   *
   * @param {ModeListParameterList} parameterList
   * @param {SunEarthModeConfig} sunEarth
   * @param {SunEarthMoonModeConfig} sunEarthMoon
   * @param {EarthMoonModeConfig} earthMoon
   * @param {EarthSpaceStationModeConfig} earthSpaceStation
   * @returns {*}
   * @constructor
   */
  function ModeListModule( parameterList, sunEarth, sunEarthMoon, earthMoon, earthSpaceStation, options ) {

    options = _.extend( {
      adjustMoonPathLength: false // increase the moon path so that it matches other traces at default settings
    }, options );

    // non-static inner class: SpaceStation
    function SpaceStation( earthSpaceStation, maxPathLength ) {
      Body.call(
        this,
        GAOBodiesEnum.SATELLITE,
        earthSpaceStation.spaceStation,
        ( earthSpaceStation.spaceStation.radius * 2000 ),
        Color.gray,
        Color.white,
        getImageRenderer( spaceStationImage ),
        ( -Math.PI / 4),
        true,
        maxPathLength,
        true,
        earthSpaceStation.spaceStation.mass,
        spaceStationString,
        parameterList,
        earthSpaceStation.spaceStation.fixed );
    }

    inherit( Body, SpaceStation );

    // non-static inner class: Moon
    function Moon( massSettable, maxPathLength, massReadoutBelow, body, options ) {

      options = _.extend( {
        pathLengthBuffer: 0 // adjustment to moon path length so that it matches other traces at default settings
      }, options );

      Body.call(
        this,
        GAOBodiesEnum.MOON,
        body,
        ( body.radius * 2 ),
        Color.magenta,
        Color.white,
        getSwitchableRenderer( moonImage, genericMoonImage, body.mass ),
        ( -3 * Math.PI / 4 ),
        massSettable,
        maxPathLength,
        massReadoutBelow,
        body.mass,
        ourMoonString,
        parameterList,
        body.fixed,
        options );
    }

    inherit( Body, Moon );

    // non-static inner class: Earth
    function Earth( maxPathLength, body ) {
      Body.call(
        this,
        GAOBodiesEnum.PLANET,
        body,
        ( body.radius * 2 ),
        Color.gray,
        Color.lightGray,
        getSwitchableRenderer( earthImage, genericPlanetImage, body.mass ),
        ( -Math.PI / 4 ),
        true,
        maxPathLength,
        true,
        body.mass,
        earthString,
        parameterList,
        body.fixed );
    }

    inherit( Body, Earth );

    // non-static inner class: Sun
    function Sun( maxPathLength, body ) {
      Body.call(
        this,
        GAOBodiesEnum.STAR,
        body,
        ( body.radius * 2 ),
        Color.yellow,
        Color.white,
        getImageRenderer( sunImage ),
        ( -Math.PI / 4 ),
        true,
        maxPathLength,
        true,
        body.mass,
        ourSunString,
        parameterList,
        body.fixed );
      this.body = body;
    }

    inherit( Body, Sun );

    this.parameterList = parameterList; // @private
    this.modes = []; // @public - in the java version this class extended ArrayList, but here we have an array field

    sunEarth.center();
    sunEarthMoon.center();
    earthMoon.center();
    earthSpaceStation.center();

    var readoutInEarthMasses = function( bodyNode, visibleProperty ) {
      return new EarthMassReadoutNode( bodyNode, visibleProperty );
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
      parameterList ) );

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
      parameterList ) );

    // increase moon path length so that it matches other traces at default settings
    var pathLengthBuffer = options.adjustMoonPathLength ? 150 : 0;
    this.modes[ 1 ].addBody( new Sun( this.modes[ 1 ].getMaxPathLength(), sunEarthMoon.sun ) );
    this.modes[ 1 ].addBody( new Earth( this.modes[ 1 ].getMaxPathLength(), sunEarthMoon.earth ) );
    this.modes[ 1 ].addBody( new Moon( // no room for the slider
      false, this.modes[ 1 ].getMaxPathLength(), false, // so it doesn't intersect with earth mass readout
      sunEarthMoon.moon, {
        pathLengthBuffer: pathLengthBuffer
      } ) );

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
      parameterList ) );

    this.modes[ 2 ].addBody( new Earth( this.modes[ 2 ].getMaxPathLength(), earthMoon.earth ) );
    this.modes[ 2 ].addBody( new Moon( true, this.modes[ 2 ].getMaxPathLength(), true, earthMoon.moon ) );

    var spaceStationMassReadoutFactory = function( bodyNode, visibleProperty ) {
      return new SpaceStationMassReadoutNode( bodyNode, visibleProperty );
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
      parameterList ) );

    this.modes[ 3 ].addBody( new Earth( this.modes[ 3 ].getMaxPathLength(), earthSpaceStation.earth ) );
    this.modes[ 3 ].addBody( new SpaceStation( earthSpaceStation, this.modes[ 3 ].getMaxPathLength() ) );
  }

  gravityAndOrbits.register( 'ModeList.ModeListModule', ModeListModule );

  inherit( Object, ModeListModule, {

    /**
     * @private
     * Creates an image that can be used for the mode icon, showing the nodes of each body in the mode.
     * @param {boolean} sun
     * @param {boolean} earth
     * @param {boolean} moon
     * @param {boolean} spaceStation
     * @returns {Image}
     */
    createIconImage: function( sun, earth, moon, spaceStation ) {
      var children = [
        new Image( sunImage, { visible: sun } ),
        new Image( earthImage, { visible: earth } ),
        new Image( moonImage, { visible: moon } ),
        new Image( spaceStationImage, { visible: spaceStation } )
      ];

      for ( var i = 0; i < children.length; i++ ) {
        children[ i ].setScaleMagnitude( 25 / children[ i ].width );
      }

      return new HBox( { children: children, spacing: 20 } );
    }
  } );

  function milesToMeters( modelDistance ) {
    return modelDistance / METERS_PER_MILE;
  }

  // static class: SunEarthModeConfig
  function SunEarthModeConfig() {

    // @public
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

    // @protected
    getBodies: function() {
      return [ this.sun, this.earth ];
    }
  } );

  // static class: SunEarthMoonModeConfig
  function SunEarthMoonModeConfig() {

    // @public
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

    // @protected
    getBodies: function() {
      return [ this.sun, this.earth, this.moon ];
    }
  } );

  // static class: EarthMoonModeConfig
  function EarthMoonModeConfig() {

    // @public
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

    // @protected
    getBodies: function() {
      return [ this.earth, this.moon ];
    }
  } );

  // static class: EarthSpaceStationModeConfig
  function EarthSpaceStationModeConfig() {

    // @public
    this.earth = new BodyConfiguration( EARTH_MASS, EARTH_RADIUS, 0, 0, 0, 0 );
    this.spaceStation = new BodyConfiguration( SPACE_STATION_MASS, SPACE_STATION_RADIUS,
      SPACE_STATION_PERIGEE + EARTH_RADIUS + SPACE_STATION_RADIUS, 0, 0, SPACE_STATION_SPEED );
    ModeConfig.call( this, 21600 );

    // @public
    // Sampled at runtime from MeasuringTape
    this.initialMeasuringTapeLocation = new Line( 3162119, 7680496, 6439098, 7680496 );
    this.forceScale = FORCE_SCALE * 3E13;
  }

  inherit( ModeConfig, EarthSpaceStationModeConfig, {

    // @protected
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
   * @param {image|mipmap} image1
   * @param {image|mipmap} image2
   * @param {number} targetMass
   * @returns {*}
   */
  var getSwitchableRenderer = function( image1, image2, targetMass ) {

    // the mass for which to use the image
    return function( body, viewDiameter ) {
      return new BodyRenderer.SwitchableBodyRenderer(
        body,
        targetMass,
        new BodyRenderer.ImageRenderer( body, viewDiameter, image1 ), new BodyRenderer.ImageRenderer( body, viewDiameter, image2 ) );
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
      return StringUtils.format( pattern0Value1UnitsString, Util.toFixed( value, 0 ), units );
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
    return StringUtils.format( pattern0Value1UnitsString, Util.toFixed( value, 0 ), units );
  };

  return ModeList;

} );
