// Copyright 2014-2019, University of Colorado Boulder

/**
 * This type makes the radii of all objects much larger than the true physical values to make them visible on
 * the same scale. Configuration file for setting up the model mode parameters. This is typically done by
 * multiplying the real values by the desired scales. SunEarth and SunEarthMoon should be as similar as possible
 * (aside from the addition of the moon).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const ModeListModel = require( 'GRAVITY_AND_ORBITS/common/module/ModeListModel' );
  const ModeListParameterList = require( 'GRAVITY_AND_ORBITS/common/module/ModeListParameterList' );

  // constants
  const SUN_RADIUS_MULTIPLIER = 50; // sun radius multiplier for SunEarthMode and SunEarthMoonMode, tuned by hand
  const EARTH_MOON_RADIUS_MULTIPLIER = 800; // earth and moon radius multiplier for SunEarthMode and SunEarthMoonMode, tuned by hand
  const EARTH_MASS_SCALE_FACTOR = 10200; // tuned by hand so there are 12 model lunar orbits in one model earth orbit

  // in days - actual period is 27.322 days, but this sim's model produces a period of 27.6 days (by inspection)
  const MOON_ORBITAL_PERIOD = 27.6;

  /*
   * force scale for SunEarthMode and SunEarthMoonMode.
   * balances increased mass and so that forces are 1/2 grid cell in default conditions, hand tuned by checking
   * that reducing the distance by a factor of 2 increases the force arrow by a factor of 4
   */
  const FORCE_SCALE = 0.573 / EARTH_MASS_SCALE_FACTOR;

  /*
   * Have to artificially scale up the time readout so that SunEarthMode and SunEarthMoonMode modes have a stable
   * orbits with correct periods since masses are nonphysical. 365 is days in a year.
   */
  const SUN_EARTH_MODE_TIME_SCALE = 365.0 / 334.0;

  /**
   * Convenience function that converts days to seconds, using
   * days * hoursPerDay * minutesPerHour * secondsPerMinute
   *
   * @param  {number} days
   * @returns {number}
   */
  const daysToSeconds = days => days * 24 * 60 * 60;

  class ModelModeList extends ModeListModel {

    /**
     * @param {Property.<boolean>} isPlayingProperty
     * @param {Property.<boolean>} gravityEnabledProperty
     * @param {Property.<boolean>} steppingProperty
     * @param {Property.<boolean>} rewindingProperty
     * @param {Property.<number>} speedTypeProperty
     * @param {Tandem} tandem
     */
    constructor( isPlayingProperty, gravityEnabledProperty, steppingProperty, rewindingProperty, speedTypeProperty, tandem ) {
      super(
        new ModeListParameterList( isPlayingProperty, gravityEnabledProperty, steppingProperty, rewindingProperty, speedTypeProperty ),
        new SunEarthModeConfig(),
        new SunEarthMoonModeConfig(),
        new EarthMoonModeConfig(),
        new EarthSpaceStationModeConfig(),
        tandem, {
          adjustMoonPathLength: true // adjust the moon path length in model mode
        } );
    }
  }

  gravityAndOrbits.register( 'ModelModeList', ModelModeList );

  /**
   * Model configuration for a system with the sun and the earth.
   */
  class SunEarthModeConfig extends ModeListModel.SunEarthModeConfig {
    constructor() {
      super();
      this.sun.radius *= SUN_RADIUS_MULTIPLIER;
      this.earth.radius *= EARTH_MOON_RADIUS_MULTIPLIER;
      this.earth.mass *= EARTH_MASS_SCALE_FACTOR;
      this.forceScale *= FORCE_SCALE;
      this.timeScale = SUN_EARTH_MODE_TIME_SCALE;

      // Sun shouldn't move in model modes
      this.sun.fixed = true;
    }
  }

  gravityAndOrbits.register( 'SunEarthModeConfig', SunEarthModeConfig );

  /**
   * Model configuration for a system with the sun, earth and moon.
   */
  class SunEarthMoonModeConfig extends ModeListModel.SunEarthMoonModeConfig {
    constructor() {
      super();
      this.sun.radius *= SUN_RADIUS_MULTIPLIER;
      this.earth.radius *= EARTH_MOON_RADIUS_MULTIPLIER;
      this.moon.radius *= EARTH_MOON_RADIUS_MULTIPLIER;

      this.earth.mass *= EARTH_MASS_SCALE_FACTOR;
      this.moon.vx *= 21;
      this.moon.y = this.earth.radius * 1.7;

      this.forceScale *= FORCE_SCALE;
      this.timeScale = SUN_EARTH_MODE_TIME_SCALE;

      // Sun shouldn't move in model modes
      this.sun.fixed = true;
    }
  }

  gravityAndOrbits.register( 'SunEarthMoonModeConfig', SunEarthMoonModeConfig );

  class EarthMoonModeConfig extends ModeListModel.EarthMoonModeConfig {
    constructor() {

      const moonRotationPeriod = daysToSeconds( MOON_ORBITAL_PERIOD );
      super( { moonRotationPeriod: moonRotationPeriod } );

      const radiusMultiplier = 15; // tuned by hand
      this.earth.radius *= radiusMultiplier;
      this.moon.radius *= radiusMultiplier;

      // so that default gravity force takes up 1/2 cell in grid
      this.forceScale *= 0.77;
    }
  }

  gravityAndOrbits.register( 'EarthMoonModeConfig', EarthMoonModeConfig );

  /**
   * Model configuration for a system with the earth and a space station.
   */
  class EarthSpaceStationModeConfig extends ModeListModel.EarthSpaceStationModeConfig {
    constructor() {
      super();

      // tuned by hand
      this.earth.radius *= 0.8;
      this.spaceStation.radius *= 8;
    }
  }

  gravityAndOrbits.register( 'EarthSpaceStationModeConfig', EarthSpaceStationModeConfig );

  return ModelModeList;
} );