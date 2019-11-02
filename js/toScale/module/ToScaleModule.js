// Copyright 2016-2019, University of Colorado Boulder

/**
 *
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
        tandem.createTandem( 'sceneList' ) // TODO: Like in ModelModel, it is risky to share tandem
      ), 0, true, tandem, viewTandem );
    }
  }

  return gravityAndOrbits.register( 'ToScaleModule', ToScaleModule );
} );