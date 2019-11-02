// Copyright 2015-2019, University of Colorado Boulder

/**
 * Constants for this simulation.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );

  // constants
  const CONTROL_PANEL_STROKE = '#8E9097';
  const PANEL_X_MARGIN = 5;

  const GravityAndOrbitsConstants = {

    // these constants were originally in SceneFactory, but needed to be factor out because of a circular dependency
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
    }
  };

  gravityAndOrbits.register( 'GravityAndOrbitsConstants', GravityAndOrbitsConstants );

  return GravityAndOrbitsConstants;
} );