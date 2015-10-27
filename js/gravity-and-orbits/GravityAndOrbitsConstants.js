// Copyright 2002-2015, University of Colorado Boulder

/**
 * Constants for this simulation.
 *
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsColorProfile' );

  var CONTROL_PANEL_STROKE = '#8E9097';
  var PANEL_X_MARGIN = 5;

  return {

    // these constants were originally in ModeList, but needed to be factor out because of a circular dependency
    EARTH_MASS: 5.9736E24,
    SPACE_STATION_MASS: 369914,

    CONTROL_PANEL_STROKE: CONTROL_PANEL_STROKE,
    PANEL_X_MARGIN: PANEL_X_MARGIN,
    CONTROL_PANEL_OPTIONS: {
      stroke: CONTROL_PANEL_STROKE,
      lineWidth: 2,
      cornerRadius: 2,
      resize: false,
      xMargin: PANEL_X_MARGIN,
      scale: 1.05,
      fill: GravityAndOrbitsColorProfile.panelBackgroundProperty
    },

    // event names
    POINT_ADDED: 'pointAdded',
    POINT_REMOVED: 'pointRemoved',
    CLEARED: 'cleared',
    USER_MODIFIED_POSITION: 'userModifiedPosition',
    USER_MODIFIED_VELOCITY: 'userModifiedVelocity'
  };
} );
