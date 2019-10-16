// Copyright 2014-2019, University of Colorado Boulder

/**
 * Configuration file for "real" tab modes, uses physically accurate parameters.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const ModeList = require( 'GRAVITY_AND_ORBITS/common/module/ModeList' );
  const ModeListParameterList = require( 'GRAVITY_AND_ORBITS/common/module/ModeListParameterList' );

  class RealModeList extends ModeList.ModeList {
    /**
     * @param {Property.<boolean>} playButtonPressedProperty
     * @param {Property.<boolean>} gravityEnabledProperty
     * @param {Property.<boolean>} steppingProperty
     * @param {Property.<boolean>} rewindingProperty
     * @param {Property.<number>} speedTypeProperty
     */
    constructor( playButtonPressedProperty, gravityEnabledProperty, steppingProperty, rewindingProperty, speedTypeProperty ) {
      super(
        new ModeListParameterList( playButtonPressedProperty, gravityEnabledProperty, steppingProperty, rewindingProperty, speedTypeProperty ),
        new ModeList.SunEarthModeConfig(),
        new ModeList.SunEarthMoonModeConfig(),
        new ModeList.EarthMoonModeConfig(),
        new ModeList.EarthSpaceStationModeConfig()
      );
    }
  }

  return gravityAndOrbits.register( 'RealModeList', RealModeList );
} );