// Copyright 2013-2018, University of Colorado Boulder

/**
 * Visual representation of speed control buttons.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  const RewindButton = require( 'SCENERY_PHET/buttons/RewindButton' );
  const StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );

  /**
   * @param {Property.<GravityAndOrbitsMode>} modeProperty
   * @param {Property.<boolean>} playButtonPressedProperty
   * @param {Array.<Body>} bodies
   * @param {Object} [options]
   * @constructor
   */
  function TimeControlPanel( modeProperty, playButtonPressedProperty, bodies, options ) {
    const playProperty = playButtonPressedProperty;

    const playPauseButton = new PlayPauseButton( playProperty );

    const stepButton = new StepForwardButton( {
      isPlayingProperty: playProperty,
      listener: function() { modeProperty.get().getClock().stepClockWhilePaused(); }
    } );

    const rewindButton = new RewindButton( {
      enabled: false,
      listener: function() {
        modeProperty.get().rewind();
      }
    } );

    const anyPropertyDifferentProperties = [];
    for ( let i = 0; i < bodies.length; i++ ) {
      anyPropertyDifferentProperties.push( bodies[ i ].anyPropertyDifferent() );
    }

    const anyPropertyChanged = new DerivedProperty( anyPropertyDifferentProperties, function() {
      return _.some( arguments, _.identity );
    } );

    // @private
    this.propertyChangedListener = function( changed ) {
      rewindButton.enabled = changed;
    };
    anyPropertyChanged.link( this.propertyChangedListener );

    HBox.call( this, _.extend( { resize: false, spacing: 10, children: [ rewindButton, playPauseButton, stepButton ] }, options ) );
  }

  gravityAndOrbits.register( 'TimeControlPanel', TimeControlPanel );

  return inherit( HBox, TimeControlPanel );
} );