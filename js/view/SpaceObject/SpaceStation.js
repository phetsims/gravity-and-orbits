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
  var spaceStationImg = require( 'image!GRAVITY_AND_ORBITS/../images/space-station.png' );
  var Image = require( 'SCENERY/nodes/Image' );

  function SpaceStation( coords, radius ) {
    var width = spaceStationImg.width / 2, scale = radius / width;
    Node.call( this, coords );

    this.view = new Image( spaceStationImg, {scale: scale, x: -width * scale* 0.75, y: -width * scale * 0.75} );
    this.addChild( this.view );
  }

  inherit( Node, SpaceStation );

  return SpaceStation;
} );