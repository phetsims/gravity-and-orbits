// Copyright 2002-2013, University of Colorado Boulder

/**
 * main object view
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Sun = require( 'view/Workspace/Sun' );

  function Workspace( model ) {
    model = _.extend( {
      sun: {
        coordinates: {
          x: 275,
          y: 225
        },
        colorGradient: ["#fff", "#ff0"], // [<gradient light>, <gradient dark>]
        radius: 50 // radius when scale is 1.0
      }
    }, model );

    Node.call( this );

    // add sun to workspace
    this.addChild( new Sun( model ) );
  }

  inherit( Node, Workspace );

  return Workspace;
} );