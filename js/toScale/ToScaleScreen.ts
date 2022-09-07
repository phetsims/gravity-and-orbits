// Copyright 2016-2022, University of Colorado Boulder

/**
 * The 'To Scale' screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import toScaleIcon_png from '../../mipmaps/toScaleIcon_png.js';
import GravityAndOrbitsScreenView from '../common/view/GravityAndOrbitsScreenView.js';
import gravityAndOrbits from '../gravityAndOrbits.js';
import GravityAndOrbitsStrings from '../GravityAndOrbitsStrings.js';
import ToScaleModel from './ToScaleModel.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';

class ToScaleScreen extends Screen<ToScaleModel, GravityAndOrbitsScreenView> {
  public constructor( providedOptions?: ScreenOptions ) {
    const options = optionize<ScreenOptions, EmptySelfOptions, ScreenOptions>()( {
      name: GravityAndOrbitsStrings.toScaleStringProperty,

      homeScreenIcon: new ScreenIcon( new Image( toScaleIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1,
        fill: 'black'
      } )
    }, providedOptions );

    const viewTandem = options.tandem.createTandem( 'view' );
    super(
      () => new ToScaleModel( options.tandem.createTandem( 'model' ), viewTandem ),
      model => new GravityAndOrbitsScreenView( model, viewTandem ),
      options
    );
  }
}

gravityAndOrbits.register( 'ToScaleScreen', ToScaleScreen );
export default ToScaleScreen;