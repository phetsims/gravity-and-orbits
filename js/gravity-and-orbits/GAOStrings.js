// Copyright 2002-2015, University of Colorado

/**
 * A collection of localized strings used by simulations.
 * We load all strings statically so that we will be warned at startup time of any missing strings.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  // strings
  var CARTOON = require( 'string!GRAVITY_AND_ORBITS/cartoon' );
  var TO_SCALE = require( 'string!GRAVITY_AND_ORBITS/toScale' );
  var BILLION_BILLION_SPACE_STATION_MASSES = require( 'string!GRAVITY_AND_ORBITS/billionBillionSpaceStationMasses' );
  var EARTH = require( 'string!GRAVITY_AND_ORBITS/earth' );
  var EARTH_DAY = require( 'string!GRAVITY_AND_ORBITS/earthDay' );
  var EARTH_DAYS = require( 'string!GRAVITY_AND_ORBITS/earthDays' );
  var EARTH_MASS = require( 'string!GRAVITY_AND_ORBITS/earthMass' );
  var EARTH_MASSES = require( 'string!GRAVITY_AND_ORBITS/earthMasses' );
  var EARTH_MINUTE = require( 'string!GRAVITY_AND_ORBITS/earthMinute' );
  var EARTH_MINUTES = require( 'string!GRAVITY_AND_ORBITS/earthMinutes' );
  var GRAVITY = require( 'string!GRAVITY_AND_ORBITS/gravity' );
  var GRAVITY_FORCE = require( 'string!GRAVITY_AND_ORBITS/gravityForce' );
  var MASS = require( 'string!GRAVITY_AND_ORBITS/mass' );
  var MEASURING_TAPE = require( 'string!GRAVITY_AND_ORBITS/measuringTape' );
  var MOON = require( 'string!GRAVITY_AND_ORBITS/moon' );
  var OUR_MOON = require( 'string!GRAVITY_AND_ORBITS/ourMoon' );
  var OUR_SUN = require( 'string!GRAVITY_AND_ORBITS/ourSun' );
  var PATH = require( 'string!GRAVITY_AND_ORBITS/path' );
  var GRID = require( 'string!GRAVITY_AND_ORBITS/grid' );
  var PHYSICS = require( 'string!GRAVITY_AND_ORBITS/physics' );
  var PLANET = require( 'string!GRAVITY_AND_ORBITS/planet' );
  var SPACE_STATION = require( 'string!GRAVITY_AND_ORBITS/spaceStation' );
  var SPACE_STATION_MASS = require( 'string!GRAVITY_AND_ORBITS/spaceStationMass' );
  var SATELLITE = require( 'string!GRAVITY_AND_ORBITS/satellite' );
  var SHOW = require( 'string!GRAVITY_AND_ORBITS/show' );
  var RESET = require( 'string!GRAVITY_AND_ORBITS/reset' );
  var CLEAR = require( 'string!GRAVITY_AND_ORBITS/clear' );
  var STAR = require( 'string!GRAVITY_AND_ORBITS/star' );
  var THOUSAND_EARTH_MASSES = require( 'string!GRAVITY_AND_ORBITS/thousandEarthMasses' );
  var THOUSAND_MILES = require( 'string!GRAVITY_AND_ORBITS/thousandMiles' );
  var VELOCITY = require( 'string!GRAVITY_AND_ORBITS/velocity' );
  var ON = require( 'string!GRAVITY_AND_ORBITS/on' );
  var OFF = require( 'string!GRAVITY_AND_ORBITS/off' );
  var PATTERN_LABEL = require( 'string!GRAVITY_AND_ORBITS/pattern.0label' );
  var PATTERN_VALUE_UNITS = require( 'string!GRAVITY_AND_ORBITS/pattern.0value.1units' );
  var ZOOM_IN = require( 'string!GRAVITY_AND_ORBITS/zoomIn' );
  var ZOOM_OUT = require( 'string!GRAVITY_AND_ORBITS/zoomOut' );
  var RETURN_OBJECT = require( 'string!GRAVITY_AND_ORBITS/returnObject' );

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

