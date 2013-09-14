/**
 * Copyright 2002-2013, University of Colorado
 * view for space station
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var imageLoader = require( 'gravity-and-orbits-images' );
  var Image = require( 'SCENERY/nodes/Image' );

  function SpaceStation( coords, radius ) {
    var img = imageLoader.getImage( 'space-station.png' ), width = img.width / 2, scale = radius / width;
    Node.call( this, coords );

    this.view = new Image( img, {scale: scale, x: -width * scale* 0.75, y: -width * scale * 0.75} );
    this.addChild( this.view );
  }

  inherit( Node, SpaceStation );

  return SpaceStation;
} );