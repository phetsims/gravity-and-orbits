// Copyright 2002-2015, University of Colorado Boulder

/**
 * When enabled, shows a grid across the play area that helps the user to make quantitative comparisons
 * between distances.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );

  // constants
  var NUM_GRID_LINES = 14;

  /**
   *
   * @param {Property.<ModelViewTransform>} transformProperty
   * @param {number} spacing
   * @param {number} center
   * @constructor
   */
  function GridNode( transformProperty, spacing, center ) {

    Node.call( this );
    var path = new Path( null, { lineWidth: 1, stroke: 'gray' } );
    this.addChild( path );

    transformProperty.link( function() {
      var i;
      var shape = new Shape();

      // horizontal lines
      for ( i = -NUM_GRID_LINES; i <= NUM_GRID_LINES; i++ ) {
        var y = i * spacing + center.y;
        var x1 = NUM_GRID_LINES * spacing + center.x;
        var x2 = -NUM_GRID_LINES * spacing + center.x;
        shape.moveTo( x1, y ).lineTo( x2, y );
      }

      // vertical lines
      for ( i = -NUM_GRID_LINES; i <= NUM_GRID_LINES; i++ ) {
        var x = i * spacing + center.x;
        var y1 = NUM_GRID_LINES * spacing + center.y;
        var y2 = -NUM_GRID_LINES * spacing + center.y;
        shape.moveTo( x, y1 ).lineTo( x, y2 );
      }

      path.shape = transformProperty.get().modelToViewShape( shape );
    } );

  }

  return inherit( Node, GridNode );
} );
