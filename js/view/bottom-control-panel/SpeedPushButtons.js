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

  // imports
  var inherit = require( 'PHET_CORE/inherit' ),
    HBox = require( 'SCENERY/nodes/HBox' ),
    PlayPauseButton = require( 'SCENERY_PHET/PlayPauseButton' ),
    StepButton = require( 'SCENERY_PHET/StepButton' ),
    RewindButton = require( 'SCENERY_PHET/RewindButton' );

  function SpeedPushButtons( model ) {
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

  return inherit( HBox, SpeedPushButtons );
} );