// Copyright 2014-2015, University of Colorado Boulder

/**
 * GravityAndOrbitsScreenView. This file was not in the original Java code, but was created to have the sim follow the
 * PhET HTML5 sim conventions.
 *
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RightControlPanel = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/right-control-panel/RightControlPanel' );
  var SpeedRadioButtons = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/bottom-control-panel/SpeedRadioButtons' );
  var MassControlPanel = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/right-control-panel/MassControlPanel' );

  /**
   * Constructor for GravityAndOrbitsScreenView. Unlike most PhET ScreenView files, this ScreenView takes a module
   * object as a parameter instead of a model. This seemed like the easiest way to port the Java version, which has
   * one module for each screen. This is the ScreenView for both screens in this sim.
   *
   * @param {GravityAndOrbitsModule} module
   * @constructor
   */
  function GravityAndOrbitsScreenView( module ) {

    ScreenView.call( this );

    // Add the right control panel
    var controlPanelNode = new RightControlPanel( module, {
      top: this.layoutBounds.top + 5,
      right: this.layoutBounds.maxX
    } );

    // Add the canvases, one for each of the four modes
    var modes = module.getModes();
    for ( var i = 0; i < modes.length; i++ ) {
      var gaoCanvas = modes[ i ].canvas;
      var massControlPanel = new MassControlPanel( modes[ i ].getMassSettableBodies(), {
        top: controlPanelNode.bottom + 5,
        right: this.layoutBounds.maxX
      } );
      modes[ i ].massControlPanel = massControlPanel;

      this.addChild( gaoCanvas );
      this.addChild( massControlPanel );

      if ( modes[ i ] !== module.modeProperty.get() ) {
        gaoCanvas.visible = false;
        massControlPanel.visible = false;
      }
    }

    // add the control panel on top of the canvases
    this.addChild( controlPanelNode );

    // Make sure only one canvas is visible at a time
    module.modeProperty.link( function( mode ) {
      for ( var i = 0; i < module.modeList.modes.length; i++ ) {
        module.modeList.modes[ i ].canvas.visible = false;
        module.modeList.modes[ i ].massControlPanel.visible = false;
      }
      mode.canvas.visible = true;
      mode.massControlPanel.visible = true;
      module.updateActiveModule();
    } );

    // Add the speed control slider.
    this.addChild( new SpeedRadioButtons( module.timeSpeedScaleProperty,
      { bottom: this.layoutBounds.bottom - 5, left: this.layoutBounds.left + 5, scale: 1.2 } ) );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        module.reset();
      },
      right: this.layoutBounds.right,
      bottom: this.layoutBounds.bottom - 5
    } );
    this.addChild( resetAllButton );
  }

  return inherit( ScreenView, GravityAndOrbitsScreenView );
} );