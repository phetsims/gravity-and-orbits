// Copyright 2015-2016, University of Colorado Boulder

/**
 * Constants for this simulation.
 *
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  // constants
  var CONTROL_PANEL_STROKE = '#8E9097';
  var PANEL_X_MARGIN = 5;
  var STARTING_SPEED_SCALE = ( 0.1 + 2 ) / 4;

  var GravityAndOrbitsConstants = {

    // these constants were originally in ModeList, but needed to be factor out because of a circular dependency
    EARTH_MASS: 5.9736E24,
    SPACE_STATION_MASS: 369914,

    CONTROL_PANEL_STROKE: CONTROL_PANEL_STROKE,
    PANEL_X_MARGIN: PANEL_X_MARGIN,
    CONTROL_PANEL_OPTIONS: {
      stroke: CONTROL_PANEL_STROKE,
      lineWidth: 2,
      cornerRadius: 5,
      resize: false,
      xMargin: PANEL_X_MARGIN,
      scale: 1.05,
      fill: GravityAndOrbitsColorProfile.panelBackgroundProperty
    },

    STARTING_SPEED_SCALE: STARTING_SPEED_SCALE,
    FAST_SPEED_SCALE: STARTING_SPEED_SCALE * 1.75,
    SLOW_SPEED_SCALE: STARTING_SPEED_SCALE * 0.25

  };

  gravityAndOrbits.register( 'GravityAndOrbitsConstants', GravityAndOrbitsConstants );

  return GravityAndOrbitsConstants;
} );
