// Copyright 2016-2021, University of Colorado Boulder

/**
 * The 'To Scale' screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import Image from '../../../scenery/js/nodes/Image.js';
import toScaleMipmap from '../../mipmaps/to_scale_icon_png.js';
import GravityAndOrbitsScreenView from '../common/view/GravityAndOrbitsScreenView.js';
import gravityAndOrbits from '../gravityAndOrbits.js';
import gravityAndOrbitsStrings from '../gravityAndOrbitsStrings.js';
import ToScaleModel from './ToScaleModel.js';

const toScaleString = gravityAndOrbitsStrings.toScale;


class ToScaleScreen extends Screen {
  constructor( options ) {
    options = merge( {
      name: toScaleString,

      // @ts-ignore
      homeScreenIcon: new ScreenIcon( new Image( toScaleMipmap ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1,
        fill: 'black'
      } )
    }, options );

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