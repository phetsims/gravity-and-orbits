// Copyright 2016-2017, University of Colorado Boulder

/**
 * //REVIEW Docs
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsModule = require( 'GRAVITY_AND_ORBITS/common/module/GravityAndOrbitsModule' );
  const RealModeList = require( 'GRAVITY_AND_ORBITS/toScale/module/RealModeList' );

  class ToScaleModule extends GravityAndOrbitsModule {
    constructor() {
      super( true, p => new RealModeList(
        p.playButtonPressedProperty,
        p.gravityEnabledProperty,
        p.steppingProperty,
        p.rewindingProperty,
        p.timeSpeedScaleProperty
      ), 0, true );
    }
  }

  return gravityAndOrbits.register( 'ToScaleModule', ToScaleModule );
} );