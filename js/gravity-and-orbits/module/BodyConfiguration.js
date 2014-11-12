// Copyright 2002-2014, University of Colorado

/**
 * Class that facilitates configuration of body instances for a GravityAndOrbitsMode; a data structure that describes a body's parameters.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param{number} mass
   * @param{number} radius
   * @param{number} x
   * @param{number} y
   * @param{number} vx
   * @param{number} vy
   * @constructor
   */
  function BodyConfiguration( mass, radius, x, y, vx, vy ) {
    //True if the object doesn't move when the clock ticks
    this.fixed = false;
    this.mass = mass;
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }

  return inherit( Object, BodyConfiguration, {
    getMomentum: function() {
      return new Vector2( this.vx * this.mass, this.vy * this.mass );
    }
  } );
} );
