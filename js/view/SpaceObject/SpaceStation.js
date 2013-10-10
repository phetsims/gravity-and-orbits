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
  var spaceStationImg = require( 'image!GRAVITY_AND_ORBITS/space-station.png' );
  var Image = require( 'SCENERY/nodes/Image' );

  function SpaceStation( coords, radius ) {
    Node.call( this, coords );

    this.setRadius( radius );
  }

  inherit( Node, SpaceStation );

  SpaceStation.prototype.setRadius = function( radius ) {
    var width = spaceStationImg.width / 2, scale = radius / width;
    if ( this.view ) {this.removeChild( this.view );}

    this.view = new Image( spaceStationImg, {scale: scale, x: -width * scale, y: -width * scale} );
    this.addChild( this.view );
  };

  return SpaceStation;
} );