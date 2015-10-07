// Copyright 2002-2015, University of Colorado Boulder

/**
 * Constants for this simulation.
 *
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  return {

    // these constants were originally in ModeList, but needed to be factor out because of a circular dependency
    EARTH_MASS: 5.9736E24,
    SPACE_STATION_MASS: 369914,

    // event names
    POINT_ADDED: 'pointAdded',
    POINT_REMOVED: 'pointRemoved',
    CLEARED: 'cleared',
    USER_MODIFIED_POSITION: 'userModifiedPosition',
    USER_MODIFIED_VELOCITY: 'userModifiedVelocity'
  };
} );
