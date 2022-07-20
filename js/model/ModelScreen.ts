// Copyright 2016-2022, University of Colorado Boulder

/**
 * The 'Model' screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import modelIcon_png from '../../mipmaps/modelIcon_png.js';
import GravityAndOrbitsScreenView from '../common/view/GravityAndOrbitsScreenView.js';
import gravityAndOrbits from '../gravityAndOrbits.js';
import gravityAndOrbitsStrings from '../gravityAndOrbitsStrings.js';
import ModelModel from './ModelModel.js';
import optionize from '../../../phet-core/js/optionize.js';
import { EmptySelfOptions } from '../../../phet-core/js/optionize.js';

const modelString = gravityAndOrbitsStrings.model;

class ModelScreen extends Screen<ModelModel, GravityAndOrbitsScreenView> {
  public constructor( providedOptions?: ScreenOptions ) {

    const options = optionize<ScreenOptions, EmptySelfOptions, ScreenOptions>()( {
      name: modelString,

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