// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of force arrows.
 * It shows the direction of the gravitational force.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );
  var MutableArrowNode = require( 'SCENERY_PHET/MutableArrowNode' );

  /**
   * @param model {PropertySet} Contains set of properties. Instance of PropertySet class. General model for the whole application.
   */
  function ForceArrows( model ) {
    var forceArrows = this, prevPosition = {}, hidden;
    Node.call( this );

    // find max force for all modes
    this.maxForce = [];
    for ( var i = 0; i < model.planetModes.length; i++ ) {
      this.maxForce[i] = getMaxForce( model, i );
    }

    // prepare shapes of arrows
    this.shapes = {};
    for ( i = 0; i < model.spaceObjects.length; i++ ) {
      this.shapes[model.spaceObjects[i]] = new MutableArrowNode( 0, 0, 0, 0, {fill: '#4380C2', headHeightMaximumHalf: true} );
      this.addChild( this.shapes[model.spaceObjects[i]] );
    }

    // controls the visibility and direction of arrows
    var checkArrows = function() {
      if ( model.forceArrow && model.gravity ) { // if arrows visible - set new shapes
        forceArrows.setArrows( model );
        hidden = false;
      }
      else if ( !hidden ) { // hide arrows if it is not visible and not hided yet
        forceArrows.hideArrows( model );
        hidden = true;
      }
    };

    // add observers for space objects
    model.spaceObjects.forEach( function( spaceObject ) {
      prevPosition[spaceObject] = model[spaceObject].position.copy();

      // add position property observer
      model[spaceObject].positionProperty.link( function( newPosition ) {
        // update force arrow if position was changed significantly
        if ( newPosition.minus( prevPosition[spaceObject] ).magnitude() > 0.5 ) {
          prevPosition[spaceObject] = newPosition.copy();
          checkArrows();
        }
      } );
    } );

    // check force arrow if visibility changed
    model.forceArrowProperty.link( checkArrows );

    // check force arrow if planet mode was changed
    model.planetModeProperty.link( checkArrows );

    // check force arrow if gravity mode was changed
    model.gravityProperty.link( checkArrows );

    // check force arrow if mass or view was changed
    model.spaceObjects.forEach( function( spaceObject ) {
      model[spaceObject].massProperty.link( checkArrows );
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
    // hide force arrow for space object with given name
    hideOne: function( model, name ) {
      this.shapes[name].setTailAndTip( 0, 0, 0, 0 );
    },
    // hide all force arrows
    hideArrows: function( model ) {
      for ( var i = 0; i < model.spaceObjects.length; i++ ) {
        this.shapes[model.spaceObjects[i]].setTailAndTip( 0, 0, 0, 0 );
      }
    },
    // show all force arrows and set new shapes
    setArrows: function( model ) {
      var forceArrows = this,
        num = model.planetMode,
        maxForce = forceArrows.maxForce[num],
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
        unitVector = new Vector2( 0, 0 );

        // hide space object if it doesn't exist or exploded
        if ( !mode[obj1] || body1.exploded ) {
          forceArrows.hideOne( model, obj1 );
          continue;
        }

        // calculate sum force
        for ( var j = 0; j < len; j++ ) {
          obj2 = model.spaceObjects[j];
          body2 = model[obj2];

          // objects shouldn't be the same and obj2 should exist
          if ( obj1 === obj2 || !mode[obj2] || body2.exploded ) {
            continue;
          }

          distance = body2.position.minus( body1.position );
          if ( !distance.magnitude() ) {
            continue;
          }

          f = body2.mass * body1.mass / (distance.magnitudeSquared());
          unitVector.add( distance.normalized().multiply( f ) );
        }

        // add arrow for obj1
        if ( unitVector.magnitude() ) {
          arrowSize = Math.max( 60 * unitVector.magnitude() / maxForce, 10 );
          unitVector.set( unitVector.normalized().multiply( arrowSize ) );

          forceArrows.shapes[obj1].setTailAndTip( body1.position.x, body1.position.y, body1.position.x + unitVector.x, body1.position.y + unitVector.y );
        }
        else {
          forceArrows.hideOne( model, obj1 );
        }
      }
    }
  } );
} );