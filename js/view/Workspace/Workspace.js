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
  var Sun = require( 'view/SpaceObject/Sun' );

  function Workspace( model ) {
    var self = this;
    var options = {
      sun: {
        coords: {
          x: 275,
          y: 225
        },
        radius: 50 // radius when scale is 1.0
      }
    };

    Node.call( this );

    // add sun to workspace
    this.sun = new Sun( options.sun.coords, options.sun.radius );
    this.addChild( this.sun );

    // redraw objects when scale is changing
    model.scaleProperty.link( function( newScale, oldScale ) {
      if ( oldScale ) {
        self.sun.view.scale( 1 / oldScale );
      }
      self.sun.view.scale( newScale );
    } );
  }

  inherit( Node, Workspace );

  return Workspace;
} );