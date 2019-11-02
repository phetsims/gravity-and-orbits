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

      // Add the scene selection controls, one for each of the four modes
      const scenes = module.getScenes();
      for ( let i = 0; i < scenes.length; i++ ) {
        const playAreaNode = scenes[ i ].playAreaNode;
        const massControlPanel = new MassControlPanel( scenes[ i ].getMassSettableBodies(), {
          top: controlPanelNode.bottom + MARGIN,
          right: this.layoutBounds.right - MARGIN,
          tandem: tandem.createTandem( 'massControlPanel' + i )// TODO don't index like this
        } );
        scenes[ i ].massControlPanel = massControlPanel;

        this.addChild( playAreaNode );
        this.addChild( massControlPanel );
      }

      // add the control panel on top of the canvases
      this.addChild( controlPanelNode );

      // Make sure only one scene is visible at a time
      module.sceneProperty.link( scene => {
        for ( let i = 0; i < module.sceneList.scenes.length; i++ ) {
          module.sceneList.scenes[ i ].playAreaNode.visible = false;
          module.sceneList.scenes[ i ].massControlPanel.visible = false;
        }
        scene.playAreaNode.visible = true;
        scene.massControlPanel.visible = true;
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