// Copyright 2002-2013, University of Colorado Boulder

/**
 * space objects view on workspace
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  var SpaceObjectsBuilder = require( 'view/Workspace/Components/SpaceObjectsBuilder' );

  function SpaceObjects( model ) {
    var self = this;
    Node.call( this );

    model.planetModeProperty.link( function( num ) {
      // set scale center
      model.scaleCenter = new Vector2( model.planetModes[num].options.centerX, model.planetModes[num].options.centerY );

      // add new space objects
      self.removeAllChildren();
      model.day = 0;
      self.view = new SpaceObjectsBuilder( model, num );
      self.addChild( self.view );
    } );

    // change scale for view modes
    model.viewModeProperty.link( function( mode, prevMode ) {
      var name, obj, num = model.planetMode, oldScale = 1, newScale = 1;
      for ( var i = 0; i < model.spaceObjects.length; i++ ) {
        name = model.spaceObjects[i];
        obj = model.planetModes[num][name];
        if ( obj ) {
          if ( mode === model.viewModes[0] ) {
            newScale = 1;
          }
          else if ( mode === model.viewModes[1] ) {
            newScale = obj.radiusScaleMode;
          }

          if ( prevMode === model.viewModes[0] ) {
            oldScale = 1;
          }
          else if ( prevMode === model.viewModes[1] ) {
            oldScale = obj.radiusScaleMode;
          }

          model[name + 'View'].scale( newScale / oldScale );
        }
      }
    } );

    // init drag and drop for space objects
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
            model[el + 'Position'] = new Vector2( x, y );
          },
          end: function() {
            model.drag = '';
          }
        } ) );
      } );
    } );
  }

  inherit( Node, SpaceObjects );

  return SpaceObjects;
} );