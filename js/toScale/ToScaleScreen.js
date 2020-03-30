// Copyright 2016-2020, University of Colorado Boulder

/**
 * The 'To Scale' screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import merge from '../../../phet-core/js/merge.js';
import Image from '../../../scenery/js/nodes/Image.js';
import toScaleMipmap from '../../mipmaps/to_scale_icon_png.js';
import GravityAndOrbitsScreenView from '../common/view/GravityAndOrbitsScreenView.js';
import gravityAndOrbitsStrings from '../gravity-and-orbits-strings.js';
import gravityAndOrbits from '../gravityAndOrbits.js';
import ToScaleModel from './ToScaleModel.js';

const toScaleString = gravityAndOrbitsStrings.toScale;


class ToScaleScreen extends Screen {
  constructor( options ) {
    options = merge( {
      name: toScaleString,
      homeScreenIcon: new Image( toScaleMipmap )
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