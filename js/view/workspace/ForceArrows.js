// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of force arrows.
 * It shows the direction of the gravitational force.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' ),
    Node = require( 'SCENERY/nodes/Node' ),
    ArrowNode = require( 'SCENERY_PHET/ArrowNode' ),
    MutableArrowNode = require( 'SCENERY_PHET/MutableArrowNode' ),
    ArrowShape = require( 'SCENERY_PHET/ArrowShape' );

  function ForceArrows( model ) {
    var self = this, prevPosition = {}, hided;
    Node.call( this );

    this.init( model ); // prepare component for work

    // controls the visibility and direction of arrows
    var checkArrows = function() {
      if ( model.forceArrow ) { // if arrows visible - set new shapes
        self.setArrows( model );
        hided = false;
      }
      else if ( !hided ) { // hide arrows if it is not visible and not hided yet
        self.hideArrows( model );
        hided = true;
      }
    };

    // add observers for space objects
    model.spaceObjects.forEach( function( el ) {
      prevPosition[el] = model[el].position.copy();

      // add position property observer
      model[el].positionProperty.link( function( newPosition ) {
        // update force arrow if position was changed significantly
        if ( newPosition.minus( prevPosition[el] ).magnitude() > 0.5 ) {
          prevPosition[el] = newPosition.copy();
          checkArrows();
        }
      } );
    } );

    // check force arrow if visibility changed
    model.forceArrowProperty.link( checkArrows );

    // check force arrow if planet mode was changed
    model.planetModeProperty.link( checkArrows );

    // check force arrow if mass or view was changed
    model.spaceObjects.forEach( function( el ) {
      model[el].massProperty.link( checkArrows );
    } );
  }

  // find max value of gravitational force for given planet mode
  var getMaxForce = function( model, num ) {
    var mode = model.planetModes[num], obj1, obj2, len = model.spaceObjects.length, i, j, f, scale = model.planetModes[num].options.scale, maxForce = 1;

    for ( i = 0; i < len; i++ ) {
      obj1 = model.spaceObjects[i];
      if ( !mode[obj1] ) {continue;}  // take next object if current doesn't exist for given mode
      for ( j = i + 1; j < len; j++ ) {
        obj2 = model.spaceObjects[j];
        if ( !mode[obj2] ) {continue;} // take next object if current doesn't exist for given mode

        // find force between obj1 and obj2
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

      // prepare shapes of arrows
      this.shapes = {};
      for ( i = 0; i < model.spaceObjects.length; i++ ) {
        for ( j = 0; j < model.spaceObjects.length; j++ ) {
          if ( i !== j ) {
            this.shapes[model.spaceObjects[i] + model.spaceObjects[j]] = new MutableArrowNode( 0, 0, 0, 0, {fill: '#4380C2'} );
            this.addChild( this.shapes[model.spaceObjects[i] + model.spaceObjects[j]] );
          }
        }
      }
    },
    // hide force arrow for space object with given name
    hideOne: function( model, name ) {
      for ( var i = 0; i < model.spaceObjects.length; i++ ) {
        if ( name !== model.spaceObjects[i] ) {
          this.shapes[name + model.spaceObjects[i]].setTailAndTip( 0, 0, 0, 0 );
          this.shapes[model.spaceObjects[i] + name].setTailAndTip( 0, 0, 0, 0 );
        }
      }
    },
    // hide all force arrows
    hideArrows: function( model ) {
      var i, j, len = model.spaceObjects.length;
      for ( i = 0; i < len; i++ ) {
        for ( j = 0; j < len; j++ ) {
          if ( i !== j ) {
            this.shapes[model.spaceObjects[i] + model.spaceObjects[j]].setTailAndTip( 0, 0, 0, 0 );
          }
        }
      }
    },
    // show all force arrows and set new shapes
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

        // hide space object if it doesn't exist or exploded
        if ( !mode[obj1] || body1.exploded ) {
          self.hideOne( model, obj1 );
          continue;
        }

        for ( var j = i + 1; j < len; j++ ) {
          obj2 = model.spaceObjects[j];
          body2 = model[obj2];

          // hide space object if it doesn't exist or exploded
          if ( !mode[obj2] || body2.exploded ) {
            self.hideOne( model, obj2 );
            continue;
          }

          distance = body2.position.minus( body1.position );
          if ( !distance.magnitude() ) {
            self.hideOne( model, obj2 );
            continue;
          }

          f = body2.mass * body1.mass / (distance.magnitudeSquared());
          arrowSize = Math.max( 60 * f / maxForce, 10 );

          unitVector = distance.normalized().multiply( arrowSize );

          // add arrow from obj1 to obj2
          self.shapes[obj1 + obj2].setTailAndTip( body1.position.x, body1.position.y, body1.position.x + unitVector.x, body1.position.y + unitVector.y );
          // add arrow from obj2 to obj1
          self.shapes[obj2 + obj1].setTailAndTip( body2.position.x, body2.position.y, body2.position.x - unitVector.x, body2.position.y - unitVector.y );
        }
      }
    }
  } );
} );