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
  var Timer = require( 'JOIST/Timer' );

  var SpaceObjectsBuilder = require( 'view/Workspace/Components/SpaceObjectsBuilder' );

  function SpaceObjects( model ) {
    var self = this;
    Node.call( this );

    this.state = [];
    this.view = new Node();

    model.planetModeProperty.link( function( num, prevNum ) {
      // disable explosion
      model.showExplosion = false;

      // save state
      if ( prevNum !== null ) {
        self.saveState( model, prevNum, 0 );
      }

      if ( self.state[num] ) {
        self.restoreState( model, num, 0 );
      }
      else {
        self.initState( model, num );
      }

      self.saveState( model, num, 1 );
      // enable explosion
      model.showExplosion = true;
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
        if ( exploded && model.showExplosion ) {
          self.showExplosion( model[el + 'Position'], model[el + 'View'].getWidth() );
        }
      } );
    } );

    model.refreshModeProperty.link( function( flag ) {
      if ( flag ) {
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

    // replace earth by gray sphere
    var earth = model.spaceObjects[1];
    model[earth + 'RadiusCoeffProperty'].link( function( coeff ) {
      model[earth + 'View']['set' + (coeff === 1 ? 'Default' : 'Gray') + 'View']();
    } );

    model.playProperty.link( function( flag ) {
      if ( flag ) {
        self.saveState( model, model.planetMode, 1 );
      }
    } );

    model.rewindProperty.link( function( flag ) {
      if ( flag ) {
        self.restoreState( model, model.planetMode, 1 );
        model.rewind = false;
      }
    } );
  }

  inherit( Node, SpaceObjects );

  SpaceObjects.prototype.showExplosion = function( position, radius ) {
    var self = this, explosion = new Explosion( position, 2 * radius ), frames = 5;
    this.addChild( explosion );
    var interval = Timer.setInterval( function() {
      explosion.scale( 0.8 );
      if ( !--frames ) {
        Timer.clearInterval( interval );
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

  SpaceObjects.prototype.initState = function( model, num ) {
    // set scale center
    model.scaleCenter = new Vector2( model.planetModes[num].options.centerX, model.planetModes[num].options.centerY );

    this.removeChild( this.view );
    model.scale = 1;
    model.day = 0;
    model.dayOffset = 0;
    model.previousDay = 0;

    // add new space objects
    this.view = new SpaceObjectsBuilder( model, num );
    this.addChild( this.view );
  };

  SpaceObjects.prototype.restoreState = function( model, num, target ) {
    var state = this.state[num][target];
    model.scale = state.scale;
    model.scaleCenter = state.scaleCenter;

    // add new space objects
    this.removeChild( this.view );

    model.dayOffset = model.day - state.dayShow;
    model.previousDay = state.previousDay;
    this.view = new SpaceObjectsBuilder( model, num, state.spaceObjects );
    this.addChild( this.view );
  };

  SpaceObjects.prototype.getState = function( model, num ) {
    var obj, spaceObject, state;
    state = {
      scale: model.scale,
      scaleCenter: model.scaleCenter.copy(),
      dayShow: model.day - model.dayOffset,
      previousDay: model.previousDay,
      spaceObjects: {}
    };

    model.spaceObjects.forEach( function( name ) {
      obj = model.planetModes[num][name];
      if ( obj ) {
        state.spaceObjects[name] = {};
        spaceObject = state.spaceObjects[name];
        for ( var prop in obj ) {
          if ( obj.hasOwnProperty( prop ) ) {
            spaceObject[prop] = obj[prop];
          }
        }
        spaceObject.x = model[name + 'Position'].x / model.planetModes[num].options.scale;
        spaceObject.y = model[name + 'Position'].y / model.planetModes[num].options.scale;
        if ( !spaceObject.fixed ) {
          spaceObject.velocity = model[name + 'Velocity'].copy();
        }
        spaceObject.massCoeff = model[name + 'MassCoeff'];
        spaceObject.acceleration = model[name + 'Acceleration'].copy();
        spaceObject.velocityHalf = model[name + 'VelocityHalf'].copy();
        spaceObject.exploded = model[name + 'Exploded'];
      }
    } );

    return state;
  };

  SpaceObjects.prototype.saveState = function( model, num, target ) {
    if ( !this.state[num] ) {
      this.state[num] = [];
    }
    this.state[num][target] = this.getState( model, num );
  };

  return SpaceObjects;
} );