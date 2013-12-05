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
  var Line = require( 'SCENERY/nodes/Line' );

  function PlanetPath( model ) {
    var self = this;
    Node.call( this );

    // color for space object's paths
    self.color = {
      sun: 'yellow',
      earth: 'gray',
      moon: 'magenta',
      spaceStation: 'gray'
    };

    self.time = []; // passed time for each mode (self.time.length === self.maxTime.length)
    self.maxTime = [400, 300, 20, 0.05]; // max time to store path

    self.clearAll( model ); // prepare component for work
    model.spaceObjects.forEach( function( el ) {
      var body = model[el];

      // add position property observer
      model[el].positionProperty.link( function() {
        if ( !body.exploded && model.path && model.planetMode === self.num && model.drag !== el ) {
          var newPosition = body.position;
          var dr = newPosition.minus( self.prevPosition[self.num][el] ).magnitude();

          // add new piece of path if position was changed significantly
          if ( dr > 2 ) {
            self.add( model, el, newPosition );
          }
        }
        // check lifetime of path
        self.check( model );
      } );
    } );

    // clear path if visibility changed
    model.pathProperty.link( function() {
      self.clearAll( model );
    } );

    model.planetModeProperty.link( function( num ) {
      // hide previous path
      self.hide( model, self.num );

      // show current path
      self.show( model, self.num = num );
    } );

    // clear path if refresh was called
    model.refreshModeProperty.link( function( trigger ) {
      if ( trigger ) {
        self.clearOne( model, self.num );
      }
    } );

    // clear path if rewind was called
    model.rewindProperty.link( function( isRewind ) {
      if ( isRewind ) {
        self.clearOne( model, self.num );
      }
    } );

    // update time value for current mode
    model.dayProperty.link( function( newDay, oldDay ) {
      if ( model.planetMode !== self.num ) {return;}
      self.time[self.num] += (newDay - oldDay) / model.speed;
    } );
  }

  return inherit( Node, PlanetPath, {
    // add new piece of path for given element
    add: function( model, el, newPosition ) {
      var prevPosition = this.prevPosition[this.num][el],
        line = new Line( prevPosition, newPosition, {stroke: this.color[el], lineWidth: 3, lineCap: 'square'} );

      this.path[this.num][el].push( {view: line, time: this.time[this.num]} );
      this.addChild( line );
      this.prevPosition[this.num][el] = newPosition.copy();
    },
    // check lifetime of all pieces for all space objects
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
    // remove all path for all modes
    clearAll: function( model ) {
      var self = this;
      self.removeAllChildren();

      self.num = model.planetMode; // save planet mode value
      self.path = []; // contains all pieces of path for all modes
      self.prevPosition = []; // contains all pieces of path for all modes
      model.planetModes.forEach( function( el, i ) {
        self.time[i] = 0;
        self.path[i] = {};
        self.prevPosition[i] = {};
        model.spaceObjects.forEach( function( el ) {
          self.path[i][el] = [];
          self.prevPosition[i][el] = model[el].position.copy();
        } );
      } );
    },
    // remove all path for given mode
    clearOne: function( model, mode ) {
      var self = this;
      model.spaceObjects.forEach( function( el ) {
        self.path[mode][el].forEach( function( obj ) {
          self.removeChild( obj.view );
        } );
        self.path[mode][el] = [];
        self.prevPosition[mode][el] = model[el].position.copy();
      } );
    },
    // hide all path for given mode
    hide: function( model, mode ) {
      var self = this;
      model.spaceObjects.forEach( function( el ) {
        for ( var i = 0; i < self.path[mode][el].length; i++ ) {
          self.path[mode][el][i].view.setVisible( false );
        }
      } );
    },
    // show all path for given mode
    show: function( model, mode ) {
      var self = this;
      model.spaceObjects.forEach( function( el ) {
        // show all path for given mode
        for ( var i = 0; i < self.path[mode][el].length; i++ ) {
          self.path[mode][el][i].view.setVisible( true );
        }

        // set new previous position
        self.prevPosition[mode][el] = model[el].position.copy();
      } );
    }
  } );
} );