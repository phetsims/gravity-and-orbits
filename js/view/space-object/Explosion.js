// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for explosion.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  // constants
  var STAR_ANGEL_NUM = 7;
  var SHARP_COEFF = 0.55;
  var D_ALPHA = 2 * Math.PI / STAR_ANGEL_NUM;

  /**
   * @param {Object} coords - Coordinates to placing components.
   * @param {Number} radius - Initial radius of explosion view.
   * @constructor
   */
  function Explosion( coords, radius ) {
    var alpha = 0, shape = new Shape();
    Path.call( this, shape, {fill: new RadialGradient( radius * 0.1, -radius * 0.1, 1, radius * 0.1, -radius * 0.1, radius / 2 )
      .addColorStop( 0, '#fff' )
      .addColorStop( 1, '#ff0' )} );

    for ( var i = 0; i < STAR_ANGEL_NUM; i++ ) {
      shape = shape
        .moveTo( radius * Math.cos( alpha ), radius * Math.sin( alpha ) )
        .lineTo( radius * SHARP_COEFF * Math.cos( alpha + D_ALPHA / 2 ), radius * SHARP_COEFF * Math.sin( alpha + D_ALPHA / 2 ) )
        .lineTo( radius * Math.cos( alpha + D_ALPHA ), radius * Math.sin( alpha + D_ALPHA ) )
        .lineTo( 0, 0 );
      alpha += D_ALPHA;
    }

    this.setTranslation( coords );
  }

  return inherit( Path, Explosion );
} );