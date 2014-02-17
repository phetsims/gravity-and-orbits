// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of space objects.
 * When switching between modes, the state of space objects stores and restores using SpaceObjectsBuilder.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' ),
    Node = require( 'SCENERY/nodes/Node' ),
    SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' ),
    Vector2 = require( 'DOT/Vector2' ),
    Explosion = require( 'view/space-object/Explosion' ),
    Timer = require( 'JOIST/Timer' ),
    SpaceObjectsBuilder = require( 'view/workspace/SpaceObjectsBuilder' );

  function SpaceObjects( model ) {
    var self = this;
    Node.call( this );

    this.state = [];
    this.view = new Node();

    model.planetModeProperty.link( function( num, prevNum ) {
      // disable explosion
      model.showExplosion = false;

      // save state
      if ( prevNum !== null && typeof prevNum !== 'undefined' ) {
        self.saveState( model, prevNum, 0 );
      }

      // restore state if state was stored for this planet mode
      if ( self.state[num] && self.state[num][0] ) {
        self.restoreState( model, num, 0 );
      }
      // else set initial state
      else {
        self.initState( model, num );
      }

      self.saveState( model, num, 1 );
      // enable explosion
      model.showExplosion = true;
    } );

    // add explosion animation
    model.spaceObjects.forEach( function( el ) {
      var body = model[el];
      body.radiusCoeffProperty.link( function() {
        self.checkExplosion( model );
      } );

      body.positionProperty.link( function() {
        self.checkExplosion( model );
      } );

      body.explodedProperty.link( function( exploded ) {
        body.view.setVisible( !exploded );
        if ( exploded && model.showExplosion ) {
          self.showExplosion( body.position, body.view.getWidth() );
        }
      } );
    } );

    model.refreshModeProperty.link( function( trigger ) {
      if ( trigger ) {
        // disable explosion
        model.showExplosion = false;

        // set init state
        self.initState( model, model.planetMode );

        // enable explosion
        model.showExplosion = true;

        model.refreshMode = false;
      }
    } );

    // redraw space objects when position changing
    model.spaceObjects.forEach( function( el ) {
      var body = model[el], position = new Vector2( 0, 0 );
      body.positionProperty.link( function( newPosition ) {
        // round coordinates to integer values
        position.setXY( parseInt( newPosition.x, 10 ), parseInt( newPosition.y, 10 ) );
        body.view.setTranslation( position );
      } );
    } );

    // init drag and drop for space objects
    model.spaceObjects.forEach( function( el ) {
      var clickYOffset, clickXOffset, body = model[el], getListener = function( view ) {
        return new SimpleDragHandler( {
          start: function( e ) {
            clickYOffset = view.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y;
            clickXOffset = view.globalToParentPoint( e.pointer.point ).x - e.currentTarget.x;
            model.drag = el;
          },
          drag: function( e ) {
            var y = view.globalToParentPoint( e.pointer.point ).y - clickYOffset;
            var x = view.globalToParentPoint( e.pointer.point ).x - clickXOffset;
            body.position = new Vector2( x, y );
          },
          end: function() {
            model.drag = '';
          }
        } );
      };

      // can drag using view of space object
      body.initDragProperty.link( function( isDrag ) {
        if ( isDrag ) {
          body.view.cursor = 'pointer';
          body.view.addInputListener( getListener( body.view ) );
          body.initDrag = false;
        }
      } );

      // can drag using label
      body.label.addInputListener( getListener( body.label ) );
    } );

    // replace earth by gray sphere
    var earth = model.spaceObjects[1];
    model[earth].radiusCoeffProperty.link( function( coeff ) {
      model[earth].view['set' + (coeff === 1 ? 'Default' : 'Gray') + 'View']();
    } );

    // save state when play button pressed
    model.playProperty.link( function( isPlay ) {
      if ( isPlay ) {
        self.saveState( model, model.planetMode, 1 );
      }
    } );

    // restore state when rewind button pressed
    model.rewindProperty.link( function( isRewind ) {
      if ( isRewind ) {
        self.restoreState( model, model.planetMode, 1 );
        model.rewind = false;
      }
    } );
  }

  return inherit( Node, SpaceObjects, {
    // animation for explosion
    showExplosion: function( position, radius ) {
      var self = this, explosion = new Explosion( position, 2 * radius ), frames = 5;
      this.addChild( explosion );
      var interval = Timer.setInterval( function() {
        explosion.scale( 0.8 );
        if ( !--frames ) {
          Timer.clearInterval( interval );
          self.removeChild( explosion );
        }
      }, 50 );
    },
    checkExplosion: function( model ) {
      var obj1, obj2, i, j, dx, dr, mode = model.planetModes[model.planetMode];

      for ( i = 0; i < model.spaceObjects.length; i++ ) {
        obj1 = model.spaceObjects[i];
        if ( !mode[obj1] ) {continue;}
        for ( j = i + 1; j < model.spaceObjects.length; j++ ) {
          obj2 = model.spaceObjects[j];
          if ( !mode[obj2] ) {continue;}

          // distance between objects
          dx = model[obj1].position.minus( model[obj2].position ).magnitude(); // distance between planets

          // sum of radius of objects
          dr = (model[obj1].view.getWidth() + model[obj2].view.getWidth()) / 2;

          // check finite distance
          if ( !isFinite( dx ) || !isFinite( dr ) ) {
            {continue;}
          }

          // explosion if distance less that sum of radius
          if ( dr > dx ) {
            model[(model[obj1].mass > model[obj2].mass ? obj2 : obj1 )].exploded = true;
          }
        }
      }
    },
    // set init state for given planet mode
    initState: function( model, num ) {
      // set scale center
      model.scaleCenter = new Vector2( model.planetModes[num].options.centerX, model.planetModes[num].options.centerY );

      // Remove the view, it will be discarded and garbage collected
      if ( this.view.children.length ) {
        this.removeChild( this.view );
      }
      model.scale = 1;
      model.day = 0;
      model.dayOffset = 0;
      model.previousDay = 0;

      // add new space objects
      this.view = new SpaceObjectsBuilder( model, num );
      this.addChild( this.view );
    },
    // restore state for given planet mode
    restoreState: function( model, num, target ) {
      var state = this.state[num][target];
      model.scale = state.scale;
      model.scaleCenter = state.scaleCenter;

      // add new space objects
      this.removeChild( this.view );

      model.dayOffset = model.day - state.dayShow;
      model.previousDay = state.previousDay;
      this.view = new SpaceObjectsBuilder( model, num, state.spaceObjects );
      this.addChild( this.view );
    },
    // return state for given planet mode
    getState: function( model, num ) {
      var obj, spaceObject, state, body;
      // common properties for all space objects
      state = {
        scale: model.scale,
        scaleCenter: model.scaleCenter.copy(),
        dayShow: model.day - model.dayOffset,
        previousDay: model.previousDay,
        spaceObjects: {}
      };

      // individual properties for each space objects
      model.spaceObjects.forEach( function( name ) {
        obj = model.planetModes[num][name];
        if ( obj ) {
          body = model[name];
          state.spaceObjects[name] = {};
          spaceObject = state.spaceObjects[name];

          // save static properties
          for ( var prop in obj ) {
            if ( obj.hasOwnProperty( prop ) ) {
              spaceObject[prop] = obj[prop];
            }
          }

          // save dynamic properties
          spaceObject.x = body.position.x / model.planetModes[num].options.scale;
          spaceObject.y = body.position.y / model.planetModes[num].options.scale;
          if ( !spaceObject.fixed ) {
            spaceObject.velocity = body.velocity.copy();
          }
          spaceObject.massCoeff = body.massCoeff;
          spaceObject.acceleration = body.acceleration.copy();
          spaceObject.exploded = body.exploded;
        }
      } );

      return state;
    },
    // save state for given planet mode
    saveState: function( model, num, target ) {
      if ( !this.state[num] ) {
        this.state[num] = [];
      }
      this.state[num][target] = this.getState( model, num );
    }
  } );
} );