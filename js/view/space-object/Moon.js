// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for Moon.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AbstractSpaceObject = require( 'view/space-object/AbstractSpaceObject' );

  // images
  var moonImg = require( 'image!GRAVITY_AND_ORBITS/moon.png' );

  /**
   * @param coords {Object} coordinates to placing components
   * @param radius {Number} radius of planet view
   */
  function Moon( coords, radius ) {
    AbstractSpaceObject.call( this, {image: moonImg, coords: coords} );

    this.setRadius( radius );
  }

  return inherit( AbstractSpaceObject, Moon );
} );