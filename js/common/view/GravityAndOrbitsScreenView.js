// Copyright 2014-2019, University of Colorado Boulder

/**
 * GravityAndOrbitsScreenView. This file was not in the original Java code, but was created to have the sim follow the
 * PhET HTML5 sim conventions.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const GravityAndOrbitsControlPanel = require( 'GRAVITY_AND_ORBITS/common/view/GravityAndOrbitsControlPanel' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const MassControlPanel = require( 'GRAVITY_AND_ORBITS/common/view/MassControlPanel' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const SpeedRadioButtons = require( 'GRAVITY_AND_ORBITS/common/view/SpeedRadioButtons' );

  // constants
  const MARGIN = 5;

  class GravityAndOrbitsScreenView extends ScreenView {

    /**
     * Constructor for GravityAndOrbitsScreenView. Unlike most PhET ScreenView files, this ScreenView takes a module
     * object as a parameter instead of a model. This seemed like the easiest way to port the Java version, which has
     * one module for each screen. This is the ScreenView for both screens in this sim.
     *
     * @param {GravityAndOrbitsModule} module // TODO: Rename to model
     * @param {Tandem} tandem
     */
    constructor( module, tandem ) {

      super();

      // Control panel in the upper right of the play area
      const controlPanelNode = new GravityAndOrbitsControlPanel( module, {
        top: this.layoutBounds.top + MARGIN,
        right: this.layoutBounds.right - MARGIN,
        tandem: tandem.createTandem( 'controlPanelNode' ) // TODO: name?
      } );

      // Add the mode selection controls, one for each of the four modes
      const modes = module.getModes();
      for ( let i = 0; i < modes.length; i++ ) {
        const playAreaNode = modes[ i ].playAreaNode;
        const massControlPanel = new MassControlPanel( modes[ i ].getMassSettableBodies(), {
          top: controlPanelNode.bottom + MARGIN,
          right: this.layoutBounds.right - MARGIN,
          tandem: tandem.createTandem( 'massControlPanel' + i )// TODO don't index like this
        } );
        modes[ i ].massControlPanel = massControlPanel;

        this.addChild( playAreaNode );
        this.addChild( massControlPanel );

        // TODO: I think these can be deleted
        if ( modes[ i ] !== module.modeProperty.get() ) {
          playAreaNode.visible = false;
          massControlPanel.visible = false;
        }
      }

      // add the control panel on top of the canvases
      this.addChild( controlPanelNode );

      // Make sure only one canvas is visible at a time
      module.modeProperty.link( mode => {
        for ( let i = 0; i < module.modeList.modes.length; i++ ) {
          module.modeList.modes[ i ].playAreaNode.visible = false;
          module.modeList.modes[ i ].massControlPanel.visible = false;
        }
        mode.playAreaNode.visible = true;
        mode.massControlPanel.visible = true;
        module.updateActiveModule();
      } );

      // Add the speed control slider.
      this.addChild( new SpeedRadioButtons( module.speedTypeProperty, { // Rename module => model
          bottom: this.layoutBounds.bottom - MARGIN,
          left: this.layoutBounds.left + MARGIN,
        scale: 1.2,
        tandem: tandem.createTandem( 'speedRadioButtonGroup' )
        } )
      );

      // Create and add the Reset All Button in the bottom right, which resets the model
      const resetAllButton = new ResetAllButton( {
        listener: () => module.reset(),
        right: this.layoutBounds.right - MARGIN - 4,
        bottom: this.layoutBounds.bottom - MARGIN - 4, // slight difference centers below panels
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }
  }

  return gravityAndOrbits.register( 'GravityAndOrbitsScreenView', GravityAndOrbitsScreenView );
} );