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
  var imageLoader = require( 'gravity-and-orbits-images' );
  var Image = require( 'SCENERY/nodes/Image' );
  var ToggleButton = require( 'SUN/ToggleButton' );

  function PlayPauseButton( model, options ) {
    Node.call( this, {x: options.x, y: options.y, scale: 1} );
    var stepButton, rewindButton, step, rewind;

    // add play button
    this.addChild( new ToggleButton(
      new Image( imageLoader.getImage( 'button_sim_pause.png' ) ),
      new Image( imageLoader.getImage( 'button_sim_play.png' ) ),
      model.playProperty,
      {scale: 0.7} ) );

    // add step button
    step = function() {
      model.stepManual();
    };
    this.addChild( stepButton = new PushButton(
      new Image( imageLoader.getImage( 'button_step_unpressed.png' ) ),
      new Image( imageLoader.getImage( 'button_step_hover.png' ) ),
      new Image( imageLoader.getImage( 'button_step_pressed.png' ) ),
      new Image( imageLoader.getImage( 'button_step_deactivated.png' ) ),
      step, {scale: 0.7, x: 50, y: 7} ) );
    stepButton.enabled = false;

    // add rewind button
    rewind = function() {model.day = 0;};
    this.addChild( rewindButton = new PushButton(
      new Image( imageLoader.getImage( 'button_sim_rewind.svg' ) ),
      new Image( imageLoader.getImage( 'button_sim_rewind_hover.svg' ) ),
      new Image( imageLoader.getImage( 'button_sim_rewind_pressed.svg' ) ),
      new Image( imageLoader.getImage( 'button_sim_rewind_deactivated.svg' ) ),
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