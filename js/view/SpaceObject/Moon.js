// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for moon
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var moonImg = require( 'image!GRAVITY_AND_ORBITS/moon.png' );
  var Image = require( 'SCENERY/nodes/Image' );

  function Moon( coords, radius ) {
    Node.call( this, coords );

    this.setRadius( radius );
  }

  inherit( Node, Moon );

  Moon.prototype.setRadius = function( radius ) {
    var width = moonImg.width / 2, scale = radius / width;
    if ( this.view ) {this.removeChild( this.view );}

    this.view = new Image( moonImg, {scale: scale, x: -width * scale, y: -width * scale} );
    this.addChild( this.view );
  };

  return Moon;
} );