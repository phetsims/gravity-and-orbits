// Copyright 2014-2022, University of Colorado Boulder

/**
 * Class that facilitates configuration of body instances for a GravityAndOrbitsScene; a data structure that describes
 * a body's parameters.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';

type BodyConfigurationOptions = {
  rotationPeriod: null | number;
}

class BodyConfiguration {

  mass: number;
  radius: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isMovable: boolean;
  readonly rotationPeriod: null | number;

  constructor( mass: number, radius: number, x: number, y: number, vx: number, vy: number, providedOptions?: BodyConfigurationOptions ) {

    const options = merge( {
      rotationPeriod: null // period of rotation, in seconds - null corresponds to no rotation
    }, providedOptions ) as Required<BodyConfigurationOptions>;

    this.isMovable = true; // True if the object moves based on physics (even non-isMovable things can be dragged though)
    this.mass = mass;
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.rotationPeriod = options.rotationPeriod;
  }

  getMomentum(): Vector2 {
    return new Vector2( this.vx * this.mass, this.vy * this.mass );
  }
}

gravityAndOrbits.register( 'BodyConfiguration', BodyConfiguration );
export default BodyConfiguration;