// Copyright 2002-2013, University of Colorado Boulder

/**
 * main view
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  var WorkspaceBuilder = require( 'view/Workspace/WorkspaceBuilder' );

  function Workspace( model ) {
    var self = this;
    Node.call( this );

    // redraw workspace when scale is changing
    model.scaleProperty.link( function( newScale, oldScale ) {
      if ( oldScale ) {
        self.scale( 1 / oldScale );
      }
      self.scale( newScale );
    } );

    // redraw workspace when selected new mode
    model.planetModeProperty.link( function( num ) {
      self.removeAllChildren();

      self.view = new WorkspaceBuilder( model, num );
      self.addChild( self.view );
      self.x = model.scaleCenter.x;
      self.y = model.scaleCenter.y;
    } );

    // redraw workspace position of object is changing
    model.dayProperty.link( function() {
      if ( self.view ) {
        for ( var i = 0, obj; i < model.spaceObjects.length; i++ ) {
          obj = self.view[model.spaceObjects[i]];
          if ( obj ) {
            obj.x = model[model.spaceObjects[i] + 'Position'].x;
            obj.y = model[model.spaceObjects[i] + 'Position'].y;
          }
        }
      }
    } );
  }

  inherit( Node, Workspace );

  return Workspace;
} );