// Copyright 2019, University of Colorado Boulder

/**
 * Enumeration that determines how fast the simulation plays.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  return gravityAndOrbits.register( 'SpeedType', new Enumeration( [
    'SLOW_MOTION',
    'NORMAL',
    'FAST_FORWARD'
  ] ) );
} );