// Copyright 2014-2015, University of Colorado Boulder

/**
 * Configuration for setting up a particular GravityAndOrbitsMode, enumerated in ModeList
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  // contants
  var DEFAULT_DT = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/GravityAndOrbitsClock' ).DEFAULT_DT;

  /**
   *
   * @param {number} zoom
   * @constructor
   */
  function ModeConfig( zoom ) {
    this.dt = DEFAULT_DT;
    this.zoom = zoom;

    // private members from java that weren't initialized in the constructor
    this.forceScale = null;
    this.initialMeasuringTapeLocation = null;
  }

  return inherit( Object, ModeConfig, {

    center: function() {
      var deltaVelocity = this.getTotalMomentum().times( -1.0 / this.getTotalMass() );
      var bodies = this.getBodies();
      for ( var i = 0; i < bodies.length; i++ ) {
        bodies[i].vx += deltaVelocity.x;
        bodies[i].vy += deltaVelocity.y;
      }
    },

    /**
     * @private
     *
     * Compute the total momentum for purposes of centering the camera on the center of momentum frame
     * @returns {Vector2}
     */
    getTotalMomentum: function() {
      var totalMomentum = new Vector2();
      var bodies = this.getBodies();
      for ( var i = 0; i < bodies.length; i++ ) {
        totalMomentum = totalMomentum.plus( bodies[i].getMomentum() );
      }
      return totalMomentum;
    },

    /**
     * @private
     * @returns {number}
     */
    getTotalMass: function() {
      var totalMass = 0.0;
      var bodies = this.getBodies();
      for ( var i = 0; i < bodies.length; i++ ) {
        totalMass += bodies[i].mass;
      }
      return totalMass;
    },

    // abstract
    /**
     * @returns {Array<BodyConfiguration}
     */
    getBodies: function() {}
  } );
} );
