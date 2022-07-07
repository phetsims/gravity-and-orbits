// Copyright 2016-2022, University of Colorado Boulder

/**
 * The 'Model' screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import { Image } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import modelIcon_png from '../../mipmaps/modelIcon_png.js';
import GravityAndOrbitsScreenView from '../common/view/GravityAndOrbitsScreenView.js';
import gravityAndOrbits from '../gravityAndOrbits.js';
import gravityAndOrbitsStrings from '../gravityAndOrbitsStrings.js';
import ModelModel from './ModelModel.js';
import { ProfileColorProperty } from '../../../scenery/js/imports.js';

const modelString = gravityAndOrbitsStrings.model;

type ModelScreenOptions = {
  tandem: Tandem;
  backgroundColorProperty: ProfileColorProperty;
};

class ModelScreen extends Screen<ModelModel, GravityAndOrbitsScreenView> {
  public constructor( providedOptions?: Partial<ModelScreenOptions> ) {

    const options = merge( {
      name: modelString,

      homeScreenIcon: new ScreenIcon( new Image( modelIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1,
        fill: 'black'
      } )
    }, providedOptions ) as ModelScreenOptions;

    const viewTandem = options.tandem.createTandem( 'view' );
    super(
      () => new ModelModel( options.tandem.createTandem( 'model' ), viewTandem ),
      model => new GravityAndOrbitsScreenView( model, viewTandem ),
      options
    );
  }
}

gravityAndOrbits.register( 'ModelScreen', ModelScreen );
export default ModelScreen;