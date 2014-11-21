// Copyright 2002-2014, University of Colorado

/**
 * A collection of localized strings used by simulations.
 * We load all strings statically so that we will be warned at startup time of any missing strings.
 */
define( function( require ) {
  'use strict';

  function getString( key ) {
    return 'string!GRAVITY_AND_ORBITS/' + key;
  }

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  var CARTOON = getString( 'cartoon' );
  var TO_SCALE = getString( 'toScale' );
  var BILLION_BILLION_SPACE_STATION_MASSES = getString( 'billionBillionSpaceStationMasses' );
  var EARTH = getString( 'earth' );
  var EARTH_DAY = getString( 'earthDay' );
  var EARTH_DAYS = getString( 'earthDays' );
  var EARTH_MASS = getString( 'earthMass' );
  var EARTH_MASSES = getString( 'earthMasses' );
  var EARTH_MINUTE = getString( 'earthMinute' );
  var EARTH_MINUTES = getString( 'earthMinutes' );
  var GRAVITY = getString( 'gravity' );
  var GRAVITY_FORCE = getString( 'gravityForce' );
  var MASS = getString( 'mass' );
  var MEASURING_TAPE = getString( 'measuringTape' );
  var MOON = getString( 'moon' );
  var OUR_MOON = getString( 'ourMoon' );
  var OUR_SUN = getString( 'ourSun' );
  var PATH = getString( 'path' );
  var GRID = getString( 'grid' );
  var PHYSICS = getString( 'physics' );
  var PLANET = getString( 'planet' );
  var SPACE_STATION = getString( 'spaceStation' );
  var SPACE_STATION_MASS = getString( 'spaceStationMass' );
  var SATELLITE = getString( 'satellite' );
  var SHOW = getString( 'show' );
  var RESET = getString( 'reset' );
  var CLEAR = getString( 'clear' );
  var STAR = getString( 'star' );
  var THOUSAND_EARTH_MASSES = getString( 'thousandEarthMasses' );
  var THOUSAND_MILES = getString( 'thousandMiles' );
  var VELOCITY = getString( 'velocity' );
  var ON = getString( 'on' );
  var OFF = getString( 'off' );
  var PATTERN_LABEL = getString( 'pattern.0label' );
  var PATTERN_VALUE_UNITS = getString( 'pattern.0value.1units' );
  var ZOOM_IN = getString( 'zoomIn' );
  var ZOOM_OUT = getString( 'zoomOut' );
  var RETURN_OBJECT = getString( 'returnObject' );
  /* not intended for instantiation */

  //private
  function GAOStrings() {
  }

  return inherit( Object, GAOStrings, {},
    //statics
    {
      CARTOON: CARTOON,
      TO_SCALE: TO_SCALE,
      BILLION_BILLION_SPACE_STATION_MASSES: BILLION_BILLION_SPACE_STATION_MASSES,
      EARTH: EARTH,
      EARTH_DAY: EARTH_DAY,
      EARTH_DAYS: EARTH_DAYS,
      EARTH_MASS: EARTH_MASS,
      EARTH_MASSES: EARTH_MASSES,
      EARTH_MINUTE: EARTH_MINUTE,
      EARTH_MINUTES: EARTH_MINUTES,
      GRAVITY: GRAVITY,
      GRAVITY_FORCE: GRAVITY_FORCE,
      MASS: MASS,
      MEASURING_TAPE: MEASURING_TAPE,
      MOON: MOON,
      OUR_MOON: OUR_MOON,
      OUR_SUN: OUR_SUN,
      PATH: PATH,
      GRID: GRID,
      PHYSICS: PHYSICS,
      PLANET: PLANET,
      SPACE_STATION: SPACE_STATION,
      SPACE_STATION_MASS: SPACE_STATION_MASS,
      SATELLITE: SATELLITE,
      SHOW: SHOW,
      RESET: RESET,
      CLEAR: CLEAR,
      STAR: STAR,
      THOUSAND_EARTH_MASSES: THOUSAND_EARTH_MASSES,
      THOUSAND_MILES: THOUSAND_MILES,
      VELOCITY: VELOCITY,
      ON: ON,
      OFF: OFF,
      PATTERN_LABEL: PATTERN_LABEL,
      PATTERN_VALUE_UNITS: PATTERN_VALUE_UNITS,
      ZOOM_IN: ZOOM_IN,
      ZOOM_OUT: ZOOM_OUT,
      RETURN_OBJECT: RETURN_OBJECT
    } );
} );

