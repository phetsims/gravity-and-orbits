// Copyright 2020, University of Colorado Boulder

/**
 * A combination of two Body instances to show pairwise quantities for PhET-iO.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );

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
        units: 'm'
      } );
    }
  }

  return gravityAndOrbits.register( 'Pair', Pair );
} );