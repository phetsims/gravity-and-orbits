// Copyright 2020-2022, University of Colorado Boulder

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
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

class Pair {
  private readonly body1: Body;
  private readonly body2: Body;
  private readonly distanceProperty: TReadOnlyProperty<number>;

  public constructor( body1: Body, body2: Body, tandem: Tandem ) {
    assert && assert( body1.massProperty.value > body2.massProperty.value, 'Should be ordered big to small' );

    this.body1 = body1;
    this.body2 = body2;

    this.distanceProperty = new DerivedProperty( [
      this.body1.positionProperty,
      this.body2.positionProperty
    ], ( body1Position, body2Position ) => body2Position.distance( body1Position ), {
      tandem: tandem.createTandem( 'distanceProperty' ),
      phetioValueType: NumberIO,
      phetioHighFrequency: true,
      units: 'm'
    } );
  }
}

gravityAndOrbits.register( 'Pair', Pair );
export default Pair;