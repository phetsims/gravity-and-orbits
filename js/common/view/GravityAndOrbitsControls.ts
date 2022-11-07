// Copyright 2013-2022, University of Colorado Boulder

/**
 * Control panel containing the controls for orbital mode, gravity, and visibility of planetary path and vectors.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { HSeparator, VBox } from '../../../../scenery/js/imports.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsConstants from '../GravityAndOrbitsConstants.js';
import CheckboxPanel from './CheckboxPanel.js';
import GravityControl from './GravityControl.js';
import SceneSelectionControls from './SceneSelectionControls.js';
import GravityAndOrbitsModel from '../model/GravityAndOrbitsModel.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

// constants
const MENU_SECTION_OPTIONS = { x: 5 };

type GravityAndOrbitsControlsOptions = PickRequired<PhetioObjectOptions, 'tandem'>;

class GravityAndOrbitsControls extends VBox {

  public constructor( model: GravityAndOrbitsModel, providedOptions?: Partial<GravityAndOrbitsControlsOptions> ) {

    const options: GravityAndOrbitsControlsOptions = merge( {}, GravityAndOrbitsConstants.CONTROL_PANEL_OPTIONS, providedOptions ) as unknown as GravityAndOrbitsControls;

    // top separator rectangle for the gravity control section
    const topSeparator = new HSeparator();
    const bottomSeparator = new HSeparator();

    // menu sections and separators
    const sections = [
      new SceneSelectionControls( model.sceneProperty, model.getScenes(), merge( { tandem: options.tandem.createTandem( 'sceneControl' ) }, MENU_SECTION_OPTIONS ) ),
      topSeparator,
      new GravityControl( model.gravityEnabledProperty, merge( { tandem: options.tandem.createTandem( 'gravityControl' ) }, MENU_SECTION_OPTIONS ) ),
      bottomSeparator,
      new CheckboxPanel( model, merge( { tandem: options.tandem.createTandem( 'checkboxPanel' ) }, MENU_SECTION_OPTIONS ) )
    ];

    assert && assert( sections.length === 5, 'There should be 5 sections in the GravityAndOrbitsControlPanel' );

    super( {
      children: sections,
      spacing: 4,
      y: 5,
      align: 'left'
    } );
  }
}

gravityAndOrbits.register( 'GravityAndOrbitsControls', GravityAndOrbitsControls );
export default GravityAndOrbitsControls;