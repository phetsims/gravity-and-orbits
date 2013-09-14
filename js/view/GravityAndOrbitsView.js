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
  var ResetAllButton = require( 'view/ResetAllButton' );
  var ScaleSlider = require( 'view/ScaleSlider/ScaleSlider' );
  var RightControlPanel = require( 'view/RightControlPanel/RightControlPanel' );

  function GravityAndOrbitsView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );
    var options = {
      scaleSlider: {
        range: {max: 1.5, min: 0.5}
      },
      rightControlPanel: {}
    };

    // add workspace
    this.addChild( new Workspace( model ) );

    // add reset button
    var resetAllButton = new ResetAllButton( function() { model.reset(); }, { scale: 0.8, x: 638, y: 400 } );
    this.addChild( resetAllButton );

    // add scale slider
    this.addChild( new ScaleSlider( model, 25, 10, options.scaleSlider ) );

    // add right control panel
    this.addChild( new RightControlPanel( model, 560, 10 ) );
  }

  inherit( ScreenView, GravityAndOrbitsView );
  return GravityAndOrbitsView;
} );
