// Copyright 2016-2019, University of Colorado Boulder

/**
 * // REVIEW documentation
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ModelSceneFactory = require( 'GRAVITY_AND_ORBITS/model/ModelSceneFactory' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsModel = require( 'GRAVITY_AND_ORBITS/common/model/GravityAndOrbitsModel' );

  class ModelModel extends GravityAndOrbitsModel {

    /**
     * @param {Tandem} modelTandem
     * @param {Tandem} viewTandem - needed to create the scene views
     */
    constructor( modelTandem, viewTandem ) {
      super(
        false,
        model => new ModelSceneFactory( model, modelTandem, viewTandem ),
        0,
        false,
        modelTandem
      );
    }
  }

  return gravityAndOrbits.register( 'ModelModel', ModelModel );
} );