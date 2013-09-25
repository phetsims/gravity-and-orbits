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
  var Workspace = require( 'view/Workspace/Workspace' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScaleSlider = require( 'view/ScaleSlider/ScaleSlider' );
  var RightControlPanel = require( 'view/RightControlPanel/RightControlPanel' );
  var BottomControlPanel = require( 'view/BottomControlPanel/BottomControlPanel' );
  var ViewModePanel = require( 'view/ViewModePanel/ViewModePanel' );

  function GravityAndOrbitsView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );
    var options = {
      scaleSlider: {
        range: {max: 1.5, min: 0.5}
      }
    };

    // add workspace
    this.addChild( new Workspace( model ) );

    // add reset button
    var resetAllButton = new ResetAllButton( function() { model.reset(); }, { scale: 0.6, x: 638 } );
    this.addChild( resetAllButton );

    // add scale slider
    this.addChild( new ScaleSlider( model, 20, 10, options.scaleSlider ) );

    // add right control panel
    this.addChild( new RightControlPanel( model, 560, 10 ) );

    // add bottom control panel
    this.addChild( new BottomControlPanel( model, 100, 410 ) );

    // add view mode panel
    this.addChild( new ViewModePanel( model, 250, 10 ) );

    model.rightPanelHeightProperty.link( function( height ) {
      var resetButtonOffsetY = 18;
      resetAllButton.setY( height + resetButtonOffsetY );
    } );
  }

  inherit( ScreenView, GravityAndOrbitsView );
  return GravityAndOrbitsView;
} );
