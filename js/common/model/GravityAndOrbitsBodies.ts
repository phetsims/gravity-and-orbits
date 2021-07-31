// Copyright 2016-2020, University of Colorado Boulder

/**
 * Defines the various types of bodies that can exist in gravity-and-orbits.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import gravityAndOrbits from '../../gravityAndOrbits.js';

const GravityAndOrbitsBodies = {
  VALUES: [ 'planet', 'satellite', 'star', 'moon' ]
}
gravityAndOrbits.register( 'GravityAndOrbitsBodies', GravityAndOrbitsBodies );
export default GravityAndOrbitsBodies;