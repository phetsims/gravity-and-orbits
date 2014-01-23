// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of planet's path.
 * Each segment of the path is stored till maximum time for a given mode.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' ),
    Node = require( 'SCENERY/nodes/Node' ),
    Line = require( 'SCENERY/nodes/Line' );

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

    // max length of paths
    self.totalLengthMax = [
      {
        sun: 0,
        earth: 900
      },
      {
        sun: 0,
        earth: 900,
        moon: 1015
      },
      {
        earth: 0,
        moon: 750
      },
      {
        earth: 0,
        spaceStation: 700
      }
    ];

    // variables for each space object
    self.prevPosition = {};
    self.path = {};

    self.clearAll( model ); // prepare component for work
    model.spaceObjects.forEach( function( el ) {
      var body = model[el];

      // add position property observer
      model[el].positionProperty.link( function() {
        if ( !body.exploded && model.path && model.planetMode === self.num && model.drag !== el && self.totalLengthMax[self.num][el] > 0 ) {
          var newPosition = body.position;
          var dr = newPosition.minus( self.prevPosition[self.num][el] ).magnitude();

          // add new piece of path if position was changed significantly
          if ( dr > 2 ) {
            self.add( model, el, newPosition, dr );
          }
        }
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
  }

  return inherit( Node, PlanetPath, {
    // add new piece of path for given element
    add: function( model, el, newPosition, dr ) {
      var prevPosition = this.prevPosition[this.num][el],
        line = new Line( prevPosition, newPosition, {stroke: this.color[el], lineWidth: 3, lineCap: 'square'} );

      this.path[this.num][el].push( {view: line, size: dr} );
      this.addChild( line );
      this.prevPosition[this.num][el] = newPosition.copy();

      // check length of path
      this.checkLength( el );
    },
    // check length of given planet
    checkLength: function( el ) {
      var num = this.num,
        totalLength = 0,
        maxLength = this.totalLengthMax[num][el],
        paths = this.path[num][el],
        path;

      // define current length
      for ( var i = 0; i < paths.length; i++ ) {
        totalLength += paths[i].size;
      }

      while ( totalLength > maxLength ) {
        path = paths.shift();
        this.removeChild( path.view );
        totalLength -= path.size;
      }
    },
    // remove all path for all modes
    clearAll: function( model ) {
      var self = this;
      self.removeAllChildren();

      self.num = model.planetMode; // save planet mode value
      self.path = []; // contains all pieces of path for all modes
      self.prevPosition = []; // contains all pieces of path for all modes
      model.planetModes.forEach( function( el, i ) {
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