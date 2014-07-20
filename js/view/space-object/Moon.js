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
  var SpaceObjectAbstract = require( 'view/space-object/SpaceObjectAbstract' );

  // images
  var moonImg = require( 'image!GRAVITY_AND_ORBITS/moon.png' );

  function Moon( coords, radius ) {
    SpaceObjectAbstract.call( this, {image: moonImg, coords: coords} );

    this.setRadius( radius );
  }

  return inherit( SpaceObjectAbstract, Moon );
} );