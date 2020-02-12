// Copyright 2016-2020, University of Colorado Boulder

/**
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsModel = require( 'GRAVITY_AND_ORBITS/common/model/GravityAndOrbitsModel' );
  const ToScaleSceneFactory = require( 'GRAVITY_AND_ORBITS/toScale/ToScaleSceneFactory' );

  class ToScaleModel extends GravityAndOrbitsModel {

    /**
     * @param {Tandem} screenTandem
     * @param {Tandem} modelTandem
     * @param {Tandem} viewTandem - needed so we can create the scenes and corresponding views
     */
    constructor( screenTandem, modelTandem, viewTandem ) {
      super(
        true,
        model => new ToScaleSceneFactory( model, modelTandem, viewTandem ),
        0,
        true,
        screenTandem,
        modelTandem
      );
    }
  }

  return gravityAndOrbits.register( 'ToScaleModel', ToScaleModel );
} );