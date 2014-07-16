// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of speed control buttons.
 * Rewind button return to the last day, when play button was pressed.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Sam Reid
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var PlayPauseButton = require( 'SCENERY_PHET/PlayPauseButton' );
  var StepButton = require( 'SCENERY_PHET/StepButton' );
  var RewindButton = require( 'SCENERY_PHET/RewindButton' );

  function TimeControlPanel( model ) {
    var playPauseButton = new PlayPauseButton( model.playProperty, {} );

    var stepButton = new StepButton( model.stepManual.bind( model ), model.playProperty );

    var rewind = function() {model.rewind = true;};
    var rewindButton = new RewindButton( rewind, model.playProperty );

    rewindButton.enabled = false;
    var getDay = function( model ) {
      return (model.day - model.dayOffset);
    };

    model.dayProperty.link( function() { rewindButton.enabled = getDay( model ) > 0; } );
    model.dayOffsetProperty.link( function() { rewindButton.enabled = getDay( model ) > 0; } );
    HBox.call( this, {spacing: 10, children: [ rewindButton, playPauseButton, stepButton ]} );
  }

  return inherit( HBox, TimeControlPanel );
} );