// Copyright 2014-2019, University of Colorado Boulder

/**
 * Configuration for setting up a particular GravityAndOrbitsMode, enumerated in ModeList.
 * This is an abstract class, and is intended only to be used by sub-types.
 * @abstract
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsClock = require( 'GRAVITY_AND_ORBITS/common/model/GravityAndOrbitsClock' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Vector2 = require( 'DOT/Vector2' );
  
  // constants
  const DEFAULT_DT = GravityAndOrbitsClock.DEFAULT_DT;

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
      const deltaVelocity = this.getTotalMomentum().times( -1.0 / this.getTotalMass() );
      const bodies = this.getBodies();
      for ( let i = 0; i < bodies.length; i++ ) {
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
      let totalMomentum = new Vector2( 0, 0 );
      const bodies = this.getBodies();
      for ( let i = 0; i < bodies.length; i++ ) {
        totalMomentum = totalMomentum.plus( bodies[ i ].getMomentum() );
      }
      return totalMomentum;
    },

    /**
     * @private
     * @returns {number}
     */
    getTotalMass: function() {
      let totalMass = 0.0;
      const bodies = this.getBodies();
      for ( let i = 0; i < bodies.length; i++ ) {
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
