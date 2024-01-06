// Copyright 2021-2024, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import RewindableProperty from './RewindableProperty.js';

QUnit.module( 'RewindableProperty' );

QUnit.test( 'Basic test', assert => {
  assert.ok( true );

  const property = new RewindableProperty<string>( new BooleanProperty( false ), 'hello' );
  property.set( 'bye' );
  assert.ok( property.differentProperty.value, 'should be different' );
} );