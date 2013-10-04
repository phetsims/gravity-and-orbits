// Copyright 2002-2013, University of Colorado Boulder

/**
 * space object's path view
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

    // max length of paths
    self.totalLengthMax = [
      {
        sun: 3000,
        earth: 3000
      },
      {
        sun: 1400,
        earth: 1200,
        moon: 1350
      },
      {
        earth: 0,
        moon: 920
      },
      {
        earth: 1400,
        spaceStation: 850
      }
    ];

    // variables for each space object
    self.prevPosition = {};
    self.totalLength = {};
    self.path = {};

    // add observers for space object's positions
    self.clearPath( model );
    model.spaceObjects.forEach( function( el ) {
      model[el + 'PositionProperty'].link( function( newPosition ) {
        var dr = newPosition.minus( self.prevPosition[el][self.prevPosition[el].length - 1] ).magnitude(), num = model.planetMode;
        if ( dr > 2 && self.flag ) {
          self.addPath( el, newPosition );
          self.totalLength[el] += dr;
          self.checkLength( el );
        }
      } );
    } );

    model.pathProperty.link( function( flag ) {
      self.clearPath( model );
      self.flag = flag;
    } );

    model.planetModeProperty.link( function( num ) {
      self.clearPath( model );
      self.num = num;
    } );
  }

  inherit( Node, PlanetPath );

  PlanetPath.prototype.addPath = function( el, newPosition ) {
    var prevPosition = this.prevPosition[el][this.prevPosition[el].length - 1],
      path = new Path( new Shape().moveTo( prevPosition.x, prevPosition.y ).lineTo( newPosition.x, newPosition.y ), {stroke: this.color[el], lineWidth: 3} );

    this.path[el].push( path );
    this.addChild( path );
    this.prevPosition[el].push( newPosition );
  };

  PlanetPath.prototype.checkLength = function( el ) {
    var dr, num = this.num;
    while ( this.totalLength[el] > this.totalLengthMax[num][el] ) {
      dr = this.prevPosition[el][0].minus( this.prevPosition[el][1] ).magnitude();
      this.prevPosition[el].shift();
      this.removeChild( this.path[el].shift() );
      this.totalLength[el] -= dr;
    }
  };

  PlanetPath.prototype.clearPath = function( model ) {
    var self = this;
    self.removeAllChildren();
    model.spaceObjects.forEach( function( el ) {
      self.prevPosition[el] = [model[el + 'Position']];
      self.totalLength[el] = 0;
      self.path[el] = [];
    } );
  };

  return PlanetPath;
} );