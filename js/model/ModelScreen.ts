// Copyright 2016-2023, University of Colorado Boulder

/**
 * The 'Model' screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import modelIcon_png from '../../mipmaps/modelIcon_png.js';

// Since the screen is named "model" this lint rule has a false positive
// eslint-disable-next-line no-view-imported-from-model
import GravityAndOrbitsScreenView from '../common/view/GravityAndOrbitsScreenView.js';
import gravityAndOrbits from '../gravityAndOrbits.js';
import GravityAndOrbitsStrings from '../GravityAndOrbitsStrings.js';
import ModelModel from './ModelModel.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';

class ModelScreen extends Screen<ModelModel, GravityAndOrbitsScreenView> {
  public constructor( providedOptions?: ScreenOptions ) {

    const options = optionize<ScreenOptions, EmptySelfOptions, ScreenOptions>()( {
      name: GravityAndOrbitsStrings.modelStringProperty,

      homeScreenIcon: new ScreenIcon( new Image( modelIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1,
        fill: 'black'
      } )
    }, providedOptions );

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