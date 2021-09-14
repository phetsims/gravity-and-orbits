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
import GravityAndOrbitsModel from '../common/model/GravityAndOrbitsModel.js';
import Tandem from '../../../tandem/js/Tandem.js';
import gravityAndOrbitsStringsTS from '../gravityAndOrbitsStringsTS.js';
import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty';

const toScaleString = gravityAndOrbitsStringsTS.toScale;

type ScreenOptions = {
  tandem: Tandem,
  backgroundColorProperty: ProfileColorProperty
};

class ToScaleScreen extends Screen {
  constructor( options?: Partial<ScreenOptions> ) {
    const filledOptions = merge( {
      name: toScaleString,

      // @ts-ignore
      homeScreenIcon: new ScreenIcon( new Image( toScaleMipmap ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1,
        fill: 'black'
      } )
    }, options ) as ScreenOptions;

    const viewTandem = filledOptions.tandem.createTandem( 'view' );
    super(
      () => new ToScaleModel( filledOptions.tandem.createTandem( 'model' ), viewTandem ),
      ( model: GravityAndOrbitsModel ) => new GravityAndOrbitsScreenView( model, viewTandem ),
      filledOptions
    );
  }
}

gravityAndOrbits.register( 'ToScaleScreen', ToScaleScreen );
export default ToScaleScreen;