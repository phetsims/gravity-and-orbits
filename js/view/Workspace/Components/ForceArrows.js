// Copyright 2002-2013, University of Colorado Boulder

/**
 * force arrows view
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );


  function ForceArrows( model, num ) {
    var self = this;
    this.num = num;
    Node.call( this );

    // find max force for current mode
    this.maxForce = {};
    this.maxForce[this.num] = this.findMaxForce( model );

    // define redraw function
    this.redraw = function( newPosition ) {
      if ( self.prevPosition[self.el].minus( newPosition ).magnitude() > 1 ) {
        self.removeAllChildren();
        self.addArrows( model );
        self.prevPosition[self.el] = newPosition;
      }
    };

    // add observers for space object's position
    self.prevPosition = {};
    model.spaceObjects.forEach( function( el ) {
      self.el = el;
      self.prevPosition[el] = model[el + 'Position'];
      model[el + 'PositionProperty'].link( self.redraw );
    } );

    // add arrows
    this.addArrows( model );
  }

  inherit( Node, ForceArrows );

  ForceArrows.prototype.addArrows = function( model ) {
    var self = this,
      num = self.num,
      maxForce = self.maxForce[num],
      mode = model.planetModes[num],
      arrowSize = 10,
      len = model.spaceObjects.length,
      distance,
      f,
      obj1,
      obj2,
      unitVector;

    for ( var i = 0; i < len; i++ ) {
      obj1 = model.spaceObjects[i];
      if ( !mode[obj1] || mode[obj1 + 'Exploded'] ) {continue;}
      for ( var j = i + 1; j < len; j++ ) {
        obj2 = model.spaceObjects[j];
        if ( !mode[obj2] || mode[obj2 + 'Exploded'] ) {continue;}
        distance = model[obj2 + 'Position'].minus( model[obj1 + 'Position'] );
        if ( !distance.magnitude() ) {continue;}

        f = model[obj2 + 'Mass'] * model[obj1 + 'Mass'] / (distance.magnitude() * distance.magnitude());
        arrowSize = 60 * f / maxForce;
        arrowSize = Math.max( arrowSize, 10 );

        unitVector = distance.normalized();

        self.addChild( new ArrowNode( model[obj1 + 'Position'].x, model[obj1 + 'Position'].y, model[obj1 + 'Position'].x + unitVector.x * arrowSize, model[obj1 + 'Position'].y + unitVector.y * arrowSize, {fill: '#4380C2'} ) );
        self.addChild( new ArrowNode( model[obj2 + 'Position'].x, model[obj2 + 'Position'].y, model[obj2 + 'Position'].x - unitVector.x * arrowSize, model[obj2 + 'Position'].y - unitVector.y * arrowSize, {fill: '#4380C2'} ) );
      }
    }
  };

  ForceArrows.prototype.findMaxForce = function( model ) {
    var num = this.num, mode = model.planetModes[num], obj1, obj2, len = model.spaceObjects.length, i, j, f, scale = model.planetModes[num].options.scale, maxForce = 1;
    for ( i = 0; i < len; i++ ) {
      obj1 = model.spaceObjects[i];
      if ( !mode[obj1] ) {continue;}
      for ( j = i + 1; j < len; j++ ) {
        obj2 = model.spaceObjects[j];
        if ( !mode[obj2] ) {continue;}
        f = mode[obj1].mass * mode[obj2].mass / (Math.pow( (mode[obj1].x - mode[obj2].x) * scale, 2 ) + Math.pow( (mode[obj1].y - mode[obj2].y) * scale, 2 ));
        maxForce = Math.max( maxForce, f );
      }
    }
    return maxForce;
  };

  ForceArrows.prototype.unlink = function( model ) {
    var self = this;
    model.spaceObjects.forEach( function( el ) {
      model[el + 'PositionProperty'].unlink( self.redraw );
    } );
  };

  return ForceArrows;
} );