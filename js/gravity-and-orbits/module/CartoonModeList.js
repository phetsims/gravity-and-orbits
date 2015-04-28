// Copyright 2002-2014, University of Colorado

/**
 * Cartoon mode list makes the radii of all objects much larger than the true physical values to make them visible on the same scale.
 * Configuration file for setting up the cartoon mode parameters.  This is typically done by multiplying the real values by the desired scales.
 * SunEarth and SunEarthMoon should be as similar as possible (aside from the addition of the moon)
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ModeList = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/ModeList' );
  var ModeListParameterList = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/ModeListParameterList' );

  function SunEarthModeConfig() {

    ModeList.SunEarthModeConfig.call( this );

    this.sun.radius *= 50;
    this.earth.radius *= 800;
    //Tuned by hand so there are 12 cartoon lunar orbits in one cartoon earth orbit
    var earthMassScaleFactor = 10200;
    this.earth.mass *= earthMassScaleFactor;
    //to balance increased mass and so that forces are 1/2 grid cell in default conditions, hand tuned by checking that reducing the distance by a factor of 2 increases the force arrow by a factor of 4
    this.forceScale *= 0.573 / earthMassScaleFactor;
    //Have to artificially scale up the time readout so that Sun/Earth/Moon mode has a stable orbit with correct periods since masses are nonphysical
    this.timeScale = 365.0 / 334.0;
    //Sun shouldn't move in cartoon modes
    this.sun.fixed = true;
  }

  inherit( ModeList.SunEarthModeConfig, SunEarthModeConfig );

  function SunEarthMoonModeConfig() {

    ModeList.SunEarthMoonModeConfig.call( this );

    this.sun.radius *= 50;
    this.earth.radius *= 800;
    this.moon.radius *= 800;
    //Tuned by hand so there are 12 cartoon lunar orbits in one cartoon earth orbit
    var earthMassScaleFactor = 10200;
    this.earth.mass *= earthMassScaleFactor;
    this.moon.vx *= 21;
    this.moon.y = this.earth.radius * 1.7;
    //to balance increased mass and so that forces are 1/2 grid cell in default conditions
    this.forceScale *= 0.573 / earthMassScaleFactor;
    //Have to artificially scale up the time readout so that Sun/Earth/Moon mode has a stable orbit with correct periods since masses are nonphysical
    this.timeScale = 365.0 / 334.0;
    //Sun shouldn't move in cartoon modes
    this.sun.fixed = true;
  }

  inherit( ModeList.SunEarthMoonModeConfig, SunEarthMoonModeConfig );

  function EarthMoonModeConfig() {

    ModeList.EarthMoonModeConfig.call( this );

    this.earth.radius *= 15;
    this.moon.radius *= 15;
    //so that default gravity force takes up 1/2 cell in grid
    this.forceScale *= 0.77;
  }

  inherit( ModeList.EarthMoonModeConfig, EarthMoonModeConfig );

  function EarthSpaceStationModeConfig() {

    ModeList.EarthSpaceStationModeConfig.call( this );

    this.earth.radius *= 0.8;
    this.spaceStation.radius *= 8;
  }

  inherit( ModeList.EarthSpaceStationModeConfig, EarthSpaceStationModeConfig );

  /**
   *
   * @param {Property<boolean>} playButtonPressed
   * @param {Property<boolean>} gravityEnabled
   * @param {Property<boolean>} stepping
   * @param {Property<boolean>} rewinding
   * @param {Property<number>} timeSpeedScale
   * @constructor
   */
  function CartoonModeList( playButtonPressed, gravityEnabled, stepping, rewinding, timeSpeedScale ) {
    ModeList.ModeList.call( this, new ModeListParameterList( playButtonPressed, gravityEnabled, stepping, rewinding, timeSpeedScale ),
      new SunEarthModeConfig(), new SunEarthMoonModeConfig(), new EarthMoonModeConfig(), new EarthSpaceStationModeConfig() );
  }

  return inherit( ModeList.ModeList, CartoonModeList );
} );
