// Copyright 2016-2020, University of Colorado Boulder

/**
 * Defines the various types of bodies that can exist in gravity-and-orbits.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import gravityAndOrbits from '../../gravityAndOrbits.js';

// DRY string union values and union type: https://stackoverflow.com/questions/44480644/string-union-to-string-array
const values = [ 'planet', 'satellite', 'star', 'moon' ] as const;

const GravityAndOrbitsBodies = {
  VALUES: values,
}
gravityAndOrbits.register( 'GravityAndOrbitsBodies', GravityAndOrbitsBodies );

type Tuple = typeof values;

export default GravityAndOrbitsBodies;
export type BodyType = Tuple[number];