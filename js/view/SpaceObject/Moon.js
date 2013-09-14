/**
 * Copyright 2002-2013, University of Colorado
 * view for moon
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var imageLoader = require( 'gravity-and-orbits-images' );
  var Image = require( 'SCENERY/nodes/Image' );

  function Moon( coords, radius ) {
    var img = imageLoader.getImage( 'moon.png' ), width = img.width / 2, scale = radius / width;
    Node.call( this, coords );

    this.view = new Image( img, {scale: scale, x: -width * scale, y: -width * scale} );
    this.addChild( this.view );
  }

  inherit( Node, Moon );

  return Moon;
} );