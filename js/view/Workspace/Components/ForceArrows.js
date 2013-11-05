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
      self[(self.visibility ? 'set' : 'hide') + 'Arrows']( model );
    };

    model.spaceObjects.forEach( function( el ) {
      prevPosition[el] = model[el].position;
      model[el].positionProperty.link( function( newPosition ) {
        if ( newPosition.minus( prevPosition[el] ).magnitude() > 1 ) {
          prevPosition[el] = newPosition;
          drawArrows();
        }
      } );
    } );

    model.forceArrowProperty.link( function( visibility ) {
      self.visibility = visibility;
      drawArrows();
    } );

    model.planetModeProperty.link( function() {
      drawArrows();
    } );
  }

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

  return inherit( Node, ForceArrows, {
    init: function( model ) {
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
    },
    hideOne: function( model, name ) {
      var hidedShape = new ArrowShape( 0, 0, 0, 0 );
      for ( var i = 0; i < model.spaceObjects.length; i++ ) {
        if ( name !== model.spaceObjects[i] ) {
          this.shapes[name + model.spaceObjects[i]].setShape( hidedShape );
          this.shapes[model.spaceObjects[i] + name].setShape( hidedShape );
        }
      }
    },
    hideArrows: function( model ) {
      var i, j, hidedShape = new ArrowShape( 0, 0, 0, 0 );
      for ( i = 0; i < model.spaceObjects.length; i++ ) {
        for ( j = 0; j < model.spaceObjects.length; j++ ) {
          if ( i !== j ) {
            this.shapes[model.spaceObjects[i] + model.spaceObjects[j]].setShape( hidedShape );
          }
        }
      }
    },
    setArrows: function( model ) {
      var self = this,
        num = model.planetMode,
        maxForce = self.maxForce[num],
        mode = model.planetModes[num],
        arrowSize = 10,
        len = model.spaceObjects.length,
        distance,
        f,
        obj1, body1,
        obj2, body2,
        unitVector;

      for ( var i = 0; i < len; i++ ) {
        obj1 = model.spaceObjects[i];
        body1 = model[obj1];

        if ( !mode[obj1] || body1.exploded ) {
          self.hideOne( model, obj1 );
          continue;
        }

        for ( var j = i + 1; j < len; j++ ) {
          obj2 = model.spaceObjects[j];
          body2 = model[obj2];
          if ( !mode[obj2] || body2.exploded ) {
            self.hideOne( model, obj2 );
            continue;
          }

          distance = body2.position.minus( body1.position );
          if ( !distance.magnitude() ) {
            self.hideOne( model, obj2 );
            continue;
          }

          f = body2.mass * body1.mass / (distance.magnitude() * distance.magnitude());
          arrowSize = Math.max( 60 * f / maxForce, 10 );

          unitVector = distance.normalized().timesScalar( arrowSize );

          self.shapes[obj1 + obj2].setShape( new ArrowShape( body1.position.x, body1.position.y, body1.position.x + unitVector.x, body1.position.y + unitVector.y ) );
          self.shapes[obj2 + obj1].setShape( new ArrowShape( body2.position.x, body2.position.y, body2.position.x - unitVector.x, body2.position.y - unitVector.y ) );
        }
      }
    }
  } );
} );