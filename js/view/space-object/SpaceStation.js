// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for space station.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AbstractSpaceObject = require( 'view/space-object/AbstractSpaceObject' );

  // images
  var spaceStationImg = require( 'image!GRAVITY_AND_ORBITS/space-station.png' );

  /**
   * @param {Object} coords - Coordinates to placing components.
   * @param {Number} radius - Radius of planet view.
   * @constructor
   */
  function SpaceStation( coords, radius ) {
    AbstractSpaceObject.call( this, { image: spaceStationImg, coords: coords, scaleCoeff: 1.3 } );

    this.setRadius( radius );
  }

  return inherit( AbstractSpaceObject, SpaceStation );
} );