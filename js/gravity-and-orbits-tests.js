// Copyright 2021-2022, University of Colorado Boulder

/**
 * Unit tests. Please run once in phet brand and once in brand=phet-io to cover all functionality.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import qunitStart from '../../chipper/js/sim-tests/qunitStart.js';
import './common/model/RewindablePropertyTests.js';

// Since our tests are loaded asynchronously, we must direct QUnit to begin the tests
qunitStart();