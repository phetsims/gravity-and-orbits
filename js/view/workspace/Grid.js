// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of grid lines.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  /**
   * @param {Property} gridProperty - Grid visibility flag.
   * @param {Property} planetModeProperty - Planet mode property. Grids depend on planet modes.
   * @constructor
   */
  function Grid( gridProperty, planetModeProperty ) {
    var grid = this;
    Node.call( this );

    var options = [
      {
        x0: -676,
        y0: -591.5,
        x1: 1100,
        y1: 587,
        delta: 84.5
      },
      {
        x0: -676,
        y0: -591.5,
        x1: 1100,
        y1: 587,
        delta: 84.5
      },
      {
        x0: -725,
        y0: -725,
        x1: 1100,
        y1: 572.2,
        delta: 72.5
      },
      {
        x0: -669,
        y0: -670,
        x1: 1100,
        y1: 636,
        delta: 134
      }
    ];

    var drawGrid = function() {
      grid.removeAllChildren(); // remove previous grid

      // add grid if it's visible
      if ( gridProperty.value ) {
        var opt = options[planetModeProperty.value];
        for ( var i = 0; opt.x0 + i * opt.delta < opt.x1; i++ ) {
          grid.addChild( new Path( Shape.lineSegment( opt.x0 + i * opt.delta, opt.y0, opt.x0 + i * opt.delta, opt.y1 ), {stroke: 'gray', lineWidth: 1} ) );
        }
        for ( i = 0; opt.y0 + i * opt.delta < opt.y1; i++ ) {
          grid.addChild( new Path( Shape.lineSegment( opt.x0, opt.y0 + i * opt.delta, opt.x1, opt.y0 + i * opt.delta ), {stroke: 'gray', lineWidth: 1} ) );
        }
      }
    };

    planetModeProperty.lazyLink( drawGrid );
    gridProperty.link( drawGrid );
  }

  return inherit( Node, Grid );
} );