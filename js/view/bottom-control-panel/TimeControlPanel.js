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
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var StepButton = require( 'SCENERY_PHET/buttons/StepButton' );
  var RewindButton = require( 'SCENERY_PHET/buttons/RewindButton' );
  var GravityAndOrbitsClock = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/GravityAndOrbitsClock' );

  /**
   * @param {GravityAndOrbitsModule} module
   * @param {Object} [options]
   * @constructor
   */
  function TimeControlPanel( module, options ) {
    var playProperty = module.playButtonPressedProperty;

    var playPauseButton = new PlayPauseButton( playProperty );

    var stepButton = new StepButton( function() {
      module.getMode().getModel().getClock().step( 1 / GravityAndOrbitsClock.CLOCK_FRAME_RATE );
    }, playProperty );

    var rewindButton = new RewindButton( function() {
      module.getMode().rewind();
    }, playProperty );

//    rewindButton.enabled = false;
//    var getDay = function( model ) {
//      return (model.day - model.dayOffset);
//    };
//
//    model.dayProperty.link( function() { rewindButton.enabled = getDay( model ) > 0; } );
//    model.dayOffsetProperty.link( function() { rewindButton.enabled = getDay( model ) > 0; } );
    HBox.call( this, _.extend( { spacing: 10, children: [ rewindButton, playPauseButton, stepButton ] }, options ) );
  }

  return inherit( HBox, TimeControlPanel );
} );