// Copyright 2002-2013, University of Colorado Boulder

/**
 * main ScreenView container.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var ScreenView = require( 'JOIST/ScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var Workspace = require( 'view/workspace/Workspace' );
  var ScaleSlider = require( 'view/scale-slider/ScaleSlider' );
  var RightControlPanel = require( 'view/right-control-panel/RightControlPanel' );
  var BottomControlPanel = require( 'view/bottom-control-panel/BottomControlPanel' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  function GravityAndOrbitsView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );

    // add workspace
    this.addChild( new Workspace( model ) );

    // add scale slider
    this.addChild( new ScaleSlider( model, 20, 10, {
      range: {max: 1.5, min: 0.5},
      step: 0.1
    } ) );

    this.addChild( new VBox( {spacing: 5, left: 560, top: 10, children: [
      // add right control panel
      new RightControlPanel( model ),

      // add reset button
      new ResetAllButton( function() { model.reset(); }, { scale: 0.6, x: 100 } )
    ]} ) );

    // add bottom control panel
    this.addChild( new BottomControlPanel( model, 100, 410 ) );
  }

  return inherit( ScreenView, GravityAndOrbitsView );
} );
