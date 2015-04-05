// Copyright 2002-2015, University of Colorado Boulder

/**
 * Visual representation of speed control buttons.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Sam Reid
 * @author Aaron Davis
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var StepButton = require( 'SCENERY_PHET/buttons/StepButton' );
  var RewindButton = require( 'SCENERY_PHET/buttons/RewindButton' );

  /**
   * @param {GravityAndOrbitsModule} module
   * @param {Object} [options]
   * @constructor
   */
  function TimeControlPanel( module, options ) {
    var playProperty = module.playButtonPressedProperty;

    var playPauseButton = new PlayPauseButton( playProperty );

    var stepButton = new StepButton( function() {
      module.getMode().getModel().getClock().stepClockWhilePaused();
    }, playProperty );

    var rewindButton = new RewindButton( function() {
      module.getMode().rewind();
    }, playProperty );

    //TODO: rewind button should start disabled and enable after any property is changed
    //rewindButton.enabled = false;

    HBox.call( this, _.extend( { spacing: 10, children: [ rewindButton, playPauseButton, stepButton ] }, options ) );
  }

  return inherit( HBox, TimeControlPanel );
} );