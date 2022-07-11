// Copyright 2014-2022, University of Colorado Boulder

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
import { Line } from '../../../../scenery/js/imports.js';

// constants
const DEFAULT_DT = GravityAndOrbitsClock.DEFAULT_DT;

abstract class ModeConfig {
  public dt: number;
  public readonly zoom: number;

  // Initial start and end point of the measuring tape
  public initialMeasuringTapePosition?: Line;
  public forceScale?: number;

  /**
   * @param zoom
   * @constructor
   */
  protected constructor( zoom: number ) {
    this.dt = DEFAULT_DT;
    this.zoom = zoom;
  }

  public center(): void {
    const deltaVelocity = this.getTotalMomentum().times( -1.0 / this.getTotalMass() );
    const bodies = this.getBodies();
    for ( let i = 0; i < bodies.length; i++ ) {
      bodies[ i ].vx += deltaVelocity.x;
      bodies[ i ].vy += deltaVelocity.y;
    }
  }

  /**
   * Compute the total momentum for purposes of centering the camera on the center of momentum frame
   */
  private getTotalMomentum(): Vector2 {
    let totalMomentum = new Vector2( 0, 0 );
    const bodies = this.getBodies();
    for ( let i = 0; i < bodies.length; i++ ) {
      totalMomentum = totalMomentum.plus( bodies[ i ].getMomentum() );
    }
    return totalMomentum;
  }

  private getTotalMass(): number {
    let totalMass = 0.0;
    const bodies = this.getBodies();
    for ( let i = 0; i < bodies.length; i++ ) {
      totalMass += bodies[ i ].mass;
    }
    return totalMass;
  }

  protected abstract getBodies(): BodyConfiguration[];
}

gravityAndOrbits.register( 'ModeConfig', ModeConfig );
export default ModeConfig;
