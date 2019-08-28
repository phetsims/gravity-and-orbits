// Copyright 2014-2019, University of Colorado Boulder

/**
 * Class that facilitates configuration of body instances for a GravityAndOrbitsMode; a data structure that describes
 * a body's parameters.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Vector2 = require( 'DOT/Vector2' );

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