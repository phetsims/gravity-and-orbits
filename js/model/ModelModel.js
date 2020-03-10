// Copyright 2016-2020, University of Colorado Boulder

/**
 * Model for the "Model" screen.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import GravityAndOrbitsModel from '../common/model/GravityAndOrbitsModel.js';
import gravityAndOrbits from '../gravityAndOrbits.js';
import ModelSceneFactory from './ModelSceneFactory.js';

class ModelModel extends GravityAndOrbitsModel {

  /**
   * @param {Tandem} screenTandem
   * @param {Tandem} modelTandem
   * @param {Tandem} viewTandem - needed to create the scene views
   */
  constructor( screenTandem, modelTandem, viewTandem ) {
    super(
      false,
      model => new ModelSceneFactory( model, modelTandem, viewTandem ),
      0,
      false,
      screenTandem,
      modelTandem
    );
  }
}

gravityAndOrbits.register( 'ModelModel', ModelModel );
export default ModelModel;