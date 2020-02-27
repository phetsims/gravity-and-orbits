// Copyright 2014-2019, University of Colorado Boulder

/**
 * Configuration file for "real" tab modes, uses physically accurate parameters.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import SceneFactory from '../common/SceneFactory.js';
import gravityAndOrbits from '../gravityAndOrbits.js';

class ToScaleSceneFactory extends SceneFactory {

  /**
   * @param {GravityAndOrbitsModel} model
   * @param {Tandem} modelTandem
   * @param {Tandem} viewTandem
   */
  constructor( model, modelTandem, viewTandem ) {
    super(
      model,
      new SceneFactory.SunEarthModeConfig(),
      new SceneFactory.SunEarthMoonModeConfig(),
      new SceneFactory.EarthMoonModeConfig(),
      new SceneFactory.EarthSpaceStationModeConfig(),
      modelTandem,
      viewTandem
    );
  }
}

gravityAndOrbits.register( 'ToScaleSceneFactory', ToScaleSceneFactory );
export default ToScaleSceneFactory;