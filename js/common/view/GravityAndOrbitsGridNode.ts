// Copyright 2020-2021, University of Colorado Boulder

/**
 * When enabled, shows a grid across the play area that helps the user to make quantitative comparisons
 * between distances.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import Property from '../../../../axon/js/Property';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2';
import Vector2 from '../../../../dot/js/Vector2';

class GravityAndOrbitsGridNode extends Node {

  /**
   * @param {Property.<ModelViewTransform2>} transformProperty
   * @param {number} spacing - spacing between grid lines
   * @param {Vector2} center - center of the grid in model coordinates
   * @param {number} numGridLines - number grid lines on each side of the center
   * @param {Object} [options]
   */
  constructor( transformProperty: Property<ModelViewTransform2>, spacing: number, center: Vector2, numGridLines: number, options?: object ) {

    options = merge( {
      lineWidth: 1,
      stroke: 'gray'
    }, options );

    const path = new Path( null, options );
    super( { children: [ path ] } );

    transformProperty.link( () => {
      const shape = new Shape();

      const x1 = -numGridLines * spacing + center.x;
      const x2 = numGridLines * spacing + center.x;
      const y1 = -numGridLines * spacing + center.y;
      const y2 = numGridLines * spacing + center.y;

      for ( let i = -numGridLines; i <= numGridLines; i++ ) {
        const x = i * spacing + center.x;
        const y = i * spacing + center.y;
        shape.moveTo( x1, y ).lineTo( x2, y ); // horizontal lines
        shape.moveTo( x, y1 ).lineTo( x, y2 ); // vertical lines
      }

      path.shape = transformProperty.get().modelToViewShape( shape );
    } );
  }
}

gravityAndOrbits.register( 'GravityAndOrbitsGridNode', GravityAndOrbitsGridNode );
export default GravityAndOrbitsGridNode;