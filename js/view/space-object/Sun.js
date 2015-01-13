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
  var AbstractSpaceObject = require( 'view/space-object/AbstractSpaceObject' );

  /**
   * @param {Object} coords - Coordinates to placing components.
   * @param {Number} radius - Radius of planet view.
   * @constructor
   */
  function Sun( coords, radius ) {
    AbstractSpaceObject.call( this, { coords: coords } );

    this.view = this.getCircleGradient( radius, '#fff', '#ff0', true );
    this.addChild( this.view );
  }

  return inherit( AbstractSpaceObject, Sun, {
    setRadius: function( r ) {
      this.view.setRadius( r );
    }
  } );
} );