// Copyright 2024, University of Colorado Boulder

/**
 * ESLint configuration for gravity-and-orbits.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import strictBooleanExpressionsConfig from '../perennial-alias/js/eslint/config/util/strictBooleanExpressionsConfig.mjs';
import simEslintConfig from '../perennial-alias/js/eslint/config/sim.eslint.config.mjs';

export default [
  ...simEslintConfig,
  ...strictBooleanExpressionsConfig
];
