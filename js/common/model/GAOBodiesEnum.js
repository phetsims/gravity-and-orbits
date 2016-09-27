// Copyright 2016, University of Colorado Boulder

/**
 * An enumerable that defines the various types of bodies that can exist in gravity-and-orbits.
 * In this simulation, bodies are referenced by name, so this keeps track of the different bodies
 * without using translatable names.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  var EnumName = {
    PLANET: 'PLANET',
    SATELLITE: 'SATELLITE',
    STAR: 'STAR',
    MOON: 'MOON'
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( EnumName ); }

  gravityAndOrbits.register( 'EnumName', EnumName );

  return EnumName;
} );
