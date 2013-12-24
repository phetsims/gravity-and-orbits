// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of speed control buttons.
 * Rewind button return to the last day, when play button was pressed.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' ),
    Node = require( 'SCENERY/nodes/Node' ),
    PushButton = require( 'SUN/PushButton' ),
    pauseImg = require( 'image!GRAVITY_AND_ORBITS/button_sim_pause.png' ),
    playImg = require( 'image!GRAVITY_AND_ORBITS/button_sim_play.png' ),
    buttonStepUnpressedImg = require( 'image!GRAVITY_AND_ORBITS/button_step_unpressed.png' ),
    buttonStepHoverImg = require( 'image!GRAVITY_AND_ORBITS/button_step_hover.png' ),
    buttonStepPressedImg = require( 'image!GRAVITY_AND_ORBITS/button_step_pressed.png' ),
    buttonStepDeactivatedImg = require( 'image!GRAVITY_AND_ORBITS/button_step_deactivated.png' ),
    buttonRewindImg = require( 'image!GRAVITY_AND_ORBITS/button_sim_rewind.svg' ),
    buttonRewindHoverImg = require( 'image!GRAVITY_AND_ORBITS/button_sim_rewind_hover.svg' ),
    buttonRewindPressedImg = require( 'image!GRAVITY_AND_ORBITS/button_sim_rewind_pressed.svg' ),
    buttonRewindDeactivatedImg = require( 'image!GRAVITY_AND_ORBITS/button_sim_rewind_deactivated.svg' ),
    Image = require( 'SCENERY/nodes/Image' ),
    HBox = require( 'SCENERY/nodes/HBox' ),
    ToggleButton = require( 'SUN/ToggleButton' );

  function SpeedPushButtons( model ) {
    var stepButton, rewindButton, playButton, step, rewind;
    Node.call( this, {scale: 0.7} );

    // add play button
    playButton = new ToggleButton(
      new Image( pauseImg ),
      new Image( playImg ),
      model.playProperty );

    // add step button
    step = function() {
      model.stepManual();
    };
    stepButton = new PushButton(
      new Image( buttonStepUnpressedImg ),
      new Image( buttonStepHoverImg ),
      new Image( buttonStepPressedImg ),
      new Image( buttonStepDeactivatedImg ),
      {listener: step} );
    stepButton.enabled = false;

    // add rewind button
    rewind = function() {model.rewind = true;};
    rewindButton = new PushButton(
      new Image( buttonRewindImg ),
      new Image( buttonRewindHoverImg ),
      new Image( buttonRewindPressedImg ),
      new Image( buttonRewindDeactivatedImg ),
      {listener: rewind} );
    rewindButton.enabled = false;

    this.addChild( new HBox( {spacing: 0, children: [
      rewindButton, playButton, stepButton
    ]} ) );

    model.playProperty.link( function updatePlayPauseButton( value ) {
      stepButton.enabled = !value;
    } );

    model.dayProperty.link( function() {
      rewindButton.enabled = getDay( model );
    } );

    model.dayOffsetProperty.link( function() {
      rewindButton.enabled = getDay( model );
    } );
  }

  var getDay = function( model ) {
    return (model.day - model.dayOffset);
  };

  return inherit( Node, SpeedPushButtons );
} );