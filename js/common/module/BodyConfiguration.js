// Copyright 2014-2015, University of Colorado Boulder

/**
 * Class that facilitates configuration of body instances for a GravityAndOrbitsMode; a data structure that describes
 * a body's parameters.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  /**
   * @param {number} mass
   * @param {number} radius
   * @param {number} x
   * @param {number} y
   * @param {number} vx
   * @param {number} vy
   * @param {Object} [options]
   * @constructor
   */
  function BodyConfiguration( mass, radius, x, y, vx, vy, options ) {

    options = _.extend( {
      rotationPeriod: null // period of rotation, in seconds - null corresponds to no rotation
    }, options );

    // @public
    this.fixed = false; // True if the object doesn't move when the clock ticks
    this.mass = mass;
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.rotationPeriod = options.rotationPeriod;
  }

  gravityAndOrbits.register( 'BodyConfiguration', BodyConfiguration );
  
  return inherit( Object, BodyConfiguration, {

    // @public
    getMomentum: function() {
      return new Vector2( this.vx * this.mass, this.vy * this.mass );
    }
  } );
} );
