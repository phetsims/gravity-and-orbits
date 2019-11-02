// Copyright 2016-2019, University of Colorado Boulder

/**
 * // TODO Docs
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsModule = require( 'GRAVITY_AND_ORBITS/common/module/GravityAndOrbitsModule' );
  const RealModeList = require( 'GRAVITY_AND_ORBITS/toScale/module/RealModeList' );

  class ToScaleModule extends GravityAndOrbitsModule {

    /**
     * @param {Tandem} tandem
     * @param {Tandem} viewTandem
     */
    constructor( tandem, viewTandem ) {
      super( true, p => new RealModeList(
        p.isPlayingProperty,
        p.gravityEnabledProperty,
        p.steppingProperty,
        p.rewindingProperty,
        p.speedTypeProperty,
        tandem.createTandem( 'modeList' ) // TODO: Like in ModelModule, it is risky to share tandem
      ), 0, true, tandem, viewTandem );
    }
  }

  return gravityAndOrbits.register( 'ToScaleModule', ToScaleModule );
} );