/**
 * Copyright 2002-2013, University of Colorado
 * Container for mass sliders
 *
 * @author Andrey Zelenkov (Mlearner)
 */


define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function MassMenu( model, x, y, options ) {
    Node.call( this, {x: x, y: y} );

    this.addChild( new Rectangle( 0, 0, 1, 1, {fill: 'rgba(0,0,0,0)'} ) );
  }

  inherit( Node, MassMenu );

  return MassMenu;
} );