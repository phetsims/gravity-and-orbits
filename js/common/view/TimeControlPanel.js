// Copyright 2013-2015, University of Colorado Boulder

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
  var Property = require( 'AXON/Property' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var RewindButton = require( 'SCENERY_PHET/buttons/RewindButton' );

  /**
   * @param {Property.<GravityAndOrbitsMode>} modeProperty
   * @param {Property.<boolean>} playButtonPressedProperty
   * @param {Array.<Body>} bodies
   * @param {Object} [options]
   * @constructor
   */
  function TimeControlPanel( modeProperty, playButtonPressedProperty, bodies, options ) {
    var playProperty = playButtonPressedProperty;

    var playPauseButton = new PlayPauseButton( playProperty );

    var stepButton = new StepForwardButton( function() {
      modeProperty.get().getClock().stepClockWhilePaused();
    }, playProperty );

    var rewindButton = new RewindButton( {
      enabled: false,
      listener: function() {
        modeProperty.get().rewind();
      }
    } );

    var anyPropertyDifferentProperties = [];
    for ( var i = 0; i < bodies.length; i++ ) {
      anyPropertyDifferentProperties.push( bodies[ i ].anyPropertyDifferent() );
    }

    var anyPropertyChanged = new DerivedProperty( anyPropertyDifferentProperties, function() {
      return _.any( arguments, _.identity );
    } );

    anyPropertyChanged.link( function( changed ) {
      rewindButton.enabled = changed;
    } );

    HBox.call( this, _.extend( { spacing: 10, children: [ rewindButton, playPauseButton, stepButton ] }, options ) );
  }

  return inherit( HBox, TimeControlPanel );
} );