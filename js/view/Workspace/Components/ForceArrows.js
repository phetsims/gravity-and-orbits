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
  var ArrowShape = require( 'SCENERY_PHET/ArrowShape' );

  function ForceArrows( model ) {
    var self = this, prevPosition = {};
    Node.call( this );

    this.init( model );

    var drawArrows = function() {
      if ( self.flag ) {
        self.setArrows( model );
      }
      else {
        self.hideArrows( model );
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

  ForceArrows.prototype.init = function( model ) {
    // find max force for all modes
    this.maxForce = [];
    for ( var i = 0, j; i < model.planetModes.length; i++ ) {
      this.maxForce[i] = getMaxForce( model, i );
    }

    // prepare shapes
    this.shapes = {};
    for ( i = 0; i < model.spaceObjects.length; i++ ) {
      for ( j = 0; j < model.spaceObjects.length; j++ ) {
        if ( i !== j ) {
          this.shapes[model.spaceObjects[i] + model.spaceObjects[j]] = new ArrowNode( 0, 0, 0, 0, {fill: '#4380C2'} );
          this.addChild( this.shapes[model.spaceObjects[i] + model.spaceObjects[j]] );
        }
      }
    }
  };

  ForceArrows.prototype.hideOne = function( model, name ) {
    for ( var i = 0; i < model.spaceObjects.length; i++ ) {
      if ( name !== model.spaceObjects[i] ) {
        this.shapes[name + model.spaceObjects[i]].setShape( new ArrowShape( 0, 0, 0, 0 ) );
        this.shapes[model.spaceObjects[i] + name].setShape( new ArrowShape( 0, 0, 0, 0 ) );
      }
    }
  };

  ForceArrows.prototype.hideArrows = function( model ) {
    var i, j;
    for ( i = 0; i < model.spaceObjects.length; i++ ) {
      for ( j = 0; j < model.spaceObjects.length; j++ ) {
        if ( i !== j ) {
          this.shapes[model.spaceObjects[i] + model.spaceObjects[j]].setShape( new ArrowShape( 0, 0, 0, 0 ) );
        }
      }
    }
  };

  ForceArrows.prototype.setArrows = function( model ) {
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

      if ( !mode[obj1] || model[obj1 + 'Exploded'] ) {
        self.hideOne( model, obj1 );
        continue;
      }

      for ( var j = i + 1; j < len; j++ ) {
        obj2 = model.spaceObjects[j];
        if ( !mode[obj2] || model[obj2 + 'Exploded'] ) {
          self.hideOne( model, obj2 );
          continue;
        }

        distance = model[obj2 + 'Position'].minus( model[obj1 + 'Position'] );
        if ( !distance.magnitude() ) {
          self.hideOne( model, obj2 );
          continue;
        }

        f = model[obj2 + 'Mass'] * model[obj1 + 'Mass'] / (distance.magnitude() * distance.magnitude());
        arrowSize = 60 * f / maxForce;
        arrowSize = Math.max( arrowSize, 10 );

        unitVector = distance.normalized();

        self.shapes[obj1 + obj2].setShape( new ArrowShape( model[obj1 + 'Position'].x, model[obj1 + 'Position'].y, model[obj1 + 'Position'].x + unitVector.x * arrowSize, model[obj1 + 'Position'].y + unitVector.y * arrowSize ) );
        self.shapes[obj2 + obj1].setShape( new ArrowShape( model[obj2 + 'Position'].x, model[obj2 + 'Position'].y, model[obj2 + 'Position'].x - unitVector.x * arrowSize, model[obj2 + 'Position'].y - unitVector.y * arrowSize ) );
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