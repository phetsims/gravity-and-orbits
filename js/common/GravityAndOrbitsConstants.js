// Copyright 2015-2021, University of Colorado Boulder

/**
 * Constants for this simulation.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Range from '../../../dot/js/Range.js';
import gravityAndOrbits from '../gravityAndOrbits.js';
import GravityAndOrbitsColors from './GravityAndOrbitsColors.js';

// constants
const CONTROL_PANEL_STROKE = '#8E9097';
const PANEL_X_MARGIN = 5;

const GravityAndOrbitsConstants = {

  // these constants were originally in SceneFactory, but needed to be factor out because of a circular dependency
  EARTH_MASS: 5.9724E24,
  SPACE_STATION_MASS: 419725,

  CONTROL_PANEL_STROKE: CONTROL_PANEL_STROKE,
  PANEL_X_MARGIN: PANEL_X_MARGIN,
  CONTROL_PANEL_OPTIONS: {
    stroke: CONTROL_PANEL_STROKE,
    lineWidth: 2,
    cornerRadius: 5,
    xMargin: PANEL_X_MARGIN,
    scale: 1.05,
    fill: GravityAndOrbitsColors.controlPanelFillProperty
  },
  PLAY_AREA_TANDEM_NAME: 'playAreaNode',
  ZOOM_RANGE: new Range( 0.5, 1.3 )
};

gravityAndOrbits.register( 'GravityAndOrbitsConstants', GravityAndOrbitsConstants );

export default GravityAndOrbitsConstants;