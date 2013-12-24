// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for space station.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' ),
    Node = require( 'SCENERY/nodes/Node' ),
    spaceStationImg = require( 'image!GRAVITY_AND_ORBITS/space-station.png' ),
    Image = require( 'SCENERY/nodes/Image' );

  function SpaceStation( coords, radius ) {
    Node.call( this, coords );

    this.setRadius( radius );
  }

  return inherit( Node, SpaceStation, {
    setRadius: function( radius ) {
      var width = spaceStationImg.width / 2, height = spaceStationImg.height / 2, scale = radius / width * 1.3;
      if ( this.view ) {this.removeChild( this.view );}

      this.view = new Image( spaceStationImg, {scale: scale, x: -width * scale, y: -height * scale} );
      this.addChild( this.view );
    }
  } );
} );