// Copyright 2014-2019, University of Colorado Boulder

/**
 * ModeListModel enumerates and declares the possible modes in the GravityAndOrbitsModule, such as 'Sun & Earth' mode.
 * Models (and the bodies they contain) are created in ModeListModel.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Body = require( 'GRAVITY_AND_ORBITS/common/model/Body' );
  const BodyConfiguration = require( 'GRAVITY_AND_ORBITS/common/module/BodyConfiguration' );
  const BodyRenderer = require( 'GRAVITY_AND_ORBITS/common/view/BodyRenderer' );
  const Color = require( 'SCENERY/util/Color' );
  const EarthMassReadoutNode = require( 'GRAVITY_AND_ORBITS/common/view/EarthMassReadoutNode' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsBodies = require( 'GRAVITY_AND_ORBITS/common/model/GravityAndOrbitsBodies' );
  const GravityAndOrbitsClock = require( 'GRAVITY_AND_ORBITS/common/model/GravityAndOrbitsClock' );
  const GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );
  const GravityAndOrbitsMode = require( 'GRAVITY_AND_ORBITS/common/module/GravityAndOrbitsMode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const Line = require( 'SCENERY/nodes/Line' );
  const merge = require( 'PHET_CORE/merge' );
  const ModeConfig = require( 'GRAVITY_AND_ORBITS/common/module/ModeConfig' );
  const SpaceStationMassReadoutNode = require( 'GRAVITY_AND_ORBITS/common/view/SpaceStationMassReadoutNode' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const VectorNode = require( 'GRAVITY_AND_ORBITS/common/view/VectorNode' );

  // strings
  // REVIEW why are these commented out?
  // const moonString = require( 'string!GRAVITY_AND_ORBITS/moon' );
  // const planetString = require( 'string!GRAVITY_AND_ORBITS/planet' );
  // const satelliteString = require( 'string!GRAVITY_AND_ORBITS/satellite' );
  // const starString = require( 'string!GRAVITY_AND_ORBITS/star' );
  const earthDaysString = require( 'string!GRAVITY_AND_ORBITS/earthDays' );
  const earthDayString = require( 'string!GRAVITY_AND_ORBITS/earthDay' );
  const earthMinutesString = require( 'string!GRAVITY_AND_ORBITS/earthMinutes' );
  const earthMinuteString = require( 'string!GRAVITY_AND_ORBITS/earthMinute' );
  const earthString = require( 'string!GRAVITY_AND_ORBITS/earth' );
  const ourMoonString = require( 'string!GRAVITY_AND_ORBITS/ourMoon' );
  const ourSunString = require( 'string!GRAVITY_AND_ORBITS/ourSun' );
  const pattern0Value1UnitsString = require( 'string!GRAVITY_AND_ORBITS/pattern.0value.1units' );
  const spaceStationString = require( 'string!GRAVITY_AND_ORBITS/spaceStation' );

  // images
  const earthImage = require( 'image!GRAVITY_AND_ORBITS/earth.png' );
  const genericMoonImage = require( 'image!GRAVITY_AND_ORBITS/moon_generic.png' );
  const genericPlanetImage = require( 'image!GRAVITY_AND_ORBITS/planet_generic.png' );
  const moonImage = require( 'image!GRAVITY_AND_ORBITS/moon.png' );
  const spaceStationImage = require( 'image!GRAVITY_AND_ORBITS/space-station.png' );
  const sunImage = require( 'image!GRAVITY_AND_ORBITS/sun.png' );

  // These constants are only used in ModeListModel, and ModeListModel is used to create the specific model instantiations,
  // so we keep them here instead of the model.
  const SUN_RADIUS = 6.955E8; // km
  const SUN_MASS = 1.989E30; // kg
  const EARTH_RADIUS = 6.371E6;
  const EARTH_MASS = GravityAndOrbitsConstants.EARTH_MASS;
  const EARTH_PERIHELION = 147098290E3; // km, distance from the sun at the closest point
  const EARTH_ORBITAL_SPEED_AT_PERIHELION = 30300; // m/s
  const MOON_MASS = 7.3477E22;
  const MOON_RADIUS = 1737.1E3;
  const MOON_EARTH_SPEED = -1.01E3;
  const MOON_SPEED = MOON_EARTH_SPEED;
  const MOON_PERIGEE = 391370E3; // km, distance from earth at closet point
  const MOON_X = EARTH_PERIHELION;
  const MOON_Y = MOON_PERIGEE;

  // see http://en.wikipedia.org/wiki/International_Space_Station
  const SPACE_STATION_RADIUS = 109;
  const SPACE_STATION_MASS = GravityAndOrbitsConstants.SPACE_STATION_MASS;
  const SPACE_STATION_SPEED = 7706;
  const SPACE_STATION_PERIGEE = 347000;

  // orbital period of the space station, in seconds
  // orbit determined to be 91.4 days, by inspection
  const SPACE_STATION_ORBITAL_PERIOD = 91.4 * 60;

  const SECONDS_PER_MINUTE = 60;
  const FORCE_SCALE = VectorNode.FORCE_SCALE;

  // not originally in this file
  const METERS_PER_MILE = 0.000621371192;

  const DEFAULT_DT = GravityAndOrbitsClock.DEFAULT_DT;

  class ModeListModel {

    /**
     * Constructor for ModeListModel.
     *
     * @param {ModeListParameterList} parameterList
     * @param {SunEarthModeConfig} sunEarth
     * @param {SunEarthMoonModeConfig} sunEarthMoon
     * @param {EarthMoonModeConfig} earthMoon
     * @param {EarthSpaceStationModeConfig} earthSpaceStation
     * @param {Tandem} tandem
     * @param {Object} [options]
     */
    constructor( parameterList, sunEarth, sunEarthMoon, earthMoon, earthSpaceStation, tandem, options ) {

      options = merge( {
        adjustMoonPathLength: false // increase the moon path so that it matches other traces at default settings
      }, options );

      // non-static inner class: SpaceStation
      // REVIEW: why is this inside the constructor?
      class SpaceStation extends Body {
        constructor( earthSpaceStation, transformProperty, tandem, options ) {

          options = merge( {
            diameterScale: 1000
          }, options );

          super(
            GravityAndOrbitsBodies.SATELLITE,
            earthSpaceStation.spaceStation,
            Color.gray,
            Color.white,
            getImageRenderer( spaceStationImage ),
            ( -Math.PI / 4 ),
            earthSpaceStation.spaceStation.mass,
            spaceStationString,
            parameterList,
            transformProperty,
            'spaceStationMassControl',
            tandem,
            'spaceStationMassLabel',
            options
          );
        }
      }

      // non-static inner class: Moon
      class Moon extends Body {
        constructor( massSettable, massReadoutBelow, body, transformProperty, tandem, options ) {

          options = merge( {
            pathLengthBuffer: 0, // adjustment to moon path length so that it matches other traces at default settings
            massSettable: massSettable,
            massReadoutBelow: massReadoutBelow,
            rotationPeriod: null // rotation period in seconds, null means no rotation
          }, options );

          super(
            GravityAndOrbitsBodies.MOON,
            body,
            Color.magenta,
            Color.white,
            getSwitchableRenderer( moonImage, genericMoonImage, body.mass ),
            ( -3 * Math.PI / 4 ),
            body.mass,
            ourMoonString,
            parameterList,
            transformProperty,
            'moonMassControl',
            tandem,
            'moonMassLabel',
            options
          );
        }
      }

      // non-static inner class: Earth.  TODO: rename planet
      class Earth extends Body {
        constructor( body, transformProperty, tandem, options ) {
          super(
            GravityAndOrbitsBodies.PLANET,
            body,
            Color.gray,
            Color.lightGray,
            getSwitchableRenderer( earthImage, genericPlanetImage, body.mass ),
            ( -Math.PI / 4 ),
            body.mass,
            earthString,
            parameterList,
            transformProperty,
            'planetMassControl',
            tandem,
            'planetMassLabel',
            options
          );
        }
      }

      // non-static inner class: Sun.  TODO: rename Star
      class Sun extends Body {
        constructor( body, transformProperty, tandem, options ) {
          super(
            GravityAndOrbitsBodies.STAR,
            body, // REVIEW: why does Body take Body argument?
            Color.yellow,
            Color.white,
            getImageRenderer( sunImage ),
            ( -Math.PI / 4 ),
            body.mass,
            ourSunString,
            parameterList,
            transformProperty,
            'starMassControl',
            tandem,
            'starMassLabel',
            options
          );
          this.body = body;
        }
      }

      this.parameterList = parameterList; // @private
      this.modes = []; // @public - in the java version this class extended ArrayList, but here we have an array field

      sunEarth.center();
      sunEarthMoon.center();
      earthMoon.center();
      earthSpaceStation.center();

      const readoutInEarthMasses = ( bodyNode, visibleProperty ) => new EarthMassReadoutNode( bodyNode, visibleProperty );

      // Create the actual modes (GravityAndOrbitsModes) from the specifications passed in (ModeConfigs).
      const SEC_PER_YEAR = 365 * 24 * 60 * 60;
      const SUN_MODES_VELOCITY_SCALE = 4.48E6;
      this.modes.push( new GravityAndOrbitsMode( // TODO: Rename mode => scene
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
        parameterList,
        'sunEarthSceneButton', // TODO rename mode to scene for types and vars?
        'sunEarthSceneResetButton',
        'sunEarthScene',
        tandem.createTandem( 'sunEarthScene' )
      ) );

      const sunEarthTransformProperty = this.modes[ 0 ].transformProperty;
      const sunEarthTandem = tandem.createTandem( 'sunEarthScene' );
      this.modes[ 0 ].addBody( new Sun( sunEarth.sun, sunEarthTransformProperty, sunEarthTandem.createTandem( 'sun' ), { // TODO: sun vs star?
        maxPathLength: 345608942000 // in km
      } ) );
      this.modes[ 0 ].addBody( new Earth( sunEarth.earth, sunEarthTransformProperty, sunEarthTandem.createTandem( 'earth' ) ) );// TODO: earth vs planet?

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
        parameterList,
        'sunEarthMoonSceneButton',
        'sunEarthMoonSceneResetButton',
        'sunEarthMoonScene',
        tandem.createTandem( 'sunEarthMoonScene' )
      ) );

      // increase moon path length so that it fades away with other bodies
      // in model coordinates (at default orbit)
      const pathLengthBuffer = options.adjustMoonPathLength ? sunEarthMoon.moon.x / 2 : 0;
      const sunEarthMoonTransformProperty = this.modes[ 1 ].sunEarthMoonTransformProperty;
      const sunEarthMoonSceneTandem = tandem.createTandem( 'sunEarthMoonScene' );
      this.modes[ 1 ].addBody( new Sun( sunEarthMoon.sun, sunEarthMoonTransformProperty, sunEarthMoonSceneTandem.createTandem( 'sun' ), {
        maxPathLength: 345608942000 // in km
      } ) );
      this.modes[ 1 ].addBody( new Earth( sunEarthMoon.earth, sunEarthMoonTransformProperty, sunEarthMoonSceneTandem.createTandem( 'earth' ) ) );
      this.modes[ 1 ].addBody( new Moon( // no room for the slider
        false, false, // so it doesn't intersect with earth mass readout
        sunEarthMoon.moon,
        sunEarthMoonTransformProperty,
        sunEarthMoonSceneTandem.createTandem( 'moon' ), {
          pathLengthBuffer: pathLengthBuffer
        }
      ) );

      const SEC_PER_MOON_ORBIT = 28 * 24 * 60 * 60;
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
        parameterList,
        'earthMoonSceneButton',
        'earthMoonSceneResetButton',
        'earthMoonScene',
        tandem.createTandem( 'earthMoonScene' )
      ) );

      const earthMoonTransformProperty = this.modes[ 2 ].transformProperty;
      const earthMoonSceneTandem = tandem.createTandem( 'earthMoonScene' );
      this.modes[ 2 ].addBody( new Earth( earthMoon.earth, earthMoonTransformProperty, earthMoonSceneTandem.createTandem( 'earth' ), {
        orbitalCenter: new Vector2( earthMoon.earth.x, earthMoon.earth.y )
      } ) );

      this.modes[ 2 ].addBody( new Moon( true, true, earthMoon.moon, earthMoonTransformProperty, earthMoonSceneTandem.createTandem( 'moon' ), {
        orbitalCenter: new Vector2( earthMoon.earth.x, earthMoon.earth.y ),
        rotationPeriod: earthMoon.moon.rotationPeriod
      } ) );

      const spaceStationMassReadoutFactory = ( bodyNode, visibleProperty ) => new SpaceStationMassReadoutNode( bodyNode, visibleProperty );
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
        parameterList,
        'earthSpaceStationScreenButton',
        'earthSpaceStationScreenResetButton',
        'earthSpaceStationScreen',
        tandem.createTandem( 'earthSpaceStationScreen' )
      ) );

      const earthSpaceStationTandem = tandem.createTandem( 'earthSpaceStationScene' );
      const earthSpaceStationTransformProperty = this.modes[ 3 ].transformProperty;
      this.modes[ 3 ].addBody( new Earth( earthSpaceStation.earth, earthSpaceStationTransformProperty, earthSpaceStationTandem.createTandem( 'earth' ), {
        maxPathLength: 35879455 // in km
      } ) );
      this.modes[ 3 ].addBody( new SpaceStation( earthSpaceStation, earthSpaceStationTransformProperty, earthSpaceStationTandem.createTandem( 'spaceStation' ), {
        rotationPeriod: earthSpaceStation.spaceStation.rotationPeriod
      } ) );
    }

    /**
     * @private
     * Creates an image that can be used for the mode icon, showing the nodes of each body in the mode.
     * @param {boolean} sun
     * @param {boolean} earth
     * @param {boolean} moon
     * @param {boolean} spaceStation
     * @returns {Image}
     */
    createIconImage( sun, earth, moon, spaceStation ) {
      const children = [
        new Image( sunImage, { visible: sun } ),
        new Image( earthImage, { visible: earth } ),
        new Image( moonImage, { visible: moon } ),
        new Image( spaceStationImage, { visible: spaceStation } )
      ];

      for ( let i = 0; i < children.length; i++ ) {
        children[ i ].setScaleMagnitude( 25 / children[ i ].width );
      }

      return new HBox( { children: children, spacing: 20 } );
    }
  }

  const milesToMeters = modelDistance => modelDistance / METERS_PER_MILE;

  class SunEarthModeConfig extends ModeConfig {
    constructor() {

      super( 1.25 );
      // @public
      this.sun = new BodyConfiguration( SUN_MASS, SUN_RADIUS, 0, 0, 0, 0 );
      this.earth = new BodyConfiguration(
        EARTH_MASS, EARTH_RADIUS, EARTH_PERIHELION, 0, 0, EARTH_ORBITAL_SPEED_AT_PERIHELION );
      this.timeScale = 1;
      this.initialMeasuringTapeLocation = new Line(
        ( this.sun.x + this.earth.x ) / 3,
        -this.earth.x / 2,
        ( this.sun.x + this.earth.x ) / 3 + milesToMeters( 50000000 ),
        -this.earth.x / 2 );
      this.forceScale = FORCE_SCALE * 120;
    }

    // @protected
    getBodies() {
      return [ this.sun, this.earth ];
    }
  }

  // static class: SunEarthMoonModeConfig
  class SunEarthMoonModeConfig extends ModeConfig {
    constructor() {

      super( 1.25 );
      // @public
      this.sun = new BodyConfiguration( SUN_MASS, SUN_RADIUS, 0, 0, 0, 0 );
      this.earth = new BodyConfiguration(
        EARTH_MASS, EARTH_RADIUS, EARTH_PERIHELION, 0, 0, EARTH_ORBITAL_SPEED_AT_PERIHELION );
      this.moon = new BodyConfiguration(
        MOON_MASS, MOON_RADIUS, MOON_X, MOON_Y, MOON_SPEED, EARTH_ORBITAL_SPEED_AT_PERIHELION );
      this.timeScale = 1;
      this.initialMeasuringTapeLocation = new Line(
        ( this.sun.x + this.earth.x ) / 3,
        -this.earth.x / 2,
        ( this.sun.x + this.earth.x ) / 3 + milesToMeters( 50000000 ),
        -this.earth.x / 2 );
      this.forceScale = FORCE_SCALE * 120;
    }

    // @protected
    getBodies() {
      return [ this.sun, this.earth, this.moon ];
    }
  }

  class EarthMoonModeConfig extends ModeConfig {

    /**
     * Configuration for the Earh+Moon system.
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {
        moonRotationPeriod: null // rotation period for the moon in seconds, null means no rotation
      }, options );

      super( 400 );

      // @public
      this.earth = new BodyConfiguration( EARTH_MASS, EARTH_RADIUS, EARTH_PERIHELION, 0, 0, 0 );
      this.moon = new BodyConfiguration( MOON_MASS, MOON_RADIUS, MOON_X, MOON_Y, MOON_SPEED, 0, {
        rotationPeriod: options.moonRotationPeriod
      } );
      this.initialMeasuringTapeLocation = new Line(
        this.earth.x + this.earth.radius * 2,
        -this.moon.y * 0.7,
        this.earth.x + this.earth.radius * 2 + milesToMeters( 100000 ),
        -this.moon.y * 0.7 );
      this.forceScale = FORCE_SCALE * 45;
    }

    // @protected
    getBodies() {
      return [ this.earth, this.moon ];
    }
  }

  class EarthSpaceStationModeConfig extends ModeConfig {
    /**
     * Static class.
     * @param {Object} options
     */
    constructor( options ) {

      options = merge( {
        spaceStationRotationPeriod: SPACE_STATION_ORBITAL_PERIOD // rotation period in seconds
      }, options );

      super( 21600 );

      // @public
      this.earth = new BodyConfiguration( EARTH_MASS, EARTH_RADIUS, 0, 0, 0, 0 );
      this.spaceStation = new BodyConfiguration( SPACE_STATION_MASS, SPACE_STATION_RADIUS,
        SPACE_STATION_PERIGEE + EARTH_RADIUS + SPACE_STATION_RADIUS, 0, 0, SPACE_STATION_SPEED, {
          rotationPeriod: options.spaceStationRotationPeriod
        } );

      // @public
      // Sampled at runtime from MeasuringTape
      this.initialMeasuringTapeLocation = new Line( 3162119, 7680496, 6439098, 7680496 );
      this.forceScale = FORCE_SCALE * 3E13;
    }

    // @protected
    getBodies() {
      return [ this.earth, this.spaceStation ];
    }
  }

  /**
   * Creates a BodyRenderer that just shows the specified image
   * @param {string} image
   * @returns {function}
   */
  const getImageRenderer = image => {
    return ( body, viewDiameter ) => new BodyRenderer.ImageRenderer( body, viewDiameter, image );
  };

  /**
   * Creates a BodyRenderer that shows an image when at the targetMass, otherwise shows a shaded sphere
   * @param {image|mipmap} image1
   * @param {image|mipmap} image2
   * @param {number} targetMass
   * @returns {function}
   */
  const getSwitchableRenderer = ( image1, image2, targetMass ) => {

    // the mass for which to use the image
    return ( body, viewDiameter ) => new BodyRenderer.SwitchableBodyRenderer(
      body,
      targetMass,
      new BodyRenderer.ImageRenderer( body, viewDiameter, image1 ), new BodyRenderer.ImageRenderer( body, viewDiameter, image2 ) );
  };

  /**
   * Have to artificially scale up the time readout so that Sun/Earth/Moon mode has a stable orbit with correct periods
   * @param scale
   * @returns {function}
   */
  const scaledDays = scale => {
    return time => {
      const value = ( time / GravityAndOrbitsClock.SECONDS_PER_DAY * scale );
      const units = ( value === 1 ) ? earthDayString : earthDaysString;
      return StringUtils.format( pattern0Value1UnitsString, Util.toFixed( value, 0 ), units );
    };
  };

  /**
   * Create a function that converts SI (seconds) to a string indicating elapsed minutes, used in formatting the
   * elapsed clock readout
   * @param time
   * @returns {string}
   */
  const formatMinutes = time => {
    const value = ( time / SECONDS_PER_MINUTE );
    const units = ( value === 1 ) ? earthMinuteString : earthMinutesString;
    return StringUtils.format( pattern0Value1UnitsString, Util.toFixed( value, 0 ), units );
  };

  ModeListModel.SunEarthModeConfig = SunEarthModeConfig;
  ModeListModel.SunEarthMoonModeConfig = SunEarthMoonModeConfig;
  ModeListModel.EarthMoonModeConfig = EarthMoonModeConfig;
  ModeListModel.EarthSpaceStationModeConfig = EarthSpaceStationModeConfig;

  return gravityAndOrbits.register( 'ModeListModel', ModeListModel );
} );