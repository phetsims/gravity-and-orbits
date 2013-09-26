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

  function ForceArrows( model ) {
    var self = this, prevPosition = {};
    Node.call( this );

    // find max force for all modes
    this.maxForce = [];
    for ( var i = 0; i < model.planetModes.length; i++ ) {
      this.maxForce[i] = getMaxForce( model, i );
    }

    var drawArrows = function() {
      self.removeAllChildren();
      if ( self.flag ) {
        self.addArrows( model );
      }
    };

    model.spaceObjects.forEach( function( el ) {
      prevPosition[el] = model[el + 'Position'];
      model[el + 'PositionProperty'].link( function( newPosition ) {
        if ( newPosition.minus( prevPosition[el] ).magnitude() > 1 ) {
          prevPosition[el] = newPosition;
          drawArrows();
        }
      } );
    } );

    model.forceArrowProperty.link( function( flag ) {
      self.flag = flag;
      drawArrows();
    } );

    model.planetModeProperty.link( function() {
      drawArrows();
    } );
  }

  inherit( Node, ForceArrows );

  ForceArrows.prototype.addArrows = function( model ) {
    var self = this,
      num = model.planetMode,
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

  var getMaxForce = function( model, num ) {
    var mode = model.planetModes[num], obj1, obj2, len = model.spaceObjects.length, i, j, f, scale = model.planetModes[num].options.scale, maxForce = 1;
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

  return ForceArrows;
} );