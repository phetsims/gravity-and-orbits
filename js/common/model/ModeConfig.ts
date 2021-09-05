// Copyright 2014-2021, University of Colorado Boulder

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
import BodyConfiguration from './BodyConfiguration.js';
import Line from '../../../../kite/js/segments/Line';

// constants
const DEFAULT_DT = GravityAndOrbitsClock.DEFAULT_DT;

abstract class ModeConfig {
  readonly dt: number;
  readonly zoom: number;
  readonly initialMeasuringTapePosition: Line | null;
  readonly forceScale: number | null;

  /**
   * @param {number} zoom
   * @constructor
   */
  protected constructor( zoom: number ) {
    this.dt = DEFAULT_DT; // @public
    this.zoom = zoom; // @public

    // @public - Initial start and end point of the measuring tape
    this.initialMeasuringTapePosition = null;

    // @protected
    this.forceScale = null;
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
  abstract getBodies(): BodyConfiguration[]
}

gravityAndOrbits.register( 'ModeConfig', ModeConfig );
export default ModeConfig;
