// Copyright 2002-2015, University of Colorado Boulder

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
  var RightControlPanel = require( 'GRAVITY_AND_ORBITS/view/right-control-panel/RightControlPanel' );
  var TimeControlPanel = require( 'GRAVITY_AND_ORBITS/view/bottom-control-panel/TimeControlPanel' );

  /**
   * Constructor for GravityAndOrbitsScreenView. Unlike most PhET ScreenView files, this ScreenView takes a module object as
   * a parameter instead of a model. This seemed like the easiest way to port the Java version, which has one module for each
   * screen. This is the ScreenView for both screens in this sim.
   *
   * @param {GravityAndOrbitsModule} module
   * @constructor
   */
  function GravityAndOrbitsScreenView( module ) {

    ScreenView.call( this );
    this.module = module;

    // Add the canvases, one for each of the four modes
    var modes = module.getModes();
    for ( var i = 0; i < modes.length; i++ ) {
      var gaoCanvas = modes[ i ].getCanvas();
      gaoCanvas.visible = false;
      this.addChild( gaoCanvas );
    }

    // Make sure only one canvas is visible at a time
    module.modeProperty.link( function( mode ) {
      for ( var i = 0; i < modes.length; i++ ) {
        modes[ i ].getCanvas().visible = false;
      }
      mode.getCanvas().visible = true;
    } );

    var controlPanelNode = new RightControlPanel( module, { right: this.layoutBounds.maxX, top: this.layoutBounds.top + 5, width: 200 } );
    this.addChild( controlPanelNode );

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

  return inherit( ScreenView, GravityAndOrbitsScreenView, {

    step: function( dt ) {
      var paths = this.module.getMode().getCanvas().paths;
      for ( var i = 0; i < paths.length; i++ ) {
        paths[ i ].step();
      }
    }
  } );
} );