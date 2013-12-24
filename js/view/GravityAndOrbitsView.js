// Copyright 2002-2013, University of Colorado Boulder

/**
 * main ScreenView container.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var ScreenView = require( 'JOIST/ScreenView' ),
    inherit = require( 'PHET_CORE/inherit' ),
    ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' ),
    Workspace = require( 'view/workspace/Workspace' ),
    ScaleSlider = require( 'view/scale-slider/ScaleSlider' ),
    RightControlPanel = require( 'view/right-control-panel/RightControlPanel' ),
    BottomControlPanel = require( 'view/bottom-control-panel/BottomControlPanel' ),
    VBox = require( 'SCENERY/nodes/VBox' );

  function GravityAndOrbitsView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );

    // add workspace
    this.addChild( new Workspace( model ) );

    // add scale slider
    this.addChild( new ScaleSlider( model, 20, 10 ) );

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
