// Copyright 2014-2022, University of Colorado Boulder

/**
 * Configuration file for "real" tab modes, uses physically accurate parameters.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import SceneFactory from '../common/SceneFactory.js';
import gravityAndOrbits from '../gravityAndOrbits.js';
import GravityAndOrbitsModel from '../common/model/GravityAndOrbitsModel.js';
import Tandem from '../../../tandem/js/Tandem.js';

class ToScaleSceneFactory extends SceneFactory {

  public constructor( model: GravityAndOrbitsModel, modelTandem: Tandem, viewTandem: Tandem ) {
    super(
      model,
      new SceneFactory.SunEarthModeConfig(),
      new SceneFactory.SunEarthMoonModeConfig(),
      new SceneFactory.PlanetMoonModeConfig(),
      new SceneFactory.EarthSpaceStationModeConfig(),
      modelTandem,
      viewTandem
    );
  }
}

gravityAndOrbits.register( 'ToScaleSceneFactory', ToScaleSceneFactory );
export default ToScaleSceneFactory;