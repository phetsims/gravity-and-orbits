// Copyright 2014-2020, University of Colorado Boulder

/**
 * Configuration for setting up a particular GravityAndOrbitsScene, enumerated in SceneFactory.
 * This is an abstract class, and is intended only to be used by sub-types.
 * @abstract
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsClock from './GravityAndOrbitsClock.js';

// constants
const DEFAULT_DT = GravityAndOrbitsClock.DEFAULT_DT;

class ModeConfig {

  /**
   * @param {number} zoom
   * @constructor
   */
  constructor( zoom ) {
    this.dt = DEFAULT_DT; // @public
    this.zoom = zoom; // @public

    // TODO: explain these better or delete them
    this.initialMeasuringTapeLocation = null; // @public
    this.forceScale = null; // @protected
  }

  // @public
  center() {
    const deltaVelocity = this.getTotalMomentum().times( -1.0 / this.getTotalMass() );
    const bodies = this.getBodies();
    for ( let i = 0; i < bodies.length; i++ ) {
      bodies[ i ].vx += deltaVelocity.x;
      bodies[ i ].vy += deltaVelocity.y;
    }
  }

  /**
   * @private
   * Compute the total momentum for purposes of centering the camera on the center of momentum frame
   * @returns {Vector2}
   */
  getTotalMomentum() {
    let totalMomentum = new Vector2( 0, 0 );
    const bodies = this.getBodies();
    for ( let i = 0; i < bodies.length; i++ ) {
      totalMomentum = totalMomentum.plus( bodies[ i ].getMomentum() );
    }
    return totalMomentum;
  }

  /**
   * @private
   * @returns {number}
   */
  getTotalMass() {
    let totalMass = 0.0;
    const bodies = this.getBodies();
    for ( let i = 0; i < bodies.length; i++ ) {
      totalMass += bodies[ i ].mass;
    }
    return totalMass;
  }

  /**
   * @returns {BodyConfiguration[]}
   * @public
   * @abstract
   */
  getBodies() {
    throw new Error( 'must be implemented by subtype' );
  }
}

gravityAndOrbits.register( 'ModeConfig', ModeConfig );
export default ModeConfig;