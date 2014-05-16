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
  //Line = require( 'SCENERY/nodes/Line' ),
    Rectangle = require( 'SCENERY/nodes/Rectangle' ),

  // constants
    SINGLE_PATH_SEGMENT_LENGTH = 2;

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
    self.prevPosition = [];
    self.path = [];

    // prepare component for work
    self.init( model );
    self.clearAll( model );

    model.spaceObjects.forEach( function( el ) {
      var body = model[el];

      // add position property observer
      model[el].positionProperty.link( function() {
        if ( !body.exploded && model.path && model.planetMode === self.num && model.drag !== el && self.totalLengthMax[self.num][el] > 0 ) {
          var newPosition = body.position,
            dr = newPosition.minus( self.prevPosition[self.num][el] ).magnitude();

          // add new piece of path if position was changed significantly
          if ( dr > SINGLE_PATH_SEGMENT_LENGTH ) {
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
        linesObj = this.path[this.num][el],
        line;

      // move pointer
      linesObj.pointerTail = ((linesObj.pointerTail + 1) % linesObj.paths.length);

      // get line
      line = linesObj.paths[linesObj.pointerTail];

      //line.view.setLine( prevPosition.x, prevPosition.y, newPosition.x, newPosition.y );
      line.view.setRect( 0, 0, newPosition.minus( prevPosition ).magnitude() * 1.5, 3 );
      line.view.rotate( Math.atan2( newPosition.y - prevPosition.y, newPosition.x - prevPosition.x ) );
      line.view.setTranslation( prevPosition );

      line.length = dr;
      this.addChild( line.view );
      this.prevPosition[this.num][el] = newPosition.copy();

      this.checkLength( el );
    },
    // check length of given planet
    checkLength: function( el ) {
      var num = this.num,
        totalLength = 0,
        maxLength = this.totalLengthMax[num][el],
        linesObj = this.path[num][el],
        lines = linesObj.paths,
        line;

      // define current length
      for ( var i = 0; i < lines.length; i++ ) {
        totalLength += lines[i].length;
      }

      while ( totalLength > maxLength ) {
        linesObj.pointerHead = ((linesObj.pointerHead + 1) % lines.length);
        line = lines[linesObj.pointerHead];
        this.removeChild( line.view );
        totalLength -= line.length;
        line.length = 0;
      }
    },
    // remove all path for all modes
    clearAll: function( model ) {
      var self = this;
      self.removeAllChildren();

      self.num = model.planetMode; // save planet mode value
      self.prevPosition = []; // contains previous positions for all modes
      model.planetModes.forEach( function( el, i ) {
        self.prevPosition[i] = {};
        model.spaceObjects.forEach( function( el ) {
          self.prevPosition[i][el] = model[el].position.copy();

          if ( self.path[self.num][el] ) {
            self.path[self.num][el].paths.forEach( function( obj ) {
              obj.length = 0;
            } );
            self.path[self.num][el].pointerHead = 0;
            self.path[self.num][el].pointerTail = 0;
          }
        } );
      } );
    },
    // remove all path for given mode
    clearOne: function( model, mode ) {
      var self = this;
      model.spaceObjects.forEach( function( el ) {
        if ( self.path[mode][el] ) {
          self.path[mode][el].paths.forEach( function( obj ) {
            if ( self.isChild( obj.view ) ) {
              self.removeChild( obj.view );
              obj.length = 0;
            }
          } );

          self.path[mode][el].pointerHead = 0;
          self.path[mode][el].pointerTail = 0;

          self.prevPosition[mode][el] = model[el].position.copy();
        }
      } );
    },
    // hide all path for given mode
    hide: function( model, mode ) {
      var self = this;

      model.spaceObjects.forEach( function( el ) {
        if ( self.path[mode][el] ) {
          for ( var i = 0, paths = self.path[mode][el].paths; i < paths.length; i++ ) {
            paths[i].view.setVisible( false );
          }
        }
      } );
    },
    // init paths for further using
    init: function() {
      var self = this,
        pathLength;

      this.totalLengthMax.forEach( function( planetLength, i ) {
        self.path[i] = {};
        for ( var planet in planetLength ) {
          if ( planetLength.hasOwnProperty( planet ) && planetLength[planet] ) {
            pathLength = planetLength[planet];
            self.path[i][planet] = {
              pointerHead: 0,
              pointerTail: 0,
              paths: []
            };
            for ( var j = 0; j <= pathLength / SINGLE_PATH_SEGMENT_LENGTH; j++ ) {
              self.path[i][planet].paths.push( {
                length: 0,
                //view: new Line( 0, 0, 0, 0, {stroke: self.color[planet], lineWidth: 3, lineCap: 'square'} )
                view: new Rectangle( 0, 0, 0, 0, {fill: self.color[planet]} )
              } );
            }
          }
        }
      } );
    },
    // show all path for given mode
    show: function( model, mode ) {
      var self = this;
      model.spaceObjects.forEach( function( el ) {
        if ( self.path[mode][el] ) {
          // show all path for given mode
          for ( var i = 0, paths = self.path[mode][el].paths; i < paths.length; i++ ) {
            paths[i].view.setVisible( true );
          }

          // set new previous position
          self.prevPosition[mode][el] = model[el].position.copy();
        }
      } );
    }
  } );
} );