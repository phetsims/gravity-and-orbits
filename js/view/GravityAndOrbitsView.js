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
    SpeedPushButtons = require( 'view/bottom-control-panel/SpeedPushButtons' ),
    SpeedRadioButtons = require( 'view/bottom-control-panel/SpeedRadioButtons' ),
    DayCounter = require( 'view/bottom-control-panel/DayCounter' );

  function GravityAndOrbitsView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );

    // add workspace
    this.addChild( new Workspace( model ) );

    // add scale slider
    this.addChild( new ScaleSlider( model, 20, 10 ) );

    var rightPanel = new RightControlPanel( model ).mutate( {right: this.layoutBounds.maxX, top: 5} );
    this.addChild( rightPanel );

    var bottomInset = 5;

    // add speed check box
    this.addChild( new SpeedRadioButtons( model ).mutate( {left: 10, bottom: this.layoutBounds.maxY - bottomInset} ) );

    // add speed push buttons
    this.addChild( new SpeedPushButtons( model ).mutate( {centerX: rightPanel.left / 2, bottom: this.layoutBounds.maxY - bottomInset} ) );

    //add day counter
    this.addChild( new DayCounter( model ).mutate( {right: rightPanel.left - 10, bottom: this.layoutBounds.maxY - bottomInset} ) );

    //The reset all button
    this.addChild( new ResetAllButton( function() { model.reset(); }, { scale: 0.73, right: this.layoutBounds.maxX - 5, bottom: this.layoutBounds.maxY - 5} ) );
  }

  return inherit( ScreenView, GravityAndOrbitsView );
} );
