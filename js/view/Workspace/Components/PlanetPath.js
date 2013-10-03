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
    self.shape = {};

    // function to update paths
    var drawPath = function() {
      self.removeAllChildren();
      if ( self.flag ) {
        self.addPath( model );
      }
    };

    // add observers for space object's positions
    self.clearPath( model );
    model.spaceObjects.forEach( function( el ) {
      model[el + 'PositionProperty'].link( function( newPosition ) {
        var dr = newPosition.minus( self.prevPosition[el][self.prevPosition[el].length - 1] ).magnitude(), num = model.planetMode;
        if ( dr > 2 && self.flag ) {
          self.prevPosition[el].push( newPosition );
          self.totalLength[el] += dr;
          if ( self.totalLength[el] > self.totalLengthMax[num][el] ) {
            self.cutPoints( el, num );
          }
          drawPath();
        }
      } );
    } );

    model.pathProperty.link( function( flag ) {
      self.flag = flag;
      self.clearPath( model );
      drawPath();
    } );

    model.planetModeProperty.link( function() {
      self.clearPath( model );
      drawPath();
    } );
  }

  inherit( Node, PlanetPath );

  PlanetPath.prototype.addPath = function( model ) {
    var self = this,
      num = model.planetMode,
      mode = model.planetModes[num],
      obj, points, shape;

    self.removeAllChildren();
    for ( var i = 0, len1 = model.spaceObjects.length; i < len1; i++ ) {
      obj = model.spaceObjects[i];
      if ( !mode[obj] || mode[obj + 'Exploded'] ) {continue;}
      points = self.prevPosition[obj];
      shape = new Shape();
      for ( var j = 0, len2 = points.length - 1; j < len2; j++ ) {
        shape = shape.moveTo( points[j].x, points[j].y ).lineTo( points[j + 1].x, points[j + 1].y );
      }
      self.addChild( new Path( shape, {stroke: self.color[obj], lineWidth: 3} ) );
    }
  };

  PlanetPath.prototype.cutPoints = function( el, num ) {
    var dr;
    while ( this.totalLength[el] > this.totalLengthMax[num][el] ) {
      dr = this.prevPosition[el][0].minus( this.prevPosition[el][1] ).magnitude();
      this.prevPosition[el].shift();
      this.totalLength[el] -= dr;
    }
  };

  PlanetPath.prototype.clearPath = function( model ) {
    var self = this;
    model.spaceObjects.forEach( function( el ) {
      self.prevPosition[el] = [model[el + 'Position']];
      self.totalLength[el] = 0;
    } );
  };

  return PlanetPath;
} );