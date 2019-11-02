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
  const ModeListModel = require( 'GRAVITY_AND_ORBITS/common/module/ModeListModel' );
  const ModeListParameterList = require( 'GRAVITY_AND_ORBITS/common/module/ModeListParameterList' );

  class RealModeList extends ModeListModel {
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
        new ModeListModel.SunEarthModeConfig(),
        new ModeListModel.SunEarthMoonModeConfig(),
        new ModeListModel.EarthMoonModeConfig(),
        new ModeListModel.EarthSpaceStationModeConfig(),
        tandem
      );
    }
  }

  return gravityAndOrbits.register( 'RealModeList', RealModeList );
} );