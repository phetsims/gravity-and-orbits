// Copyright 2020-2021, University of Colorado Boulder

/**
 * A combination of two Body instances to show pairwise quantities for PhET-iO.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Body from './Body.js';
import Vector2 from '../../../../dot/js/Vector2.js';

class Pair {
  private body1: Body;
  private body2: Body;
  private distanceProperty: DerivedProperty<number>;

  /**
   * @param {Body} body1
   * @param {Body} body2
   * @param {Tandem} tandem
   */
  constructor( body1: Body, body2: Body, tandem: Tandem ) {
    assert && assert( body1.massProperty.value > body2.massProperty.value, 'Should be ordered big to small' );

    this.body1 = body1;
    this.body2 = body2;

    // @private (for phet-io only)
    this.distanceProperty = new DerivedProperty( [
      this.body1.positionProperty,
      this.body2.positionProperty
    ], ( body1Position: Vector2, body2Position: Vector2 ) => body2Position.distance( body1Position ), {
      tandem: tandem.createTandem( 'distanceProperty' ),
      phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
      phetioHighFrequency: true,
      units: 'm'
    } );
  }
}

gravityAndOrbits.register( 'Pair', Pair );
export default Pair;