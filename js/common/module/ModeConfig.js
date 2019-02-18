// Copyright 2014-2019, University of Colorado Boulder

/**
 * Configuration for setting up a particular GravityAndOrbitsMode, enumerated in ModeList.
 * This is an abstract class, and is intended only to be used by sub-types.
 * @abstract
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  var GravityAndOrbitsClock = require( 'GRAVITY_AND_ORBITS/common/model/GravityAndOrbitsClock' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  
  // constants
  var DEFAULT_DT = GravityAndOrbitsClock.DEFAULT_DT;

  /**
   * @param {number} zoom
   * @constructor
   */
  function ModeConfig( zoom ) {
    this.dt = DEFAULT_DT; // @public
    this.zoom = zoom; // @public
    this.initialMeasuringTapeLocation = null; // @public
    this.forceScale = null; // @protected
  }

  gravityAndOrbits.register( 'ModeConfig', ModeConfig );
  
  return inherit( Object, ModeConfig, {

    // @public
    center: function() {
      var deltaVelocity = this.getTotalMomentum().times( -1.0 / this.getTotalMass() );
      var bodies = this.getBodies();
      for ( var i = 0; i < bodies.length; i++ ) {
        bodies[ i ].vx += deltaVelocity.x;
        bodies[ i ].vy += deltaVelocity.y;
      }
    },

    /**
     * @private
     * Compute the total momentum for purposes of centering the camera on the center of momentum frame
     * @returns {Vector2}
     */
    getTotalMomentum: function() {
      var totalMomentum = new Vector2( 0, 0 );
      var bodies = this.getBodies();
      for ( var i = 0; i < bodies.length; i++ ) {
        totalMomentum = totalMomentum.plus( bodies[ i ].getMomentum() );
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
        totalMass += bodies[ i ].mass;
      }
      return totalMass;
    },

    /**
     * @returns {BodyConfiguration[]}
     * @public
     * @abstract
     */
    getBodies: function() {
      throw new Error( 'must be implemented by subtype' );
    }
  } );
} );
