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

  function Grid( model ) {
    var self = this;
    Node.call( this );

    var options = [
      {
        x0: -670.5,
        y0: -588,
        x1: 1100,
        y1: 587,
        delta: 84
      },
      {
        x0: -670.5,
        y0: -588,
        x1: 1100,
        y1: 587,
        delta: 84
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
      self.removeAllChildren(); // remove previous grid

      // add grid if it's visible
      if ( model.grid ) {
        var opt = options[model.planetMode];
        for ( var i = 0; opt.x0 + i * opt.delta < opt.x1; i++ ) {
          self.addChild( new Path( Shape.lineSegment( opt.x0 + i * opt.delta, opt.y0, opt.x0 + i * opt.delta, opt.y1 ), {stroke: 'gray', lineWidth: 1} ) );
        }
        for ( i = 0; opt.y0 + i * opt.delta < opt.y1; i++ ) {
          self.addChild( new Path( Shape.lineSegment( opt.x0, opt.y0 + i * opt.delta, opt.x1, opt.y0 + i * opt.delta ), {stroke: 'gray', lineWidth: 1} ) );
        }
      }
    };

    model.planetModeProperty.link( drawGrid );
    model.gridProperty.link( drawGrid );
  }

  return inherit( Node, Grid );
} );