// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of planet's path.
 * Each segment of the path is stored till maximum time for a given mode.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  var SINGLE_PATH_SEGMENT_LENGTH = 2;

  /**
   * @param {PropertySet} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
   * @constructor
   */
  function PlanetPath( model ) {
    var planetPath = this;
    Node.call( this );

    // color for space object's paths
    planetPath.color = {
      sun: 'yellow',
      earth: 'gray',
      moon: 'magenta',
      spaceStation: 'gray'
    };

    // max length of paths
    planetPath.totalLengthMax = [
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
    planetPath.prevPosition = [];
    planetPath.path = [];

    // init path view for each space object
    this.totalLengthMax.forEach( function( planetLength, i ) {
      var pathLength;

      planetPath.path[i] = {};
      for ( var planet in planetLength ) {
        if ( planetLength.hasOwnProperty( planet ) && planetLength[planet] ) {
          pathLength = planetLength[planet];
          planetPath.path[i][planet] = {
            pointerHead: 0,
            pointerTail: 0,
            pool: []
          };
          for ( var j = 0; j <= pathLength / SINGLE_PATH_SEGMENT_LENGTH; j++ ) {
            planetPath.path[i][planet].pool.push( {
              length: 0,
              view: new Rectangle( 0, 0, 0, 0, {fill: planetPath.color[planet]} )
            } );
          }
        }
      }
    } );

    planetPath.clearAll( model );

    model.spaceObjects.forEach( function( spaceObject ) {
      var body = model[spaceObject];

      // add position property observer
      model[spaceObject].positionProperty.link( function() {
        if ( !body.exploded && model.path && model.planetMode === planetPath.num && model.drag !== spaceObject && planetPath.totalLengthMax[planetPath.num][spaceObject] > 0 ) {
          var newPosition = body.position,
            dr = newPosition.minus( planetPath.prevPosition[planetPath.num][spaceObject] ).magnitude();

          // add new piece of path if position was changed significantly
          if ( dr > SINGLE_PATH_SEGMENT_LENGTH ) {
            planetPath.add( model, spaceObject, newPosition, dr );
          }
        }
      } );
    } );

    // clear path if visibility changed
    model.pathProperty.link( function() {
      planetPath.clearAll( model );
    } );

    model.planetModeProperty.link( function( num ) {
      // hide previous path
      planetPath.hide( model, planetPath.num );

      // show current path
      planetPath.show( model, planetPath.num = num );
    } );

    // clear path if refresh was called
    model.refreshModeProperty.link( function( trigger ) {
      if ( trigger ) {
        planetPath.clearOne( model, planetPath.num );
      }
    } );

    // clear path if rewind was called
    model.rewindProperty.link( function( isRewind ) {
      if ( isRewind ) {
        planetPath.clearOne( model, planetPath.num );
      }
    } );
  }

  return inherit( Node, PlanetPath, {
    /**
     * Add new piece of path for given element.
     *
     * @param {PropertySet} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
     * @param {String} spaceObject - Name of space object for which necessary add new piece of path.
     * @param {Vector2} newPosition - New space object position.
     * @param {Number} dr - Length between previous and new position.
     */
    add: function( model, spaceObject, newPosition, dr ) {
      var prevPosition = this.prevPosition[this.num][spaceObject],
        linesObj = this.path[this.num][spaceObject],
        line;

      // move pointer
      linesObj.pointerTail = ((linesObj.pointerTail + 1) % linesObj.pool.length);

      // get line
      line = linesObj.pool[linesObj.pointerTail];

      //line.view.setLine( prevPosition.x, prevPosition.y, newPosition.x, newPosition.y );
      line.view.setRect( 0, -1.5, newPosition.minus( prevPosition ).magnitude() * 1.25, 3 );
      line.view.setRotation( Math.atan2( newPosition.y - prevPosition.y, newPosition.x - prevPosition.x ) );
      line.view.setTranslation( prevPosition );

      line.length = dr;
      this.addChild( line.view );
      this.prevPosition[this.num][spaceObject] = newPosition.copy();

      this.checkLength( spaceObject );
    },
    /**
     * Check length of given planet and remove extra paths.
     *
     * @param {String} spaceObject - Name of space object for which necessary check length.
     */
    checkLength: function( spaceObject ) {
      var num = this.num,
        totalLength = 0,
        maxLength = this.totalLengthMax[num][spaceObject],
        linesObj = this.path[num][spaceObject],
        lines = linesObj.pool,
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
    /**
     * Remove all path for all modes.
     *
     * @param {PropertySet} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
     */
    clearAll: function( model ) {
      var planetPath = this;
      planetPath.removeAllChildren();

      planetPath.num = model.planetMode; // save planet mode value
      planetPath.prevPosition = []; // contains previous positions for all modes
      model.planetModes.forEach( function( planetMode, i ) {
        planetPath.prevPosition[i] = {};
        model.spaceObjects.forEach( function( spaceObject ) {
          planetPath.prevPosition[i][spaceObject] = model[spaceObject].position.copy();

          if ( planetPath.path[planetPath.num][spaceObject] ) {
            planetPath.path[planetPath.num][spaceObject].pool.forEach( function( obj ) {
              obj.length = 0;
            } );
            planetPath.path[planetPath.num][spaceObject].pointerHead = 0;
            planetPath.path[planetPath.num][spaceObject].pointerTail = 0;
          }
        } );
      } );
    },
    /**
     * Remove all path for given mode.
     *
     * @param {PropertySet} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
     * @param {Number} modeIndex - Planet mode number for which necessary to remove all paths.
     */
    clearOne: function( model, modeIndex ) {
      var planetPath = this;
      model.spaceObjects.forEach( function( spaceObject ) {
        if ( planetPath.path[modeIndex][spaceObject] ) {
          planetPath.path[modeIndex][spaceObject].pool.forEach( function( obj ) {
            if ( planetPath.isChild( obj.view ) ) {
              planetPath.removeChild( obj.view );
              obj.length = 0;
            }
          } );

          planetPath.path[modeIndex][spaceObject].pointerHead = 0;
          planetPath.path[modeIndex][spaceObject].pointerTail = 0;

          planetPath.prevPosition[modeIndex][spaceObject] = model[spaceObject].position.copy();
        }
      } );
    },
    /**
     * Hide all path for given mode.
     *
     * @param {PropertySet} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
     * @param {Number} modeIndex - Planet mode number for which necessary to hide all paths.
     */
    hide: function( model, modeIndex ) {
      var planetPath = this;

      model.spaceObjects.forEach( function( spaceObject ) {
        if ( planetPath.path[modeIndex][spaceObject] ) {
          for ( var i = 0, pool = planetPath.path[modeIndex][spaceObject].pool; i < pool.length; i++ ) {
            pool[i].view.setVisible( false );
          }
        }
      } );
    },
    /**
     * Show all path for given mode.
     *
     * @param {PropertySet} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
     * @param {Number} modeIndex - Planet mode number for which necessary to show all paths.
     */
    show: function( model, modeIndex ) {
      var planetPath = this;
      model.spaceObjects.forEach( function( spaceObject ) {
        if ( planetPath.path[modeIndex][spaceObject] ) {
          // show all path for given mode
          for ( var i = 0, pool = planetPath.path[modeIndex][spaceObject].pool; i < pool.length; i++ ) {
            pool[i].view.setVisible( true );
          }

          // set new previous position
          planetPath.prevPosition[modeIndex][spaceObject] = model[spaceObject].position.copy();
        }
      } );
    }
  } );
} );