// Copyright 2021-2022, University of Colorado Boulder

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import RewindableProperty from './RewindableProperty.js';

QUnit.module( 'RewindablePropertyTests' );

QUnit.test( 'Basic test', assert => {
  assert.ok( true );

  const property = new RewindableProperty<string>( new BooleanProperty( false ), 'hello' );
  property.set( 'bye' );
  assert.ok( property.differentProperty.value, 'should be different' );
} );