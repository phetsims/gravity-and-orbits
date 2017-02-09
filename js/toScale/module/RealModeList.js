// Copyright 2014-2015, University of Colorado Boulder

/**
 * Configuration file for "real" tab modes, uses physically accurate parameters.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ModeList = require( 'GRAVITY_AND_ORBITS/common/module/ModeList' );
  var ModeListParameterList = require( 'GRAVITY_AND_ORBITS/common/module/ModeListParameterList' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  /**
   * @param {Property.<boolean>} playButtonPressedProperty
   * @param {Property.<boolean>} gravityEnabledProperty
   * @param {Property.<boolean>} steppingProperty
   * @param {Property.<boolean>} rewindingProperty
   * @param {Property.<number>} timeSpeedScaleProperty
   * @constructor
   */
  function RealModeList( playButtonPressedProperty, gravityEnabledProperty, steppingProperty, rewindingProperty, timeSpeedScaleProperty ) {
    ModeList.ModeList.call( this,
      new ModeListParameterList( playButtonPressedProperty, gravityEnabledProperty, steppingProperty, rewindingProperty, timeSpeedScaleProperty ),
      new ModeList.SunEarthModeConfig(),
      new ModeList.SunEarthMoonModeConfig(),
      new ModeList.EarthMoonModeConfig(),
      new ModeList.EarthSpaceStationModeConfig()
    );
  }

  gravityAndOrbits.register( 'RealModeList', RealModeList );

  return inherit( ModeList.ModeList, RealModeList );
} );
