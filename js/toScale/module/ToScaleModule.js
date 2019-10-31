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
     */
    constructor( tandem ) {
      super( true, p => new RealModeList(
        p.playButtonPressedProperty,
        p.gravityEnabledProperty,
        p.steppingProperty,
        p.rewindingProperty,
        p.speedTypeProperty
      ), 0, true, tandem );
    }
  }

  return gravityAndOrbits.register( 'ToScaleModule', ToScaleModule );
} );