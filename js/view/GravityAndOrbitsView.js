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
  //var ScaleSlider = require( "view/ScaleSlider/ScaleSlider" );

  function GravityAndOrbitsView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );

    // add workspace
    this.addChild( new Workspace( model ) );

    // add reset button
    var resetAllButton = new ResetAllButton( function() { model.reset(); }, { scale: 0.8, x: 650, y: 400 } );
    this.addChild( resetAllButton );

    // add scale slider
    /*var options = {
      range: {max: 1.5, min: 0.5}
    };
    this.addChild( new ScaleSlider( model, 25, 10, options ) );*/
  }

  inherit( ScreenView, GravityAndOrbitsView );
  return GravityAndOrbitsView;
} );
