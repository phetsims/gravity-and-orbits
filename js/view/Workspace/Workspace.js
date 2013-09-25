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
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  var WorkspaceBuilder = require( 'view/Workspace/WorkspaceBuilder' );

  function Workspace( model ) {
    var self = this;
    Node.call( this );

    // redraw workspace when scale is changing
    model.scaleProperty.link( function( newScale, oldScale ) {
      self.scale( 1 / (oldScale || 1) );
      self.scale( newScale );
    } );

    // redraw workspace when selected new mode
    model.planetModeProperty.link( function( num ) {
      model.dayProperty.reset();
      self.removeAllChildren();

      self.view = new WorkspaceBuilder( model, num );
      self.addChild( self.view );
      self.x = model.scaleCenter.x;
      self.y = model.scaleCenter.y;
    } );

    // redraw workspace position of object is changing
    model.dayProperty.link( function() {
      model.spaceObjects.forEach( function( el ) {
        model[el + 'View'].x = model[el + 'Position'].x;
        model[el + 'View'].y = model[el + 'Position'].y;
      } );
    } );

    model.spaceObjects.forEach( function( el ) {
      model[el + 'ViewProperty'].link( function( view ) {
        var clickYOffset, clickXOffset;
        view.cursor = 'pointer';
        view.addInputListener( new SimpleDragHandler( {
          start: function( e ) {
            clickYOffset = view.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y;
            clickXOffset = view.globalToParentPoint( e.pointer.point ).x - e.currentTarget.x;
            model.drag = el;
          },
          drag: function( e ) {
            var y = view.globalToParentPoint( e.pointer.point ).y - clickYOffset;
            var x = view.globalToParentPoint( e.pointer.point ).x - clickXOffset;
            model[el + 'Position'].set( x, y );
          },
          end: function() {
            model.drag = '';
          }
        } ) );
      } );
    } );
  }

  inherit( Node, Workspace );

  return Workspace;
} );