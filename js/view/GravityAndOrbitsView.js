// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main ScreenView container.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Workspace = require( 'view/workspace/Workspace' );
  var ScaleSlider = require( 'view/scale-slider/ScaleSlider' );
  var RightControlPanel = require( 'view/right-control-panel/RightControlPanel' );
  var TimeControlPanel = require( 'view/bottom-control-panel/TimeControlPanel' );
  var SpeedRadioButtons = require( 'view/bottom-control-panel/SpeedRadioButtons' );
  var DayCounter = require( 'view/bottom-control-panel/DayCounter' );

  /**
   * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
   * @constructor
   */
  function GravityAndOrbitsView( model ) {
    ScreenView.call( this, { renderer: 'svg', layoutBounds: new Bounds2( 0, 0, model.width, model.height ) } );

    // add workspace
    this.addChild( new Workspace( model, this.layoutBounds ) );

    // add scale slider
    this.addChild( new ScaleSlider( model.property( 'scale' ), 20, 10 ) );

    var rightPanel = new RightControlPanel( model ).mutate( { right: this.layoutBounds.maxX - 5, top: 5 } );
    this.addChild( rightPanel );

    var bottomInset = 5;

    // add speed check box
    this.addChild( new SpeedRadioButtons( model.property( 'speed' ) ).mutate(
      {
        left: 10,
        bottom: this.layoutBounds.maxY - bottomInset
      } ) );

    // add speed push buttons
    var timeControlPanel = new TimeControlPanel( model ).mutate(
      {
        centerX: rightPanel.left / 2,
        bottom: this.layoutBounds.maxY - bottomInset
      } );
    this.addChild( timeControlPanel );

    // add day counter
    var dayCounter = new DayCounter( model.property( 'day' ), model.property( 'dayOffset' ), model.property( 'timeMode' ), model.timeModes ).mutate(
      {
        right: rightPanel.left - 30,
        top: timeControlPanel.top - 2
      } );
    this.addChild( dayCounter );

    // add reset all button
    this.addChild( new ResetAllButton(
      {
        listener: function() { model.reset(); },
        right: this.layoutBounds.maxX - 5,
        bottom: this.layoutBounds.maxY - 5
      } ) );
  }

  return inherit( ScreenView, GravityAndOrbitsView );
} );
