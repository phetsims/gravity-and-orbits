// Copyright 2021, University of Colorado Boulder

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import RewindableProperty from './RewindableProperty.js';

QUnit.module( 'RewindablePropertyTests' );

QUnit.test( 'Basic test', assert => {
  assert.ok( true );

  const r = new RewindableProperty( new BooleanProperty( false ), 'hello' );
  r.set( 'bye' );
  assert.ok( r.differentProperty.value, 'should be different' );
} );