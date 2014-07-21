// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for Sun.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SpaceObjectAbstract = require( 'view/space-object/SpaceObjectAbstract' );

  /**
   * @param coords {Object} coordinates to placing components
   * @param radius {Number} radius of planet view
   */
  function Sun( coords, radius ) {
    SpaceObjectAbstract.call( this, {coords: coords} );

    this.view = this.getCircleGradient( radius, '#fff', '#ff0', true );
    this.addChild( this.view );
  }

  return inherit( SpaceObjectAbstract, Sun, {
    setRadius: function( r ) {
      this.view.setRadius( r );
    }
  } );
} );