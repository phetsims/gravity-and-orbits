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
   * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
   * @constructor
   */
  function PlanetPath( model ) {
    var thisNode = this;
    Node.call( this );

    // color for space object's paths
    thisNode.color = {
      sun: 'yellow',
      earth: 'gray',
      moon: 'magenta',
      spaceStation: 'gray'
    };

    // max length of paths
    thisNode.totalLengthMax = [
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
    thisNode.prevPosition = [];
    thisNode.path = [];

    // init path view for each space object
    this.totalLengthMax.forEach( function( planetLength, i ) {
      var pathLength;

      thisNode.path[i] = {};
      for ( var planet in planetLength ) {
        if ( planetLength.hasOwnProperty( planet ) && planetLength[planet] ) {
          pathLength = planetLength[planet];
          thisNode.path[i][planet] = {
            index: 0,
            length: 0,
            pool: []
          };
        }
      }
    } );

    thisNode.clearAll( model );

    model.spaceObjects.forEach( function( spaceObject ) {
      var body = model[spaceObject];

      // add position property observer
      model[spaceObject].positionProperty.link( function() {
        if ( !body.exploded && model.path && model.planetMode === thisNode.num && model.drag !== spaceObject && thisNode.totalLengthMax[thisNode.num][spaceObject] > 0 ) {
          var newPosition = body.position,
            dr = newPosition.minus( thisNode.prevPosition[thisNode.num][spaceObject] ).magnitude();

          // add new piece of path if position was changed significantly
          if ( dr > SINGLE_PATH_SEGMENT_LENGTH ) {
            thisNode.add( model, spaceObject, newPosition, dr );
          }
        }
      } );
    } );

    // clear path if visibility changed
    model.pathProperty.link( function() {
      thisNode.clearAll( model );
    } );

    model.planetModeProperty.link( function( num ) {
      // hide previous path
      thisNode.hide( model, thisNode.num );

      // show current path
      thisNode.show( model, thisNode.num = num );
    } );

    // clear path if refresh was called
    model.refreshModeProperty.link( function( trigger ) {
      if ( trigger ) {
        thisNode.clearOne( model, thisNode.num );
      }
    } );

    // clear path if rewind was called
    model.rewindProperty.link( function( isRewind ) {
      if ( isRewind ) {
        thisNode.clearOne( model, thisNode.num );
      }
    } );
  }

  return inherit( Node, PlanetPath, {
    /**
     * Add new piece of path for given element.
     *
     * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
     * @param {String} spaceObject - Name of space object for which necessary add new piece of path.
     * @param {Vector2} newPosition - New space object position.
     * @param {Number} dr - Length between previous and new position.
     */
    add: function( model, spaceObject, newPosition, dr ) {
      var prevPosition = this.prevPosition[this.num][spaceObject];
      var linesObj = this.path[this.num][spaceObject];
      var lineSegment;

      if ( linesObj.length < this.totalLengthMax[this.num][spaceObject] ) {
        lineSegment = new Rectangle( 0, -1.5, newPosition.minus( prevPosition ).magnitude() + 1, 3, { fill: this.color[spaceObject] } );
        linesObj.pool.push( lineSegment );
        linesObj.length += dr;
        this.addChild( lineSegment );
      }
      else {
        lineSegment = linesObj.pool[linesObj.index++];
        linesObj.index %= linesObj.pool.length;
        lineSegment.setRect( 0, -1.5, newPosition.minus( prevPosition ).magnitude() + 1, 3 );
      }

      lineSegment.setRotation( Math.atan2( newPosition.y - prevPosition.y, newPosition.x - prevPosition.x ) );
      lineSegment.setTranslation( prevPosition );

      this.prevPosition[this.num][spaceObject] = newPosition.copy();
    },

    /**
     * Remove all path for all modes.
     *
     * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
     */
    clearAll: function( model ) {
      var thisNode = this;
      thisNode.removeAllChildren();

      thisNode.num = model.planetMode; // save planet mode value
      thisNode.prevPosition = []; // contains previous positions for all modes
      model.planetModes.forEach( function( planetMode, i ) {
        thisNode.prevPosition[i] = {};
        model.spaceObjects.forEach( function( spaceObject ) {
          thisNode.prevPosition[i][spaceObject] = model[spaceObject].position.copy();

          if ( thisNode.path[thisNode.num][spaceObject] ) {
            thisNode.path[thisNode.num][spaceObject].pool.forEach( function( obj ) {
              obj.length = 0;
            } );
            thisNode.path[thisNode.num][spaceObject].index = 0;
            thisNode.path[thisNode.num][spaceObject].length = 0;
          }
        } );
      } );
    },
    /**
     * Remove all path for given mode.
     *
     * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
     * @param {Number} modeIndex - Planet mode number for which necessary to remove all paths.
     */
    clearOne: function( model, modeIndex ) {
      var thisNode = this;
      model.spaceObjects.forEach( function( spaceObject ) {
        if ( thisNode.path[modeIndex][spaceObject] ) {
          thisNode.path[modeIndex][spaceObject].pool.forEach( function( obj ) {
            if ( thisNode.isChild( obj ) ) {
              thisNode.removeChild( obj );
            }
          } );

          thisNode.path[modeIndex][spaceObject].index = 0;
          thisNode.path[modeIndex][spaceObject].length = 0;

          thisNode.prevPosition[modeIndex][spaceObject] = model[spaceObject].position.copy();
        }
      } );
    },
    /**
     * Hide all path for given mode.
     *
     * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
     * @param {Number} modeIndex - Planet mode number for which necessary to hide all paths.
     */
    hide: function( model, modeIndex ) {
      var thisNode = this;

      model.spaceObjects.forEach( function( spaceObject ) {
        if ( thisNode.path[modeIndex][spaceObject] ) {
          for ( var i = 0, pool = thisNode.path[modeIndex][spaceObject].pool; i < pool.length; i++ ) {
            pool[i].setVisible( false );
          }
        }
      } );
    },
    /**
     * Show all path for given mode.
     *
     * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
     * @param {Number} modeIndex - Planet mode number for which necessary to show all paths.
     */
    show: function( model, modeIndex ) {
      var thisNode = this;
      model.spaceObjects.forEach( function( spaceObject ) {
        if ( thisNode.path[modeIndex][spaceObject] ) {
          // show all path for given mode
          for ( var i = 0, pool = thisNode.path[modeIndex][spaceObject].pool; i < pool.length; i++ ) {
            pool[i].setVisible( true );
          }

          // set new previous position
          thisNode.prevPosition[modeIndex][spaceObject] = model[spaceObject].position.copy();
        }
      } );
    }
  } );
} );