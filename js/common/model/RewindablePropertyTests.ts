// Copyright 2021-2023, University of Colorado Boulder

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import RewindableProperty from './RewindableProperty.js';

QUnit.module( 'RewindableProperty' );

QUnit.test( 'Basic test', assert => {
  assert.ok( true );

  const property = new RewindableProperty<string>( new BooleanProperty( false ), 'hello' );
  property.set( 'bye' );
  assert.ok( property.differentProperty.value, 'should be different' );
} );