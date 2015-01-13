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
   * @param {Object} coords - Coordinates to placing components.
   * @param {Number} radius - Radius of planet view.
   * @constructor
   */
  function Moon( coords, radius ) {
    AbstractSpaceObject.call( this, { image: moonImg, coords: coords } );

    this.setRadius( radius );
  }

  return inherit( AbstractSpaceObject, Moon );
} );