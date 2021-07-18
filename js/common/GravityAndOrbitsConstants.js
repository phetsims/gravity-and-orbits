// Copyright 2015-2021, University of Colorado Boulder

/**
 * Constants for this simulation.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Range from '../../../dot/js/Range.js';
import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import Color from '../../../scenery/js/util/Color.js';
import Tandem from '../../../tandem/js/Tandem.js';
import gravityAndOrbits from '../gravityAndOrbits.js';

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
    fill: new ProfileColorProperty( 'control panel fill', {
      default: 'black',
      projector: new Color( 222, 234, 255 )
    } )
  },
  PLAY_AREA_TANDEM_NAME: 'playAreaNode',
  ZOOM_RANGE: new Range( 0.5, 1.3 ),

  // Color mainly used for foreground things like text
  FOREGROUND_COLOR_PROPERTY: new ProfileColorProperty( 'foreground', { default: 'white', projector: 'black' }, {
    tandem: Tandem.GENERAL_VIEW.createTandem( 'foregroundColorProperty' )
  } ),

  // Color mainly used for background things like panels or text backgrounds
  BACKGROUND_COLOR_PROPERTY: new ProfileColorProperty( 'background', {
    default: 'black',
    projector: 'white'
  }, {
    tandem: Tandem.GENERAL_VIEW.createTandem( 'backgroundColorProperty' )
  } ),
  BODY_LABEL_COLOR_PROPERTY: new ProfileColorProperty( 'body label indicator', { default: new Color( 255, 255, 0 ), projector: 'black' }, {
    tandem: Tandem.GENERAL_VIEW.createTandem( 'labelColorProperty' )
  } ),

  measuringTapeTextBackgroundColorProperty: new ProfileColorProperty( 'measuring tape text background', {
    default: 'rgba( 0, 0, 0, 0.65 )',
    projector: 'rgba( 255, 255, 255, 0.65 )'
  }, {
    tandem: Tandem.GENERAL_VIEW.createTandem( 'measuringTapeTextBackgroundColorProperty' )
  } ),

  GRID_ICON_STROKE_PROPERTY: new ProfileColorProperty( 'grid icon stroke', { default: 'gray', projector: 'black' }, {
    tandem: Tandem.GENERAL_VIEW.createTandem( 'gridCheckboxStrokeProperty' )
  } )
};

gravityAndOrbits.register( 'GravityAndOrbitsConstants', GravityAndOrbitsConstants );

export default GravityAndOrbitsConstants;