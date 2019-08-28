// Copyright 2014-2019, University of Colorado Boulder

/**
 * Parameter object pattern, compositing multiple parameters that are passed to multiple modes.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  class ModeListParameterList {

    /**
     * @param {Property.<boolean>} playButtonPressedProperty
     * @param {Property.<boolean>} gravityEnabledProperty
     * @param {Property.<boolean>} steppingProperty
     * @param {Property.<boolean>} rewindingProperty
     * @param {Property.<number>} timeSpeedScaleProperty
     */
    constructor( playButtonPressedProperty, gravityEnabledProperty, steppingProperty, rewindingProperty, timeSpeedScaleProperty ) {

      // @public
      this.playButtonPressedProperty = playButtonPressedProperty;
      this.gravityEnabledProperty = gravityEnabledProperty;

      // @public True if the user is pressing the "step" button, to support storing states for the rewind feature
      this.steppingProperty = steppingProperty;

      // @public
      // Flag to indicate if a "rewind" event is taking place, to support storing states for the rewind feature
      this.rewindingProperty = rewindingProperty;
      this.timeSpeedScaleProperty = timeSpeedScaleProperty;
    }
  }

  return gravityAndOrbits.register( 'ModeListParameterList', ModeListParameterList );
} );