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

  /**
   * @param {Property<boolean>} playButtonPressed
   * @param {Property<boolean>} gravityEnabled
   * @param {Property<boolean>} stepping
   * @param {Property<boolean>} rewinding
   * @param {Property<number>} timeSpeedScale
   * @constructor
   */
  function RealModeList( playButtonPressed, gravityEnabled, stepping, rewinding, timeSpeedScale ) {
    ModeList.ModeList.call( this,
      new ModeListParameterList( playButtonPressed, gravityEnabled, stepping, rewinding, timeSpeedScale ),
      new ModeList.SunEarthModeConfig(),
      new ModeList.SunEarthMoonModeConfig(),
      new ModeList.EarthMoonModeConfig(),
      new ModeList.EarthSpaceStationModeConfig() );
  }

  return inherit( ModeList.ModeList, RealModeList );
} );
