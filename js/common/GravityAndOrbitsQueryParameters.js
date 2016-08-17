// Copyright 2016, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  var getQueryParameter = phet.chipper.getQueryParameter;

  var GravityAndOrbitsQueryParameters = {

    // enable projector mode by default for development and so the sim can be linked directly
    // to projector mode
    PROJECTOR_MODE: !!getQueryParameter( 'projectorMode' )

  };

  gravityAndOrbits.register( 'GravityAndOrbitsQueryParameters', GravityAndOrbitsQueryParameters );

  return GravityAndOrbitsQueryParameters;
} );
