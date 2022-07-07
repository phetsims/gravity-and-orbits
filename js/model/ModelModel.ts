// Copyright 2016-2022, University of Colorado Boulder

/**
 * Model for the "Model" screen.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Tandem from '../../../tandem/js/Tandem.js';
import GravityAndOrbitsModel from '../common/model/GravityAndOrbitsModel.js';
import gravityAndOrbits from '../gravityAndOrbits.js';
import ModelSceneFactory from './ModelSceneFactory.js';

class ModelModel extends GravityAndOrbitsModel {

  /**
   * @param modelTandem
   * @param viewTandem - needed to create the scene views
   */
  public constructor( modelTandem: Tandem, viewTandem: Tandem ) {
    super(
      false,
      model => new ModelSceneFactory( model, modelTandem, viewTandem ),
      0,
      false,
      modelTandem
    );
  }
}

gravityAndOrbits.register( 'ModelModel', ModelModel );
export default ModelModel;