// Copyright 2016-2019, University of Colorado Boulder

/**
 * An enumerable that defines the various types of bodies that can exist in gravity-and-orbits.
 * In this simulation, bodies are referenced by name, so this keeps track of the different bodies
 * without using translatable names.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );

  const GravityAndOrbitsBodies = Enumeration.byKeys( [ 'PLANET',
    'SATELLITE',
    'STAR',
    'MOON'
  ] );

  return gravityAndOrbits.register( 'GravityAndOrbitsBodies', GravityAndOrbitsBodies );
} );