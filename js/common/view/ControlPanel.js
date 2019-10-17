// Copyright 2013-2019, University of Colorado Boulder

/**
 * Control panel containing the controls for orbital mode, gravity, and visibility of plantary path
 * and vectors.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const CheckboxPanel = require( 'GRAVITY_AND_ORBITS/common/view/CheckboxPanel' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );
  const GravityControl = require( 'GRAVITY_AND_ORBITS/common/view/GravityControl' );
  const merge = require( 'PHET_CORE/merge' );
  const ModeControl = require( 'GRAVITY_AND_ORBITS/common/view/ModeControl' );
  const Panel = require( 'SUN/Panel' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const MENU_SECTION_OPTIONS = { x: 5 };

  class ControlPanel extends Panel {

    /**
     * @param {GravityAndOrbitsModule} module
     * @param {Object} [options]
     */
    constructor( module, options ) {

      options = merge( _.clone( GravityAndOrbitsConstants.CONTROL_PANEL_OPTIONS ), options );

      // top separator rectangle for the gravity control section
      const makeTopSeparatorRectangle = () => new Rectangle( 0, 0, 0, 3, { fill: GravityAndOrbitsConstants.CONTROL_PANEL_STROKE } );

      // make bottom separator rectangle for the gravity control
      // slightly taller - the vertical draw of the 'y' in gravity creates the illusion that
      // the top has more space
      const makeBottomSeparatorRectangle = () => new Rectangle( 0, 0, 0, 4, { fill: GravityAndOrbitsConstants.CONTROL_PANEL_STROKE } );

      // menu sections and separators
      const sections = [
        new ModeControl( module.modeProperty, module.getModes(), MENU_SECTION_OPTIONS ),
        makeTopSeparatorRectangle(),
        new GravityControl( module.gravityEnabledProperty, MENU_SECTION_OPTIONS ),
        makeBottomSeparatorRectangle(),
        new CheckboxPanel( module, MENU_SECTION_OPTIONS )
      ];

      assert && assert( sections.length === 5, 'There should be 5 sections in the ControlPanel' );

      const vBox = new VBox( { children: sections, spacing: 4, y: 5, resize: false, align: 'left' } );
      super( vBox, options );

      // resize the separators to allow them to go inside the panel margins
      const separatorWidth = vBox.width + 2 * GravityAndOrbitsConstants.PANEL_X_MARGIN;
      for ( let i = 0; i < Math.floor( sections.length / 2 ); i++ ) {
        sections[ i * 2 + 1 ].setRect( -GravityAndOrbitsConstants.PANEL_X_MARGIN, 0, separatorWidth, 2 );
      }
    }
  }

  return gravityAndOrbits.register( 'ControlPanel', ControlPanel );
} );