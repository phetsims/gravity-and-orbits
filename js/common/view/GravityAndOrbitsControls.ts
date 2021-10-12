// Copyright 2013-2021, University of Colorado Boulder

/**
 * Control panel containing the controls for orbital mode, gravity, and visibility of planetary path and vectors.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import HSeparator from '../../../../sun/js/HSeparator.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsConstants from '../GravityAndOrbitsConstants.js';
import CheckboxPanel from './CheckboxPanel.js';
import GravityControl from './GravityControl.js';
import SceneSelectionControls from './SceneSelectionControls.js';
import GravityAndOrbitsModel from '../model/GravityAndOrbitsModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// constants
const MENU_SECTION_OPTIONS = { x: 5 };
const SEPARATOR_OPTIONS = { lineWidth: 2, stroke: GravityAndOrbitsConstants.CONTROL_PANEL_STROKE };

type GravityAndOrbitsControlsOptions = {
  tandem: Tandem
};

class GravityAndOrbitsControls extends VBox {

  /**
   * @param {GravityAndOrbitsModel} model
   * @param {Object} [options]
   */
  constructor( model: GravityAndOrbitsModel, options?: Partial<GravityAndOrbitsControlsOptions> ) {

    // @ts-ignore
    const filledOptions: GravityAndOrbitsControlsOptions = merge( {} , GravityAndOrbitsConstants.CONTROL_PANEL_OPTIONS, options ) as GravityAndOrbitsControls;

    // top separator rectangle for the gravity control section
    const topSeparator = new HSeparator( 0, merge( { tandem: filledOptions.tandem.createTandem( 'separator1' ) }, SEPARATOR_OPTIONS ) );
    const bottomSeparator = new HSeparator( 0, merge( { tandem: filledOptions.tandem.createTandem( 'separator2' ) }, SEPARATOR_OPTIONS ) );

    // menu sections and separators
    const sections = [
      new SceneSelectionControls( model.sceneProperty, model.getScenes(), merge( { tandem: filledOptions.tandem.createTandem( 'sceneControl' ) }, MENU_SECTION_OPTIONS ) ),
      topSeparator,
      new GravityControl( model.gravityEnabledProperty, merge( { tandem: filledOptions.tandem.createTandem( 'gravityControl' ) }, MENU_SECTION_OPTIONS ) ),
      bottomSeparator,
      new CheckboxPanel( model, merge( { tandem: filledOptions.tandem.createTandem( 'checkboxPanel' ) }, MENU_SECTION_OPTIONS ) )
    ];

    assert && assert( sections.length === 5, 'There should be 5 sections in the GravityAndOrbitsControlPanel' );

    super( {
      children: sections,
      spacing: 4,
      y: 5,
      align: 'left'
    } );

    // resize the separators to allow them to go inside the panel margins
    const separatorWidth = this.width + 2 * GravityAndOrbitsConstants.PANEL_X_MARGIN;
    topSeparator.setLine( 0, 0, separatorWidth, 0 );
    bottomSeparator.setLine( 0, 0, separatorWidth, 0 );
  }
}

gravityAndOrbits.register( 'GravityAndOrbitsControls', GravityAndOrbitsControls );
export default GravityAndOrbitsControls;