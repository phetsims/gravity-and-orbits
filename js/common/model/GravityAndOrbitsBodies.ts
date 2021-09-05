// Copyright 2016-2021, University of Colorado Boulder

/**
 * Defines the various types of bodies that can exist in gravity-and-orbits.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import gravityAndOrbits from '../../gravityAndOrbits.js';

// DRY string union values and union type: https://stackoverflow.com/questions/44480644/string-union-to-string-array
const GravityAndOrbitsBodies = [ 'planet', 'satellite', 'star', 'moon' ] as const;

gravityAndOrbits.register( 'GravityAndOrbitsBodies', GravityAndOrbitsBodies );

export default GravityAndOrbitsBodies;
export type GravityAndOrbitsBodiesType = ( typeof GravityAndOrbitsBodies )[number];