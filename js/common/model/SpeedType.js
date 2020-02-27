// Copyright 2019, University of Colorado Boulder

/**
 * Enumeration that determines how fast the simulation plays.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';

export default gravityAndOrbits.register( 'SpeedType', Enumeration.byKeys( [
  'SLOW_MOTION',
  'NORMAL',
  'FAST_FORWARD'
] ) );