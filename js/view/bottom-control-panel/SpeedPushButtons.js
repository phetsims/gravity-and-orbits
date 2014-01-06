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
    Image = require( 'SCENERY/nodes/Image' ),
    HBox = require( 'SCENERY/nodes/HBox' ),
    ToggleButton = require( 'SUN/ToggleButton' ),
    RoundShinyButton = require( 'SCENERY_PHET/RoundShinyButton' ),
    Shape = require( 'KITE/Shape' ),
    Path = require( 'SCENERY/nodes/Path' ),
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

    model.dayProperty.link( function() { rewindButton.enabled = getDay( model ); } );
    model.dayOffsetProperty.link( function() { rewindButton.enabled = getDay( model ); } );
    HBox.call( this, {spacing: 5, children: [ rewindButton, playPauseButton, stepButton ]} );
  }

  return inherit( HBox, SpeedPushButtons );
} );