// Copyright 2016-2020, University of Colorado Boulder

/**
 * Defines the various types of bodies that can exist in gravity-and-orbits.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';

const GravityAndOrbitsBodies = Enumeration.byKeys( [ 'PLANET', 'SATELLITE', 'STAR', 'MOON' ] );

gravityAndOrbits.register( 'GravityAndOrbitsBodies', GravityAndOrbitsBodies );

export default GravityAndOrbitsBodies;