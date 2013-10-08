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
        x0: -587.5,
        y0: -671,
        x1: 1200,
        y1: 500,
        dx: 84,
        dy: 84
      },
      {
        x0: -587.5,
        y0: -671,
        x1: 1200,
        y1: 500,
        dx: 84,
        dy: 84
      },
      {
        x0: -580,
        y0: -725,
        x1: 1200,
        y1: 500,
        dx: 72.5,
        dy: 72.5
      },
      {
        x0: -542,
        y0: -681,
        x1: 1200,
        y1: 500,
        dx: 136,
        dy: 136
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