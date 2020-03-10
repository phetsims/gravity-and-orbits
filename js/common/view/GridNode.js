// Copyright 2014-2020, University of Colorado Boulder

/**
 * When enabled, shows a grid across the play area that helps the user to make quantitative comparisons
 * between distances.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';

// TODO: Generalize, see https://github.com/phetsims/scenery-phet/issues/580
class GridNode extends Node {

  /**
   * Constructor for GridNode
   * @param {Property.<ModelViewTransform2>} transformProperty
   * @param {number} spacing - spacing between grid lines
   * @param {Vector2} center - center of the grid
   * @param {number} numGridLines - number grid lines on each side of the center
   * @param {Object} [options]
   */
  constructor( transformProperty, spacing, center, numGridLines, options ) {

    options = merge( {
      lineWidth: 1,
      stroke: 'gray'
    }, options );

    super();
    const path = new Path( null, options );
    this.addChild( path );

    transformProperty.link( () => {
      const shape = new Shape();

      // horizontal lines
      for ( let i = -numGridLines; i <= numGridLines; i++ ) {
        const y = i * spacing + center.y;
        const x1 = numGridLines * spacing + center.x;
        const x2 = -numGridLines * spacing + center.x;
        shape.moveTo( x1, y ).lineTo( x2, y );
      }

      // vertical lines
      for ( let i = -numGridLines; i <= numGridLines; i++ ) {
        const x = i * spacing + center.x;
        const y1 = numGridLines * spacing + center.y;
        const y2 = -numGridLines * spacing + center.y;
        shape.moveTo( x, y1 ).lineTo( x, y2 );
      }

      path.shape = transformProperty.get().modelToViewShape( shape );
    } );
  }
}

gravityAndOrbits.register( 'GridNode', GridNode );
export default GridNode;