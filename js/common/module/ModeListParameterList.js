// Copyright 2014-2015, University of Colorado Boulder

/**
 * Parameter object pattern, compositing multiple parameters that are passed to multiple modes.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Property.<boolean>} playButtonPressedProperty
   * @param {Property.<boolean>} gravityEnabledProperty
   * @param {Property.<boolean>} steppingProperty
   * @param {Property.<boolean>} rewindingProperty
   * @param {Property.<number>} timeSpeedScaleProperty
   * @constructor
   */
  function ModeListParameterList( playButtonPressedProperty, gravityEnabledProperty, steppingProperty, rewindingProperty, timeSpeedScaleProperty ) {

    // all fields are @public
    this.playButtonPressedProperty = playButtonPressedProperty;
    this.gravityEnabledProperty = gravityEnabledProperty;

    // True if the user is pressing the "step" button, to support storing states for the rewind feature
    this.steppingProperty = steppingProperty;

    // Flag to indicate if a "rewind" event is taking place, to support storing states for the rewind feature
    this.rewindingProperty = rewindingProperty;
    this.timeSpeedScaleProperty = timeSpeedScaleProperty;
  }

  return inherit( Object, ModeListParameterList );
} );
