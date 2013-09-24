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
  var Image = require( 'SCENERY/nodes/Image' );
  var ToggleButton = require( 'SUN/ToggleButton' );
  var stepButtonUnpressedImage = require( 'image!GRAVITY_AND_ORBITS/../images/button_step_unpressed.png' );
  var stepButtonHoverImage = require( 'image!GRAVITY_AND_ORBITS/../images/button_step_hover.png' );
  var stepButtonPressedImage = require( 'image!GRAVITY_AND_ORBITS/../images/button_step_pressed.png' );
  var stepButtonDeactivatedImage = require( 'image!GRAVITY_AND_ORBITS/../images/button_step_deactivated.png' );

  var rewindButtonImage = require( 'image!GRAVITY_AND_ORBITS/../images/button_sim_rewind.png' );
  var rewindButtonHoverImage = require( 'image!GRAVITY_AND_ORBITS/../images/button_sim_rewind_hover.png' );
  var rewindButtonPressedImage = require( 'image!GRAVITY_AND_ORBITS/../images/button_sim_rewind_pressed.png' );
  var rewindButtonDeactivatedImage = require( 'image!GRAVITY_AND_ORBITS/../images/button_sim_rewind_deactivated.png' );

  var playButtonImage = require( 'image!GRAVITY_AND_ORBITS/../images/button_sim_play.png' );
  var pauseButtonImage = require( 'image!GRAVITY_AND_ORBITS/../images/button_sim_pause.png' );

  function PlayPauseButton( model, options ) {
    Node.call( this, {x: options.x, y: options.y, scale: 1} );
    var stepButton, rewindButton, step, rewind;

    // add play button
    this.addChild( new ToggleButton(
      new Image( pauseButtonImage ),
      new Image( playButtonImage ),
      model.playProperty,
      {scale: 0.7} ) );

    // add step button
    step = function() {
      model.stepManual();
    };
    this.addChild( stepButton = new PushButton(
      new Image( stepButtonUnpressedImage ),
      new Image( stepButtonHoverImage ),
      new Image( stepButtonPressedImage ),
      new Image( stepButtonDeactivatedImage ),
      step, {scale: 0.7, x: 50, y: 7} ) );
    stepButton.enabled = false;

    // add rewind button
    rewind = function() {model.day = 0;};
    this.addChild( rewindButton = new PushButton(
      new Image( rewindButtonImage ),
      new Image( rewindButtonHoverImage ),
      new Image( rewindButtonPressedImage ),
      new Image( rewindButtonDeactivatedImage ),
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