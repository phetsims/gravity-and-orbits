/**
 * Copyright 2002-2013, University of Colorado
 * view for sun
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  function Sun( model ) {
    Node.call( this, model.sun.coordinates );

    this.addChild( new Circle( model.sun.radius, {
      fill: new RadialGradient( model.sun.radius * 0.3, -model.sun.radius * 0.3, 1, model.sun.radius * 0.3, -model.sun.radius * 0.3, model.sun.radius / 1.5 )
        .addColorStop( 0, model.sun.colorGradient[0] )
        .addColorStop( 1, model.sun.colorGradient[1] )
    } ) );
  }

  inherit( Node, Sun );

  return Sun;
} );