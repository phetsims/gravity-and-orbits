// Copyright 2014-2026, University of Colorado Boulder

/**
 * Configuration file for "real" tab modes, uses physically accurate parameters.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Tandem from '../../../tandem/js/Tandem.js';
import GravityAndOrbitsModel from '../common/model/GravityAndOrbitsModel.js';
import SceneFactory from '../common/SceneFactory.js';

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

export default ToScaleSceneFactory;
