// Copyright 2016-2021, University of Colorado Boulder

/**
 * The 'Model' screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Tandem from '../../../tandem/js/Tandem.js';
import modelMipmap from '../../mipmaps/model_icon_png.js';
import GravityAndOrbitsScreenView from '../common/view/GravityAndOrbitsScreenView.js';
import gravityAndOrbits from '../gravityAndOrbits.js';
import gravityAndOrbitsStrings from '../gravityAndOrbitsStrings.js';
import ModelModel from './ModelModel.js';
import GravityAndOrbitsModel from '../common/model/GravityAndOrbitsModel.js';
import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';

const modelString = gravityAndOrbitsStrings.model;

type ModelScreenOptions = {
  tandem: Tandem,
  backgroundColorProperty: ProfileColorProperty
};

class ModelScreen extends Screen {
  constructor( providedOptions?: Partial<ModelScreenOptions> ) {

    const options = merge( {
      name: modelString,

      homeScreenIcon: new ScreenIcon( new Image( modelMipmap ) as unknown as Node, {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1,
        fill: 'black'
      } )
    }, providedOptions ) as ModelScreenOptions;

    const viewTandem = options.tandem.createTandem( 'view' );
    super(
      () => new ModelModel( options.tandem.createTandem( 'model' ), viewTandem ),
      ( model: GravityAndOrbitsModel ) => new GravityAndOrbitsScreenView( model, viewTandem ),
      options
    );
  }
}

gravityAndOrbits.register( 'ModelScreen', ModelScreen );
export default ModelScreen;