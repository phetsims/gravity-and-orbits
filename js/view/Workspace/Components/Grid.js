// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for grid lines
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  function Grid( model ) {
    var self = this;
    Node.call( this );

    var options = [
      {
        x0: -549,
        y0: -660,
        x1: 1200,
        y1: 500,
        dx: 110,
        dy: 110
      },
      {
        x0: -549,
        y0: -660,
        x1: 1200,
        y1: 500,
        dx: 110,
        dy: 110
      },
      {
        x0: -588,
        y0: -685,
        x1: 1200,
        y1: 500,
        dx: 98,
        dy: 98
      },
      {
        x0: -529,
        y0: -711,
        x1: 1200,
        y1: 500,
        dx: 177,
        dy: 177
      }
    ];

    var drawGrid = function() {
      var mode = self.mode;
      self.removeAllChildren();
      if ( self.flag ) {
        var opt = options[mode];
        for ( var i = 0; opt.x0 + i * opt.dx < opt.x1; i++ ) {
          self.addChild( new Path( Shape.lineSegment( opt.x0 + i * opt.dx, opt.y0, opt.x0 + i * opt.dx, opt.y1 ), {stroke: 'gray', lineWidth: 1} ) );
        }
        for ( i = 0; opt.y0 + i * opt.dy < opt.y1; i++ ) {
          self.addChild( new Path( Shape.lineSegment( opt.x0, opt.y0 + i * opt.dy, opt.x1, opt.y0 + i * opt.dy ), {stroke: 'gray', lineWidth: 1} ) );
        }
      }
    };

    model.planetModeProperty.link( function( mode ) {
      self.mode = mode;
      drawGrid();
    } );

    model.gridProperty.link( function( flag ) {
      self.flag = flag;
      drawGrid();
    } );
  }

  inherit( Node, Grid );

  return Grid;
} );