// Copyright 2020, University of Colorado Boulder

/**
 * A combination of two Body instances to show pairwise quantities for PhET-iO.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../../axon/js/DerivedPropertyIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';

class Pair {

  /**
   * @param {Body} body1
   * @param {Body} body2
   * @param {Tandem} tandem
   */
  constructor( body1, body2, tandem ) {
    assert && assert( body1.massProperty.value > body2.massProperty.value, 'Should be ordered big to small' );

    this.body1 = body1;
    this.body2 = body2;

    // @private (for phet-io only)
    this.distancePropery = new DerivedProperty( [
      this.body1.positionProperty,
      this.body2.positionProperty
    ], ( body1Position, body2Position ) => body2Position.distance( body1Position ), {
      tandem: tandem.createTandem( 'distanceProperty' ),
      phetioType: DerivedPropertyIO( NumberIO ),
      phetioHighFrequency: true,
      units: 'm'
    } );
  }
}

gravityAndOrbits.register( 'Pair', Pair );
export default Pair;