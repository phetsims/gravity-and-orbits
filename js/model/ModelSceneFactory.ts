// Copyright 2014-2022, University of Colorado Boulder

/**
 * This type makes the radii of all objects much larger than the true physical values to make them visible on
 * the same scale. Configuration file for setting up the model scene parameters. This is typically done by
 * multiplying the real values by the desired scales. SunEarth and SunEarthMoon should be as similar as possible
 * (aside from the addition of the moon).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Tandem from '../../../tandem/js/Tandem.js';
import GravityAndOrbitsModel from '../common/model/GravityAndOrbitsModel.js';
import SceneFactory from '../common/SceneFactory.js';
import gravityAndOrbits from '../gravityAndOrbits.js';

// constants
const SUN_RADIUS_MULTIPLIER = 50; // sun radius multiplier for SunEarthMode and SunEarthMoonMode, tuned by hand
const EARTH_MOON_RADIUS_MULTIPLIER = 800; // earth and moon radius multiplier for SunEarthMode and SunEarthMoonMode, tuned by hand

/**
 * Convenience function that converts days to seconds, using days * hoursPerDay * minutesPerHour * secondsPerMinute
 */
const daysToSeconds = ( days: number ) => days * 24 * 60 * 60;

class ModelSceneFactory extends SceneFactory {

  public constructor( model: GravityAndOrbitsModel, modelTandem: Tandem, viewTandem: Tandem ) {
    super(
      model,
      new SunEarthModeConfig(),
      new SunEarthMoonModeConfig(),
      new PlanetMoonModeConfig(),
      new EarthSpaceStationModeConfig(),
      modelTandem, viewTandem, {
        adjustMoonPathLength: true, // adjust the moon path length in model
        adjustMoonOrbit: true
      } );
  }
}

gravityAndOrbits.register( 'ModelSceneFactory', ModelSceneFactory );

/**
 * Model configuration for a system with the sun and the earth.
 */
class SunEarthModeConfig extends SceneFactory.SunEarthModeConfig {
  public constructor() {
    super();
    this.sun.radius *= SUN_RADIUS_MULTIPLIER;
    this.planet.radius *= EARTH_MOON_RADIUS_MULTIPLIER;

    // Sun shouldn't move in model modes
    this.sun.isMovable = false;
    this.forceScale! *= 0.58; // Tuned so the default force arrow takes 1/2 grid cell
  }
}

gravityAndOrbits.register( 'SunEarthModeConfig', SunEarthModeConfig );

/**
 * Model configuration for a system with the sun, earth and moon.
 */
class SunEarthMoonModeConfig extends SceneFactory.SunEarthMoonModeConfig {
  public constructor() {
    super();
    this.sun.radius *= SUN_RADIUS_MULTIPLIER;
    this.planet.radius *= EARTH_MOON_RADIUS_MULTIPLIER;
    this.moon.radius *= EARTH_MOON_RADIUS_MULTIPLIER;

    this.moon.vx *= 21;
    this.moon.y = this.planet.radius * 1.7;

    // Sun shouldn't move in model modes
    this.sun.isMovable = false;

    this.forceScale! *= 0.58; // Tuned so the default force arrow takes 1/2 grid cell
  }
}

gravityAndOrbits.register( 'SunEarthMoonModeConfig', SunEarthMoonModeConfig );

class PlanetMoonModeConfig extends SceneFactory.PlanetMoonModeConfig {
  public constructor() {

    super( { moonRotationPeriod: daysToSeconds( 27.322 ) } );

    const radiusMultiplier = 15; // tuned by hand
    this.planet.radius *= radiusMultiplier;
    this.moon.radius *= radiusMultiplier;

    // so that default gravity force takes up 1/2 cell in grid
    this.forceScale! *= 0.79;
  }
}

gravityAndOrbits.register( 'PlanetMoonModeConfig', PlanetMoonModeConfig );

/**
 * Model configuration for a system with the earth and a space station.
 */
class EarthSpaceStationModeConfig extends SceneFactory.EarthSpaceStationModeConfig {
  public constructor() {
    super();

    // tuned by hand
    this.planet.radius *= 0.8;
    this.satellite.radius *= 20000;
  }
}

gravityAndOrbits.register( 'EarthSpaceStationModeConfig', EarthSpaceStationModeConfig );

export default ModelSceneFactory;