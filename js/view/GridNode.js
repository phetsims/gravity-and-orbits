// Copyright 2002-2015, University of Colorado

/**
 * When enabled, shows a grid across the play area that helps the user to make quantitative comparisons between distances.
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
  var Line = require( 'SCENERY/nodes/Line' );

  //private
  var NUM_GRID_LINES = 10;

  /**
   *
   * @param {Property.<ModelViewTransform>} transformProperty
   * @param {number} spacing
   * @param {number} center
   * @constructor
   */
  function GridNode( transformProperty, spacing, center ) {

    Node.call( this );
    var thisNode = this;
    transformProperty.link( function() {
      thisNode.removeAllChildren();
      var i;
      //horizontal lines
      for ( i = -NUM_GRID_LINES; i <= NUM_GRID_LINES; i++ ) {
        var y = i * spacing + center.y;
        var x1 = NUM_GRID_LINES * spacing + center.x;
        var x2 = -NUM_GRID_LINES * spacing + center.x;
        thisNode.addGridLine( Shape.lineSegment( x1, y, x2, y ), transformProperty );
      }
      //vertical lines
      for ( i = -NUM_GRID_LINES; i <= NUM_GRID_LINES; i++ ) {
        var x = i * spacing + center.x;
        var y1 = NUM_GRID_LINES * spacing + center.y;
        var y2 = -NUM_GRID_LINES * spacing + center.y;
        thisNode.addGridLine( Shape.lineSegment( x, y1, x, y2 ), transformProperty );
      }
    } );
  }

  return inherit( Node, GridNode, {

    //private
    addGridLine: function( line, transformProperty ) {
      var path = new Path( transformProperty.get().modelToViewShape( line ), { lineWidth: 1, stroke: 'gray' } );
      this.addChild( path );
    }
  } );
} );
