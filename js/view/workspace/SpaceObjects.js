// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of space objects.
 * When switching between modes, the state of space objects stores and restores using SpaceObjectsBuilder.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Util = require( 'DOT/Util' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Explosion = require( 'view/space-object/Explosion' );
  var Timer = require( 'JOIST/Timer' );
  var SpaceObjectsBuilder = require( 'view/workspace/SpaceObjectsBuilder' );

  /**
   * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
   * @constructor
   */
  function SpaceObjects( model ) {
    var spaceObjects = this;
    Node.call( this );

    this.state = [];
    this.view = new Node();

    model.planetModeProperty.link( function( num, prevNum ) {
      // disable explosion
      model.showExplosion = false;

      // save state
      if ( prevNum !== null && typeof prevNum !== 'undefined' ) {
        spaceObjects.saveState( model, prevNum, 0 );
      }

      // restore state if state was stored for this planet mode
      if ( spaceObjects.state[num] && spaceObjects.state[num][0] ) {
        spaceObjects.restoreState( model, num, 0 );
      }
      // else set initial state
      else {
        model.scale = 1;
        spaceObjects.initState( model, num );
      }

      if ( !spaceObjects.state[num] || !spaceObjects.state[num][1] ) {
        spaceObjects.saveState( model, num, 1 );
      }

      // enable explosion
      model.showExplosion = true;
    } );

    // add explosion animation
    model.spaceObjects.forEach( function( spaceObject ) {
      var body = model[spaceObject];
      body.radiusCoeffProperty.link( function() {
        spaceObjects.checkExplosion( model );
      } );

      body.positionProperty.link( function() {
        spaceObjects.checkExplosion( model );
      } );

      body.explodedProperty.link( function( exploded ) {
        body.view.setVisible( !exploded );
        if ( exploded && model.showExplosion ) {
          spaceObjects.showExplosion( body.position, body.view.getWidth() );
        }
      } );
    } );

    model.refreshModeProperty.link( function( trigger ) {
      if ( trigger ) {
        // disable explosion
        model.showExplosion = false;

        // set init state
        spaceObjects.initState( model, model.planetMode );

        // enable explosion
        model.showExplosion = true;

        model.refreshMode = false;
      }
    } );

    // redraw space objects when position changing
    model.spaceObjects.forEach( function( spaceObject ) {
      var body = model[spaceObject],
        position = new Vector2( 0, 0 );

      body.positionProperty.link( function( newPosition ) {
        // round coordinates and prevent ripple effect for some cases
        if ( spaceObject === 'earth' && model.planetMode === 2 && model.viewMode === model.viewModes[0] ) {
          position.setXY( Util.toFixedNumber( newPosition.x, 0 ), Util.toFixedNumber( newPosition.y, 0 ) );
          body.view.setTranslation( position );
        }
        else {
          body.view.setTranslation( newPosition );
        }
      } );
    } );

    // init drag and drop for space objects
    model.spaceObjects.forEach( function( spaceObject ) {
      var clickYOffset, clickXOffset, body = model[spaceObject], getListener = function( view ) {
        return new SimpleDragHandler( {
          start: function( e ) {
            clickYOffset = view.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y;
            clickXOffset = view.globalToParentPoint( e.pointer.point ).x - e.currentTarget.x;
            model.drag = spaceObject;
          },
          drag: function( e ) {
            var y = view.globalToParentPoint( e.pointer.point ).y - clickYOffset,
              x = view.globalToParentPoint( e.pointer.point ).x - clickXOffset;
            body.position.setXY( x, y );
            body.positionProperty.notifyObserversStatic();
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
      if ( coeff === 1 ) {
        model[earth].view.setDefaultView();
      }
      else {
        model[earth].view.setGrayView();
      }
    } );

    // save state when play button pressed
    model.playProperty.onValue( true, function() {
      // save state if only initial state (current day equal to dayOffset)
      if ( model.day === model.dayOffset ) {
        spaceObjects.saveState( model, model.planetMode, 1 );
      }
    } );

    // restore state when rewind button pressed
    model.rewindProperty.onValue( true, function() {
      spaceObjects.restoreState( model, model.planetMode, 1 );
      model.rewind = false;
    } );
  }

  return inherit( Node, SpaceObjects, {
    /**
     * Show animation for explosion.
     *
     * @param {Vector2} position of explosion.
     * @param {Number} radius of explosion.
     */
    showExplosion: function( position, radius ) {
      var spaceObjects = this, explosion = new Explosion( position, 2 * radius ), frames = 5;
      this.addChild( explosion );
      var interval = Timer.setInterval( function() {
        explosion.scale( 0.8 );
        if ( !--frames ) {
          Timer.clearInterval( interval );
          spaceObjects.removeChild( explosion );
        }
      }, 50 );
    },
    /**
     * Check all space objects for explosion.
     *
     * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
     */
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
    /**
     * Set init state for given planet mode.
     *
     * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
     * @param {Number} modeIndex - Planet mode number for which necessary set init state.
     */
    initState: function( model, modeIndex ) {
      // set scale center
      model.scaleCenter = new Vector2( model.planetModes[modeIndex].options.centerX, model.planetModes[modeIndex].options.centerY );

      // Remove the view, it will be discarded and garbage collected
      if ( this.view.children.length ) {
        this.removeChild( this.view );
      }
      model.day = 0;
      model.dayOffset = 0;
      model.previousDay = 0;

      // add new space objects
      this.view = new SpaceObjectsBuilder( model, modeIndex );
      this.addChild( this.view );
    },
    /**
     * Restore state for given planet mode.
     *
     * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
     * @param {Number} modeIndex - Planet mode number for which necessary to restore state.
     * @param {Number} stateIndex - State number for given planet mode state.
     */
    restoreState: function( model, modeIndex, stateIndex ) {
      var state = this.state[modeIndex][stateIndex];
      model.scale = state.scale;
      model.scaleCenter = state.scaleCenter;

      // add new space objects
      this.removeChild( this.view );

      model.dayOffset = model.day - state.dayShow;
      model.previousDay = state.previousDay;
      this.view = new SpaceObjectsBuilder( model, modeIndex, state.spaceObjects );
      this.addChild( this.view );
    },
    /**
     * Return current state for given planet mode.
     *
     * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
     * @param {Number} modeIndex - Planet mode number for which necessary get current state.
     * @return {Object} State object.
     */
    getState: function( model, modeIndex ) {
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
        obj = model.planetModes[modeIndex][name];
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
          spaceObject.x = body.position.x / model.planetModes[modeIndex].options.scale;
          spaceObject.y = body.position.y / model.planetModes[modeIndex].options.scale;
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
    /**
     * Save state for given planet mode.
     *
     * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
     * @param {Number} modeIndex - Planet mode number for which necessary to save state.
     * @param {Number} stateIndex - State number for given planet mode state.
     */
    saveState: function( model, modeIndex, stateIndex ) {
      if ( !this.state[modeIndex] ) {
        this.state[modeIndex] = [];
      }
      this.state[modeIndex][stateIndex] = this.getState( model, modeIndex );
    }
  } );
} );