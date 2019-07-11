// Copyright 2014-2019, University of Colorado Boulder

/**
 * GravityAndOrbitsScreenView. This file was not in the original Java code, but was created to have the sim follow the
 * PhET HTML5 sim conventions.
 *
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var ControlPanel = require( 'GRAVITY_AND_ORBITS/common/view/ControlPanel' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MassControlPanel = require( 'GRAVITY_AND_ORBITS/common/view/MassControlPanel' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SpeedRadioButtons = require( 'GRAVITY_AND_ORBITS/common/view/SpeedRadioButtons' );

  // constants
  var MARGIN = 5;

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

    // Control panel in the upper right of the play area
    var controlPanelNode = new ControlPanel( module, {
      top: this.layoutBounds.top + MARGIN,
      right: this.layoutBounds.right - MARGIN
    } );

    // Add the canvases, one for each of the four modes
    var modes = module.getModes();
    for ( var i = 0; i < modes.length; i++ ) {
      var gaoCanvas = modes[ i ].canvas;
      var massControlPanel = new MassControlPanel( modes[ i ].getMassSettableBodies(), {
        top: controlPanelNode.bottom + MARGIN,
        right: this.layoutBounds.right - MARGIN
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
    this.addChild( new SpeedRadioButtons( module.timeSpeedScaleProperty, {
        bottom: this.layoutBounds.bottom - MARGIN,
        left: this.layoutBounds.left + MARGIN,
        scale: 1.2
      } )
    );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        module.reset();
      },
      right: this.layoutBounds.right - MARGIN,
      bottom: this.layoutBounds.bottom - MARGIN - 4 // slight difference centers below panels
    } );
    this.addChild( resetAllButton );
  }

  gravityAndOrbits.register( 'GravityAndOrbitsScreenView', GravityAndOrbitsScreenView );
  
  return inherit( ScreenView, GravityAndOrbitsScreenView );
} );