// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of planet's path.
 * Each segment of the path is stored till maximum time for a given mode.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  function PlanetPath( model ) {
    var self = this;
    Node.call( this );

    // color for space object's paths
    self.color = {
      sun: 'yellow',
      earth: 'gray',
      moon: 'rgb(255,0,255)',
      spaceStation: 'gray'
    };

    self.time = [];
    self.maxTime = [400, 300, 20, 0.05];

    self.clearAll( model );
    model.spaceObjects.forEach( function( el ) {
      var body = model[el];
      model[el].positionProperty.link( function() {
        if ( !body.exploded ) {
          var newPosition = body.position;
          var dr = newPosition.minus( self.prevPosition[self.num][el][self.prevPosition[self.num][el].length - 1] ).magnitude();
          if ( dr > 2 && self.visibility && model.planetMode === self.num ) {
            self.add( model, el, newPosition );
          }
        }
        self.check( model );
      } );
    } );

    model.pathProperty.link( function( visibility ) {
      self.clearAll( model );
      self.visibility = visibility;
    } );

    model.planetModeProperty.link( function( num ) {
      self.hide( model, self.num );
      self.show( model, self.num = num );
    } );

    model.refreshModeProperty.link( function( trigger ) {
      if ( trigger ) {
        self.clearOne( model, self.num );
      }
    } );

    model.rewindProperty.link( function( isRewind ) {
      if ( isRewind ) {
        self.clearOne( model, self.num );
      }
    } );

    model.dayProperty.link( function( newDay, oldDay ) {
      if ( model.planetMode !== self.num ) {return;}
      self.time[self.num] += (newDay - oldDay) / model.speed;
    } );
  }

  return inherit( Node, PlanetPath, {
    add: function( model, el, newPosition ) {
      var prevPosition = this.prevPosition[this.num][el][this.prevPosition[this.num][el].length - 1],
        path = new Path( new Shape().moveTo( prevPosition.x, prevPosition.y ).lineTo( newPosition.x, newPosition.y ), {stroke: this.color[el], lineWidth: 3, lineCap: 'square'} );

      this.path[this.num][el].push( {view: path, time: this.time[this.num]} );
      this.addChild( path );
      this.prevPosition[this.num][el].push( newPosition );
    },
    check: function( model ) {
      var self = this, paths, path;

      model.spaceObjects.forEach( function( el ) {
        paths = self.path[self.num][el];
        if ( !paths.length ) {return;}

        while ( self.time[self.num] - paths[0].time > self.maxTime[self.num] ) {
          path = paths.shift();
          self.removeChild( path.view );
          if ( !paths.length ) {return;}
        }
      } );
    },
    clearAll: function( model ) {
      var self = this;
      self.removeAllChildren();

      self.num = model.planetMode;
      self.path = [];
      self.prevPosition = [];
      model.planetModes.forEach( function( el, i ) {
        self.time[i] = 0;
        self.path[i] = {};
        self.prevPosition[i] = {};
        model.spaceObjects.forEach( function( el ) {
          self.path[i][el] = [];
          self.prevPosition[i][el] = [model[el].position];
        } );
      } );
    },
    clearOne: function( model, mode ) {
      var self = this;
      model.spaceObjects.forEach( function( el ) {
        self.path[mode][el].forEach( function( obj ) {
          self.removeChild( obj.view );
        } );
        self.path[mode][el] = [];
        self.prevPosition[mode][el] = [model[el].position];
      } );
    },
    hide: function( model, mode ) {
      var self = this;
      model.spaceObjects.forEach( function( el ) {
        for ( var i = 0; i < self.path[mode][el].length; i++ ) {
          self.path[mode][el][i].view.setVisible( false );
        }
      } );
    },
    show: function( model, mode ) {
      var self = this;
      model.spaceObjects.forEach( function( el ) {
        for ( var i = 0; i < self.path[mode][el].length; i++ ) {
          self.path[mode][el][i].view.setVisible( true );
        }

        if ( self.prevPosition[mode][el].length > 1 ) {
          self.prevPosition[mode][el] = [self.prevPosition[mode][el].pop()];
        }
        else {
          self.prevPosition[mode][el] = [model[el].position];
        }
      } );
    }
  } );
} );