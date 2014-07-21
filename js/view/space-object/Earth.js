// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for Earth.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SpaceObjectAbstract = require( 'view/space-object/SpaceObjectAbstract' );

  // images
  var earthImg = require( 'image!GRAVITY_AND_ORBITS/earth.gif' );

  /**
   * @param coords {Object} coordinates to placing components
   * @param radius {Number} radius of planet view
   */
  function Earth( coords, radius ) {
    SpaceObjectAbstract.call( this, {image: earthImg, coords: coords} );

    this.setRadius( radius );

    this.viewGray = this.getCircleGradient( radius, '#fff', '#808080', false );
    this.addChild( this.viewGray );
    this.viewGray.setRadius( radius );
  }

  return inherit( SpaceObjectAbstract, Earth, {
    setGrayView: function() {
      this.viewGray.setVisible( true );
      this.view.setVisible( false );
    },
    setDefaultView: function() {
      this.viewGray.setVisible( false );
      this.view.setVisible( true );
    }
  } );
} );