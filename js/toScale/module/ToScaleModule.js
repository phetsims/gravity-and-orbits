// Copyright 2016-2019, University of Colorado Boulder

/**
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsModel = require( 'GRAVITY_AND_ORBITS/common/module/GravityAndOrbitsModel' );
  const ToScaleSceneFactory = require( 'GRAVITY_AND_ORBITS/toScale/module/ToScaleSceneFactory' );

  // TODO: Rename ToScaleModel
  class ToScaleModule extends GravityAndOrbitsModel {

    /**
     * @param {Tandem} modelTandem
     * @param {Tandem} viewTandem
     */
    constructor( modelTandem, viewTandem ) {
      super(
        true,
        model => new ToScaleSceneFactory( model, modelTandem, viewTandem ),
        0,
        true,

        // TODO: Like in ModelModel, it is risky to share tandem with above
        modelTandem,
        viewTandem
      );
    }
  }

  return gravityAndOrbits.register( 'ToScaleModule', ToScaleModule );
} );