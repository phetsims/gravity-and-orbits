// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for explosion.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Node = require( 'SCENERY/nodes/Node' );

  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  function Explosion( coords, radius ) {
    Node.call( this, coords );

    var NUM = 7, coeff = 0.55, dalpha = 2 * Math.PI / NUM, alpha = 0, shape = new Shape();
    for ( var i = 0; i < NUM; i++ ) {
      shape = shape
        .moveTo( radius * Math.cos( alpha ), radius * Math.sin( alpha ) )
        .lineTo( radius * coeff * Math.cos( alpha + dalpha / 2 ), radius * coeff * Math.sin( alpha + dalpha / 2 ) )
        .lineTo( radius * Math.cos( alpha + dalpha ), radius * Math.sin( alpha + dalpha ) )
        .lineTo( 0, 0 );
      alpha += dalpha;
    }

    this.view = new Path( shape, { fill: new RadialGradient( radius * 0.1, -radius * 0.1, 1, radius * 0.1, -radius * 0.1, radius / 2 )
      .addColorStop( 0, '#fff' )
      .addColorStop( 1, '#ff0' )} );
    this.addChild( this.view );
  }

  return inherit( Node, Explosion );
} );