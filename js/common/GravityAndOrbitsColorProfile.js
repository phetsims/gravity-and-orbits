// Copyright 2015-2020, University of Colorado Boulder

/**
 * Location for most colors of the simulation (especially those that could be tweaked)
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import ColorProfile from '../../../scenery-phet/js/ColorProfile.js';
import Color from '../../../scenery/js/util/Color.js';
import gravityAndOrbits from '../gravityAndOrbits.js';

const GravityAndOrbitsColorProfile = new ColorProfile( [ 'default', 'projector' ], {
  background: {
    default: 'black',
    projector: 'white'
  },
  bodyNodeText: {
    default: 'white',
    projector: 'black'
  },
  measuringTapeText: {
    default: 'white',
    projector: 'black'
  },
  bottomControlText: {
    default: 'white',
    projector: 'black'
  },
  panelBackground: {
    default: 'black',
    projector: new Color( 222, 234, 255 )
  },
  panelText: {
    default: 'white',
    projector: 'black'
  },
  arrowIndicator: {
    default: new Color( 255, 255, 0 ),
    projector: 'black'
  },
  gridIcon: {
    default: 'gray',
    projector: 'black'
  },
  checkboxFill: {
    default: 'black',
    projector: 'white'
  }
} );

gravityAndOrbits.register( 'GravityAndOrbitsColorProfile', GravityAndOrbitsColorProfile );

export default GravityAndOrbitsColorProfile;