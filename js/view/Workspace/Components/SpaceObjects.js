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
  var Explosion = require( 'view/SpaceObject/Explosion' );

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

    // add explosion animation
    model.spaceObjects.forEach( function( el ) {
      model[el + 'RadiusCoeffProperty'].link( function() {
        self.checkExplosion( model );
      } );

      model[el + 'PositionProperty'].link( function() {
        self.checkExplosion( model );
      } );

      model[el + 'ExplodedProperty'].link( function( exploded ) {
        model[el + 'View'].setVisible( !exploded );
        if ( exploded ) {
          self.showExplosion( model[el + 'Position'], model[el + 'View'].getWidth() );
        }
      } );
    } );

    // redraw space objects when position changing
    model.spaceObjects.forEach( function( el ) {
      model[el + 'PositionProperty'].link( function( vect ) {
        model[el + 'View'].x = vect.x;
        model[el + 'View'].y = vect.y;
      } );
    } );

    // init drag and drop for space objects
    model.spaceObjects.forEach( function( el ) {
      var clickYOffset, clickXOffset, getListener = function( view ) {
        return new SimpleDragHandler( {
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
        } );
      };

      model[el + 'ViewProperty'].link( function( view ) {
        view.cursor = 'pointer';
        view.addInputListener( getListener( view ) );
      } );

      model[el + 'TooltipProperty'].link( function( tooltip ) {
        tooltip.cursor = 'pointer';
        tooltip.addInputListener( getListener( tooltip ) );
      } );
    } );
  }

  inherit( Node, SpaceObjects );

  SpaceObjects.prototype.showExplosion = function( position, radius ) {
    var self = this, explosion = new Explosion( position, 2 * radius ), frames = 5;
    this.addChild( explosion );
    var interval = setInterval( function() {
      explosion.scale( 0.8 );
      if ( !--frames ) {
        clearInterval( interval );
        self.removeChild( explosion );
      }
    }, 50 );
  };

  SpaceObjects.prototype.checkExplosion = function( model ) {
    var obj1, obj2, i, j, dx, dr, mode = model.planetModes[model.planetMode];

    for ( i = 0; i < model.spaceObjects.length; i++ ) {
      obj1 = model.spaceObjects[i];
      if ( !mode[obj1] ) {continue;}
      for ( j = i + 1; j < model.spaceObjects.length; j++ ) {
        obj2 = model.spaceObjects[j];
        if ( !mode[obj2] ) {continue;}
        dx = model[obj1 + 'Position'].minus( model[obj2 + 'Position'] ).magnitude(); // distance between planets
        dr = (model[obj1 + 'View'].getWidth() + model[obj2 + 'View'].getWidth()) / 2;
        if ( !isFinite( dx ) || !isFinite( dr ) ) {
          {continue;}
        }
        if ( dr > dx ) {
          model[(model[obj1 + 'Mass'] > model[obj2 + 'Mass'] ? obj2 : obj1 ) + 'Exploded'] = true;
        }
      }
    }
  };

  return SpaceObjects;
} );