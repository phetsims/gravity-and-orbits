// Copyright 2014-2019, University of Colorado Boulder

/**
 * When enabled, shows a grid across the play area that helps the user to make quantitative comparisons
 * between distances.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );

  /**
   * Constructor for GridNode
   * @param {Property.<ModelViewTransform>} transformProperty
   * @param {number} spacing - spacing between grid lines
   * @param {Vector2} center - center of the grid
   * @param {number} numGridLines - number grid lines on each side of the center
   * @param {Obejct} [options]
   * @constructor
   */
  function GridNode( transformProperty, spacing, center, numGridLines, options ) {

    options = _.extend( {
      lineWidth: 1,
      stroke: 'gray'
    }, options );

    Node.call( this );
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

  gravityAndOrbits.register( 'GridNode', GridNode );
  
  return inherit( Node, GridNode );
} );