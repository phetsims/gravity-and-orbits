// Copyright 2016-2020, University of Colorado Boulder

/**
 * An enumerable that defines the various types of bodies that can exist in gravity-and-orbits.
 * In this simulation, bodies are referenced by name, so this keeps track of the different bodies
 * without using translatable names.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';

const GravityAndOrbitsBodies = Enumeration.byKeys( [ 'PLANET',
  'SATELLITE',
  'STAR',
  'MOON'
] );

gravityAndOrbits.register( 'GravityAndOrbitsBodies', GravityAndOrbitsBodies );
export default GravityAndOrbitsBodies;