/**
 * Copyright 2002-2013, University of Colorado
 * view for earth
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  var earthImg = require( 'image!GRAVITY_AND_ORBITS/../images/earth.gif' );
  var Image = require( 'SCENERY/nodes/Image' );

  function Earth( coords, radius ) {
    var width = earthImg.width / 2, scale = radius / width;
    Node.call( this, coords );

    this.view = new Image( earthImg, {scale: scale, x: -width * scale, y: -width * scale} );
    this.addChild( this.view );
  }

  inherit( Node, Earth );

  return Earth;
} );