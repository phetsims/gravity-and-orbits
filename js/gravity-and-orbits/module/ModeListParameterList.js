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
   *
   * @param {Property<boolean>} playButtonPressed
   * @param {Property<boolean>} gravityEnabled
   * @param {Property<boolean>} stepping
   * @param {Property<boolean>} rewinding
   * @param {Property<number>} timeSpeedScale
   * @constructor
   */
  function ModeListParameterList( playButtonPressed, gravityEnabled, stepping, rewinding, timeSpeedScale ) {
    this.playButtonPressed = playButtonPressed;
    this.gravityEnabled = gravityEnabled;

    // True if the user is pressing the "step" button, to support storing states for the rewind feature
    this.stepping = stepping;

    // Flag to indicate if a "rewind" event is taking place, to support storing states for the rewind feature
    this.rewinding = rewinding;
    this.timeSpeedScale = timeSpeedScale;
  }

  return inherit( Object, ModeListParameterList, {
  } );
} );
