/**
 * Copyright 2002-2013, University of Colorado
 * Control Play/Pause and Step buttons view
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PushButton = require( 'SUN/PushButton' );

  var pauseImg = require( 'image!GRAVITY_AND_ORBITS/button_sim_pause.png' );
  var playImg = require( 'image!GRAVITY_AND_ORBITS/button_sim_play.png' );

  var buttonStepUnpressedImg = require( 'image!GRAVITY_AND_ORBITS/button_step_unpressed.png' );
  var buttonStepHoverImg = require( 'image!GRAVITY_AND_ORBITS/button_step_hover.png' );
  var buttonStepPressedImg = require( 'image!GRAVITY_AND_ORBITS/button_step_pressed.png' );
  var buttonStepDeactivatedImg = require( 'image!GRAVITY_AND_ORBITS/button_step_deactivated.png' );

  var buttonRewindImg = require( 'image!GRAVITY_AND_ORBITS/button_sim_rewind.svg' );
  var buttonRewindHoverImg = require( 'image!GRAVITY_AND_ORBITS/button_sim_rewind_hover.svg' );
  var buttonRewindPressedImg = require( 'image!GRAVITY_AND_ORBITS/button_sim_rewind_pressed.svg' );
  var buttonRewindDeactivatedImg = require( 'image!GRAVITY_AND_ORBITS/button_sim_rewind_deactivated.svg' );

  var Image = require( 'SCENERY/nodes/Image' );

  var ToggleButton = require( 'SUN/ToggleButton' );

  function PlayPauseButton( model, options ) {
    Node.call( this, {x: options.x, y: options.y, scale: 1} );
    var stepButton, rewindButton, step, rewind;

    // add play button
    this.addChild( new ToggleButton(
      new Image( pauseImg ),
      new Image( playImg ),
      model.playProperty,
      {scale: 0.7} ) );

    // add step button
    step = function() {
      model.stepManual();
    };
    this.addChild( stepButton = new PushButton(
      new Image( buttonStepUnpressedImg ),
      new Image( buttonStepHoverImg ),
      new Image( buttonStepPressedImg ),
      new Image( buttonStepDeactivatedImg ),
      step, {scale: 0.7, x: 50, y: 7} ) );
    stepButton.enabled = false;

    // add rewind button
    rewind = function() {model.clear();};
    this.addChild( rewindButton = new PushButton(
      new Image( buttonRewindImg ),
      new Image( buttonRewindHoverImg ),
      new Image( buttonRewindPressedImg ),
      new Image( buttonRewindDeactivatedImg ),
      rewind, {scale: 0.7, x: -35, y: 7} ) );
    rewindButton.enabled = false;

    model.playProperty.link( function updatePlayPauseButton( value ) {
      stepButton.enabled = !value;
    } );

    model.dayProperty.link( function updatePlayPauseButton( day ) {
      rewindButton.enabled = !!day;
    } );
  }

  inherit( Node, PlayPauseButton );

  return PlayPauseButton;
} );