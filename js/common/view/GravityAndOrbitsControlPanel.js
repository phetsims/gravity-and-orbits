// Copyright 2013-2020, University of Colorado Boulder

/**
 * Control panel containing the controls for orbital mode, gravity, and visibility of planetary path and vectors.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Panel from '../../../../sun/js/Panel.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsConstants from '../GravityAndOrbitsConstants.js';
import CheckboxPanel from './CheckboxPanel.js';
import GravityControl from './GravityControl.js';
import SceneSelectionControls from './SceneSelectionControls.js';

// constants
const MENU_SECTION_OPTIONS = { x: 5 };

class GravityAndOrbitsControlPanel extends Panel {

  /**
   * @param {GravityAndOrbitsModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    options = merge( {}, GravityAndOrbitsConstants.CONTROL_PANEL_OPTIONS, options );

    // top separator rectangle for the gravity control section
    const makeTopSeparatorRectangle = () => new Rectangle( 0, 0, 0, 3, { fill: GravityAndOrbitsConstants.CONTROL_PANEL_STROKE } );

    // make bottom separator rectangle for the gravity control
    // slightly taller - the vertical draw of the 'y' in gravity creates the illusion that
    // the top has more space
    const makeBottomSeparatorRectangle = () => new Rectangle( 0, 0, 0, 4, { fill: GravityAndOrbitsConstants.CONTROL_PANEL_STROKE } );

    // menu sections and separators
    const sections = [
      new SceneSelectionControls( model.sceneProperty, model.getScenes(), merge( { tandem: options.tandem.createTandem( 'sceneControl' ) }, MENU_SECTION_OPTIONS ) ),
      makeTopSeparatorRectangle(),
      new GravityControl( model.gravityEnabledProperty, merge( { tandem: options.tandem.createTandem( 'gravityControl' ) }, MENU_SECTION_OPTIONS ) ),
      makeBottomSeparatorRectangle(),
      new CheckboxPanel( model, merge( { tandem: options.tandem.createTandem( 'checkboxPanel' ) }, MENU_SECTION_OPTIONS ) )
    ];

    assert && assert( sections.length === 5, 'There should be 5 sections in the GravityAndOrbitsControlPanel' );

    const vBox = new VBox( { children: sections, spacing: 4, y: 5, align: 'left' } );
    super( vBox, options );

    // resize the separators to allow them to go inside the panel margins
    const separatorWidth = vBox.width + 2 * GravityAndOrbitsConstants.PANEL_X_MARGIN;
    for ( let i = 0; i < Math.floor( sections.length / 2 ); i++ ) {
      sections[ i * 2 + 1 ].setRect( -GravityAndOrbitsConstants.PANEL_X_MARGIN, 0, separatorWidth, 2 );
    }
  }
}

gravityAndOrbits.register( 'GravityAndOrbitsControlPanel', GravityAndOrbitsControlPanel );
export default GravityAndOrbitsControlPanel;