// Copyright 2014-2022, University of Colorado Boulder

/**
 * SceneFactory enumerates and declares the possible modes in the GravityAndOrbitsModel, such as 'Star + Planet' scene.
 * Models (and the bodies they contain) are created in SceneFactory.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Utils from '../../../dot/js/Utils.js';
import Vector2 from '../../../dot/js/Vector2.js';
import StringUtils from '../../../phetcommon/js/util/StringUtils.js';
import { Color, HBox, Image, Line, Mipmap, Node } from '../../../scenery/js/imports.js';
import earth_png from '../../mipmaps/earth_png.js';
import moonGeneric_png from '../../mipmaps/moonGeneric_png.js';
import moon_png from '../../mipmaps/moon_png.js';
import planetGeneric_png from '../../mipmaps/planetGeneric_png.js';
import spaceStation_png from '../../mipmaps/spaceStation_png.js';
import sun_png from '../../mipmaps/sun_png.js';
import gravityAndOrbits from '../gravityAndOrbits.js';
import GravityAndOrbitsStrings from '../GravityAndOrbitsStrings.js';
import GravityAndOrbitsConstants from './GravityAndOrbitsConstants.js';
import GravityAndOrbitsScene from './GravityAndOrbitsScene.js';
import Body, { BodyOptions } from './model/Body.js';
import BodyConfiguration from './model/BodyConfiguration.js';
import GravityAndOrbitsClock from './model/GravityAndOrbitsClock.js';
import ModeConfig from './model/ModeConfig.js';
import Pair from './model/Pair.js';
import { ImageRenderer, SwitchableBodyRenderer } from './view/BodyRenderer.js';
import EarthMassReadoutNode from './view/EarthMassReadoutNode.js';
import SpaceStationMassReadoutNode from './view/SpaceStationMassReadoutNode.js';
import VectorNode from './view/VectorNode.js';
import GravityAndOrbitsModel from './model/GravityAndOrbitsModel.js';
import Tandem from '../../../tandem/js/Tandem.js';
import BodyNode from './view/BodyNode.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../phet-core/js/optionize.js';
import TProperty from '../../../axon/js/TProperty.js';
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import StringIO from '../../../tandem/js/types/StringIO.js';

// These constants are only used in SceneFactory, and SceneFactory is used to create the specific model instantiations,
// so we keep them here instead of the model.
const SUN_RADIUS = 6.957E8; // m
const SUN_MASS = 1.989E30; // kg
const EARTH_RADIUS = 6.371E6;
const EARTH_MASS = GravityAndOrbitsConstants.EARTH_MASS;
const EARTH_PERIHELION = 147098074E3; // m, distance from the sun at the closest point
const EARTH_ORBITAL_SPEED_AT_PERIHELION = 30300; // m/s
const MOON_MASS = 7.346E22;
const MOON_RADIUS = 1727.4E3;
const MOON_SPEED_AT_PERIGEE = -1082; // m/s
const MOON_PERIGEE = 363300E3; // km, distance from earth at closet point
const MOON_X = EARTH_PERIHELION;
const MOON_Y = MOON_PERIGEE;

// see http://en.wikipedia.org/wiki/International_Space_Station
const SPACE_STATION_RADIUS = 91 / 2;
const SPACE_STATION_MASS = GravityAndOrbitsConstants.SPACE_STATION_MASS;
const SPACE_STATION_SPEED = 7706;
const SPACE_STATION_PERIGEE = 347000;

// orbital period of the space station, in seconds
// orbit determined to be 91.4 days, by inspection
const SPACE_STATION_ORBITAL_PERIOD = 91.4 * 60;

const SECONDS_PER_MINUTE = 60;
const FORCE_SCALE = VectorNode.FORCE_SCALE;
const DEFAULT_DT = GravityAndOrbitsClock.DEFAULT_DT;

type SelfOptions = {
  adjustMoonPathLength?: boolean;
  adjustMoonOrbit?: boolean;
};

type SceneFactoryOptions = SelfOptions;

class SceneFactory {
  public readonly scenes: GravityAndOrbitsScene[];
  public static SunEarthModeConfig: typeof SunEarthModeConfig;
  public static SunEarthMoonModeConfig: typeof SunEarthMoonModeConfig;
  public static PlanetMoonModeConfig: typeof PlanetMoonModeConfig;
  public static EarthSpaceStationModeConfig: typeof EarthSpaceStationModeConfig;

  public constructor( model: GravityAndOrbitsModel, planetStar: SunEarthModeConfig, sunEarthMoon: SunEarthMoonModeConfig, earthMoon: PlanetMoonModeConfig, earthSpaceStation: EarthSpaceStationModeConfig, modelTandem: Tandem, viewTandem: Tandem, providedOptions?: SceneFactoryOptions ) {

    const options = optionize<SceneFactoryOptions, SelfOptions>()( {
      adjustMoonPathLength: false, // increase the moon path so that it matches other traces at default settings
      adjustMoonOrbit: false
    }, providedOptions );

    this.scenes = []; // in the java version this class extended ArrayList, but here we have an array field

    planetStar.center();
    sunEarthMoon.center();
    earthMoon.center();
    earthSpaceStation.center();

    const readoutInEarthMasses = ( bodyNode: BodyNode, visibleProperty: TReadOnlyProperty<boolean> ) => new EarthMassReadoutNode( bodyNode, visibleProperty );

    // Create the actual modes (GravityAndOrbitsModes) from the specifications passed in (ModeConfigs).
    const SUN_MODES_VELOCITY_SCALE = 4.48E6;
    const starPlanetSceneTandem = modelTandem.createTandem( 'starPlanetScene' );

    const star0 = new Star( model, planetStar.sun, starPlanetSceneTandem.createTandem( 'star' ), {
      maxPathLength: 345608942000 // in km
    } );
    const planet0 = new Planet( model, planetStar.planet, starPlanetSceneTandem.createTandem( 'planet' ) );

    this.scenes.push( new GravityAndOrbitsScene(
      model,
      planetStar,
      scaledDays,
      this.createIconImage( true, true, false, false ),
      SUN_MODES_VELOCITY_SCALE,
      readoutInEarthMasses,
      planetStar.planet.x / 2,
      starPlanetSceneTandem,
      viewTandem.createTandem( GravityAndOrbitsConstants.PLAY_AREA_TANDEM_NAME ).createTandem( 'starPlanetSceneView' ),
      [ star0, planet0 ],
      [ new Pair( star0, planet0, starPlanetSceneTandem.createTandem( 'starPlanetPair' ) ) ] )
    );

    // increase moon path length so that it fades away with other bodies in model coordinates (at default orbit)
    const pathLengthBuffer = options.adjustMoonPathLength ? sunEarthMoon.moon.x / 2 : 0;
    const starPlanetMoonSceneTandem = modelTandem.createTandem( 'starPlanetMoonScene' );
    const star1 = new Star( model, sunEarthMoon.sun, starPlanetMoonSceneTandem.createTandem( 'star' ), {
      maxPathLength: 345608942000 // in km
    } );
    const planet1 = new Planet( model, sunEarthMoon.planet, starPlanetMoonSceneTandem.createTandem( 'planet' ), {
      touchDilation: 2
    } );
    const moon1 = new Moon( model,
      false, // no room for the slider
      false, // so it doesn't intersect with earth mass readout
      sunEarthMoon.moon,
      starPlanetMoonSceneTandem.createTandem( 'moon' ), {
        pathLengthBuffer: pathLengthBuffer,
        touchDilation: 5
      }
    );
    this.scenes.push( new GravityAndOrbitsScene(
      model,
      sunEarthMoon,
      scaledDays,
      this.createIconImage( true, true, true, false ),
      SUN_MODES_VELOCITY_SCALE,
      readoutInEarthMasses,
      sunEarthMoon.planet.x / 2,
      starPlanetMoonSceneTandem,
      viewTandem.createTandem( GravityAndOrbitsConstants.PLAY_AREA_TANDEM_NAME ).createTandem( 'starPlanetMoonSceneView' ),
      [ star1, planet1, moon1 ], [
        new Pair( star1, planet1, starPlanetMoonSceneTandem.createTandem( 'starPlanetPair' ) ),
        new Pair( star1, moon1, starPlanetMoonSceneTandem.createTandem( 'starMoonPair' ) ),
        new Pair( planet1, moon1, starPlanetMoonSceneTandem.createTandem( 'planetMoonPair' ) )
      ], {
        adjustMoonOrbit: options.adjustMoonOrbit
      } ) );

    const planetMoonSceneTandem = modelTandem.createTandem( 'planetMoonScene' );
    const planet2 = new Planet( model, earthMoon.planet, planetMoonSceneTandem.createTandem( 'planet' ), {
      orbitalCenter: new Vector2( earthMoon.planet.x, earthMoon.planet.y )
    } );
    const moon2 = new Moon( model, true, true, earthMoon.moon, planetMoonSceneTandem.createTandem( 'moon' ), {
      orbitalCenter: new Vector2( earthMoon.planet.x, earthMoon.planet.y ),
      rotationPeriod: earthMoon.moon.rotationPeriod
    } );
    this.scenes.push( new GravityAndOrbitsScene(
      model,
      earthMoon,
      scaledDays,
      this.createIconImage( false, true, true, false ),
      SUN_MODES_VELOCITY_SCALE * 0.06,
      readoutInEarthMasses,
      earthMoon.moon.y / 2,
      planetMoonSceneTandem,
      viewTandem.createTandem( GravityAndOrbitsConstants.PLAY_AREA_TANDEM_NAME ).createTandem( 'planetMoonSceneView' ),
      [ planet2, moon2 ],
      [ new Pair( planet2, moon2, planetMoonSceneTandem.createTandem( 'planetMoonPair' ) ) ], {
        gridCenter: new Vector2( earthMoon.planet.x, 0 )
      } ) );

    const spaceStationMassReadoutFactory = ( bodyNode: BodyNode, visibleProperty: TReadOnlyProperty<boolean> ) => new SpaceStationMassReadoutNode( bodyNode, visibleProperty );
    const planetSatelliteSceneTandem = modelTandem.createTandem( 'planetSatelliteScene' );
    const planet3 = new Planet( model, earthSpaceStation.planet, planetSatelliteSceneTandem.createTandem( 'planet' ), {
      maxPathLength: 35879455, // in km
      touchDilation: 0
    } );
    const satellite3 = new Satellite( model, earthSpaceStation, planetSatelliteSceneTandem.createTandem( 'satellite' ), {
      rotationPeriod: earthSpaceStation.satellite.rotationPeriod
    } );
    this.scenes.push( new GravityAndOrbitsScene(
      model,
      earthSpaceStation,
      formatMinutes,
      this.createIconImage( false, true, false, true ),
      SUN_MODES_VELOCITY_SCALE / 10000,
      spaceStationMassReadoutFactory,
      earthSpaceStation.satellite.x - earthSpaceStation.planet.x,
      planetSatelliteSceneTandem,
      viewTandem.createTandem( GravityAndOrbitsConstants.PLAY_AREA_TANDEM_NAME ).createTandem( 'planetSatelliteSceneView' ),
      [ planet3, satellite3 ],
      [ new Pair( planet3, satellite3, planetSatelliteSceneTandem.createTandem( 'planetSatellitePair' ) ) ], {
        gridCenter: new Vector2( earthSpaceStation.planet.x, 0 )
      } ) );
  }

  /**
   * Creates an image that can be used for the scene icon, showing the nodes of each body in the mode.
   */
  private createIconImage( sun: boolean, earth: boolean, moon: boolean, spaceStation: boolean ): Node {
    const children = [
      new Image( sun_png, { visible: sun } ),
      new Image( earth_png, { visible: earth } ),
      new Image( moon_png, { visible: moon } ),
      new Image( spaceStation_png, { visible: spaceStation } )
    ];

    for ( let i = 0; i < children.length; i++ ) {
      children[ i ].setScaleMagnitude( 25 / children[ i ].width );
    }

    return new HBox( { children: children, spacing: 20, excludeInvisibleChildrenFromBounds: false } );
  }
}

class SunEarthModeConfig extends ModeConfig {
  public readonly sun: BodyConfiguration;
  public readonly planet: BodyConfiguration;

  public constructor() {

    super( 1.25 );

    this.sun = new BodyConfiguration( SUN_MASS, SUN_RADIUS, 0, 0, 0, 0 );
    this.planet = new BodyConfiguration(
      EARTH_MASS, EARTH_RADIUS, EARTH_PERIHELION, 0, 0, EARTH_ORBITAL_SPEED_AT_PERIHELION );
    this.initialMeasuringTapePosition = new Line(
      ( this.sun.x + this.planet.x ) / 3,
      -this.planet.x / 2,
      ( this.sun.x + this.planet.x ) / 3 + 80000000 * 1000,
      -this.planet.x / 2 );
    this.forceScale = FORCE_SCALE * 120;
  }

  protected getBodies(): BodyConfiguration[] {
    return [ this.sun, this.planet ];
  }
}

// static class: SunEarthMoonModeConfig
class SunEarthMoonModeConfig extends ModeConfig {
  public readonly sun: BodyConfiguration;
  public readonly planet: BodyConfiguration;
  public readonly moon: BodyConfiguration;

  public constructor() {

    super( 1.25 );
    this.sun = new BodyConfiguration( SUN_MASS, SUN_RADIUS, 0, 0, 0, 0 );
    this.planet = new BodyConfiguration(
      EARTH_MASS, EARTH_RADIUS, EARTH_PERIHELION, 0, 0, EARTH_ORBITAL_SPEED_AT_PERIHELION );
    this.moon = new BodyConfiguration(
      MOON_MASS, MOON_RADIUS, MOON_X, MOON_Y, MOON_SPEED_AT_PERIGEE, EARTH_ORBITAL_SPEED_AT_PERIHELION );
    this.initialMeasuringTapePosition = new Line(
      ( this.sun.x + this.planet.x ) / 3,
      -this.planet.x / 2,
      ( this.sun.x + this.planet.x ) / 3 + 80000000 * 1000,
      -this.planet.x / 2 );
    this.forceScale = FORCE_SCALE * 120;
  }

  protected getBodies(): BodyConfiguration[] {
    return [ this.sun, this.planet, this.moon ];
  }
}

type PlanetMoonModeConfigSelfOptions = {
  moonRotationPeriod?: number | null;
};

type PlanetMoonModeConfigOptions = PlanetMoonModeConfigSelfOptions;

class PlanetMoonModeConfig extends ModeConfig {
  public readonly planet: BodyConfiguration;
  public readonly moon: BodyConfiguration;

  /**
   * Configuration for the Earth+Moon system.
   */
  public constructor( providedOptions?: PlanetMoonModeConfigOptions ) {

    const options = optionize<PlanetMoonModeConfigOptions, PlanetMoonModeConfigSelfOptions>()( {
      moonRotationPeriod: null // rotation period for the moon in seconds, null means no rotation
    }, providedOptions );

    super( 400 );

    // We want to center the overall motion of the system, but specify the relative speed of the moon to be
    // equal to MOON_SPEED_AT_PERIGEE
    const planetVelocityX = MOON_MASS * 1082 / ( EARTH_MASS + MOON_MASS );
    const moonVelocityX = planetVelocityX - Math.abs( MOON_SPEED_AT_PERIGEE );

    this.planet = new BodyConfiguration( EARTH_MASS, EARTH_RADIUS, EARTH_PERIHELION, 0, planetVelocityX, 0 );
    this.moon = new BodyConfiguration( MOON_MASS, MOON_RADIUS, MOON_X, MOON_Y, moonVelocityX, 0, {
      rotationPeriod: options.moonRotationPeriod || null
    } );
    this.initialMeasuringTapePosition = new Line(
      this.planet.x + this.planet.radius * 2,
      -this.moon.y * 0.7,
      this.planet.x + this.planet.radius * 2 + 150000 * 1000,
      -this.moon.y * 0.7 );
    this.forceScale = FORCE_SCALE * 45;
    this.dt = DEFAULT_DT / 3;  // actual days
  }

  protected getBodies(): BodyConfiguration[] {
    return [ this.planet, this.moon ];
  }
}

class EarthSpaceStationModeConfig extends ModeConfig {
  public readonly planet: BodyConfiguration;
  public readonly satellite: BodyConfiguration;

  /**
   * @param [spaceStationRotationPeriod] - in seconds
   */
  public constructor( spaceStationRotationPeriod = SPACE_STATION_ORBITAL_PERIOD ) {

    super( 21600 );

    this.planet = new BodyConfiguration( EARTH_MASS, EARTH_RADIUS, 0, 0, 0, 0 );
    this.satellite = new BodyConfiguration( SPACE_STATION_MASS, SPACE_STATION_RADIUS,
      SPACE_STATION_PERIGEE + EARTH_RADIUS + SPACE_STATION_RADIUS, 0, 0, SPACE_STATION_SPEED, {
        rotationPeriod: spaceStationRotationPeriod
      } );

    // Sampled at runtime from MeasuringTape
    const x0 = 3162119;
    this.initialMeasuringTapePosition = new Line( x0, 7680496, x0 + 3000 * 1000, 7680496 );
    this.forceScale = FORCE_SCALE * 3E13;
    this.dt = DEFAULT_DT * 9E-4;
  }

  protected getBodies(): BodyConfiguration[] {
    return [ this.planet, this.satellite ];
  }
}

/**
 * Creates a BodyRenderer that just shows the specified image
 */
const getImageRenderer = ( image: Mipmap ) => {
  return ( body: Body, viewDiameter: number ) => new ImageRenderer( body, viewDiameter, image );
};

/**
 * Creates a BodyRenderer that shows an image when at the targetMass, otherwise shows a shaded sphere
 */
const getSwitchableRenderer = ( image1: Mipmap, image2: Mipmap, targetMass: number ) => {

  // the mass for which to use the image
  return ( body: Body, viewDiameter: number ) => new SwitchableBodyRenderer(
    body,
    targetMass,
    new ImageRenderer( body, viewDiameter, image1 ), new ImageRenderer( body, viewDiameter, image2 ) );
};

/**
 * Have to artificially scale up the time readout so that Sun/Earth/Moon scene has a stable orbit with correct periods
 */
const scaledDays = ( timeProperty: TProperty<number>, tandem: Tandem ) => {
  return new DerivedProperty( [
    timeProperty,
    GravityAndOrbitsStrings.earthDaysStringProperty,
    GravityAndOrbitsStrings.pattern[ '0value' ][ '1unitsStringProperty' ]
  ], ( time, earthDaysString, patternString ) => {
    const value = ( time / GravityAndOrbitsClock.SECONDS_PER_DAY );
    const fixedValue = Utils.toFixed( value, 0 );
    return StringUtils.format( patternString, fixedValue, earthDaysString );
  }, {
    tandem: tandem,
    phetioValueType: StringIO
  } );
};

/**
 * Create a function that converts SI (seconds) to a string indicating elapsed minutes, used in formatting the
 * elapsed clock readout
 */
const formatMinutes = ( timeProperty: TProperty<number>, tandem: Tandem ) => {
  return new DerivedProperty( [
    timeProperty,
    GravityAndOrbitsStrings.earthMinutesStringProperty,
    GravityAndOrbitsStrings.pattern[ '0value' ][ '1unitsStringProperty' ]
  ], ( time, earthMinutesString, patternString ) => {
    const value = ( time / SECONDS_PER_MINUTE );
    const fixedValue = Utils.toFixed( value, 0 );
    return StringUtils.format( patternString, fixedValue, earthMinutesString );
  }, {
    tandem: tandem,
    phetioValueType: StringIO
  } );
};

class Satellite extends Body {

  public constructor( model: GravityAndOrbitsModel, earthSpaceStation: EarthSpaceStationModeConfig, tandem: Tandem, options?: BodyOptions ) {
    super(
      'satellite',
      earthSpaceStation.satellite,
      Color.gray,
      Color.white,
      getImageRenderer( spaceStation_png ),
      -Math.PI / 4,
      earthSpaceStation.satellite.mass,
      GravityAndOrbitsStrings.spaceStationStringProperty,
      model,
      tandem,
      options
    );
  }
}

class Moon extends Body {

  public constructor( model: GravityAndOrbitsModel, massSettable: boolean, massReadoutBelow: boolean, bodyConfiguration: BodyConfiguration, tandem: Tandem, providedOptions?: BodyOptions ) {
    const options = optionize<BodyOptions, any, any>()( { // eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-explicit-any
      pathLengthBuffer: 0, // adjustment to moon path length so that it matches other traces at default settings
      massSettable: massSettable,
      massReadoutBelow: massReadoutBelow,
      rotationPeriod: null // rotation period in seconds, null means no rotation
    }, providedOptions );

    super(
      'moon',
      bodyConfiguration,
      Color.magenta,
      Color.white,
      getSwitchableRenderer( moon_png, moonGeneric_png, bodyConfiguration.mass ),
      -3 * Math.PI / 4,
      bodyConfiguration.mass,
      GravityAndOrbitsStrings.ourMoonStringProperty,
      model,
      tandem,
      options
    );
  }
}

type PlanetOptions = BodyOptions;

class Planet extends Body {

  /**
   * @param model
   * @param bodyConfiguration
   * @param tandem
   * @param [providedOptions]
   */
  public constructor( model: GravityAndOrbitsModel, bodyConfiguration: BodyConfiguration, tandem: Tandem, providedOptions?: PlanetOptions ) {
    super(
      'planet',
      bodyConfiguration,
      Color.gray,
      Color.lightGray,
      getSwitchableRenderer( earth_png, planetGeneric_png, bodyConfiguration.mass ),
      -Math.PI / 4,
      bodyConfiguration.mass,
      GravityAndOrbitsStrings.earthStringProperty,
      model,
      tandem,
      providedOptions
    );
  }
}

class Star extends Body {

  public constructor( model: GravityAndOrbitsModel, bodyConfiguration: BodyConfiguration, tandem: Tandem, options?: BodyOptions ) {
    super(
      'star',
      bodyConfiguration,
      Color.yellow,
      Color.white,
      getImageRenderer( sun_png ),
      -Math.PI / 4,
      bodyConfiguration.mass,
      GravityAndOrbitsStrings.ourSunStringProperty,
      model,
      tandem,
      options
    );
  }
}

SceneFactory.SunEarthModeConfig = SunEarthModeConfig;
SceneFactory.SunEarthMoonModeConfig = SunEarthMoonModeConfig;
SceneFactory.PlanetMoonModeConfig = PlanetMoonModeConfig;
SceneFactory.EarthSpaceStationModeConfig = EarthSpaceStationModeConfig;

gravityAndOrbits.register( 'SceneFactory', SceneFactory );
export default SceneFactory;
