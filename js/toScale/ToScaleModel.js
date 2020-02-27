// Copyright 2016-2020, University of Colorado Boulder

/**
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import GravityAndOrbitsModel from '../common/model/GravityAndOrbitsModel.js';
import gravityAndOrbits from '../gravityAndOrbits.js';
import ToScaleSceneFactory from './ToScaleSceneFactory.js';

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

gravityAndOrbits.register( 'ToScaleModel', ToScaleModel );
export default ToScaleModel;