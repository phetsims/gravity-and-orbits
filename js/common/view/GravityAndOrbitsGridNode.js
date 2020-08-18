// Copyright 2020, University of Colorado Boulder

/**
 * When enabled, shows a grid across the play area that helps the user to make quantitative comparisons
 * between distances.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GridNode from '../../../../griddle/js/GridNode.js';

class GravityAndOrbitsGridNode extends GridNode {

  /**
   * @param {Property.<ModelViewTransform2>} transformProperty
   * @param {number} spacing - spacing between grid lines in model coordinates
   * @param {Vector2} center - center of the grid in model coordinates
   * @param {number} numGridLines - number grid lines on each side of the center
   * @param {Object} [options]
   */
  constructor( transformProperty, spacing, center, numGridLines, options ) {
    const gridDimension = numGridLines * transformProperty.value.modelToViewDeltaX( spacing );

    // Adapter Property to position the grid on the given model center
    const gridTransformProperty = new Property();

    transformProperty.link( transform => {
      gridTransformProperty.set( ModelViewTransform2.createSinglePointScaleMapping(
        center, // model center
        transformProperty.get().modelToViewPosition( center ), // view center
        transform.modelToViewDeltaX( 1 )
      ) );
    } );

    options = merge( {
      majorHorizontalLineSpacing: spacing,
      majorVerticalLineSpacing: spacing,
      modelViewTransformProperty: gridTransformProperty,
      majorLineOptions: {
        stroke: 'gray',
        lineWidth: 1
      }
    }, options );
    super( gridDimension, gridDimension, options );
  }
}

gravityAndOrbits.register( 'GravityAndOrbitsGridNode', GravityAndOrbitsGridNode );
export default GravityAndOrbitsGridNode;