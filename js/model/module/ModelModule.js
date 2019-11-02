// Copyright 2016-2019, University of Colorado Boulder

/**
 * // REVIEW documentation
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ModelModeList = require( 'GRAVITY_AND_ORBITS/model/module/ModelModeList' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsModule = require( 'GRAVITY_AND_ORBITS/common/module/GravityAndOrbitsModule' );

  class ModelModule extends GravityAndOrbitsModule {
    constructor( tandem, viewTandem ) {
      super( false, p => new ModelModeList(
        p.playButtonPressedProperty,
        p.gravityEnabledProperty,
        p.steppingProperty,
        p.rewindingProperty,
        p.speedTypeProperty,
        tandem.createTandem( 'modeList' ) // TODO(phet-io design): tandem sharing is risky, is it warranted here to avoid extra nodes?
      ), 0, false, tandem, viewTandem );// TODO: how to deal with viewTandem
    }
  }

  return gravityAndOrbits.register( 'ModelModule', ModelModule );
} );