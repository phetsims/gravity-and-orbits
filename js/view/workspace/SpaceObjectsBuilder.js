// Copyright 2002-2013, University of Colorado Boulder

/**
 * Return space objects in given state.
 * If state is not given - return initial state.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );

  var map = {
    sun: require( 'view/space-object/Sun' ),
    earth: require( 'view/space-object/Earth' ),
    moon: require( 'view/space-object/Moon' ),
    spaceStation: require( 'view/space-object/SpaceStation' )
  };

  function SpaceObjectsBuilder( model, num, state ) {
    var self = this, body, position, obj = {}, scale = model.planetModes[num].options.scale, timeMode = model.planetModes[num].options.timeMode;
    Node.call( this );

    model.spaceObjects.forEach( function( name ) {
      obj = (state && state[name] ? state[name] : model.planetModes[num][name]);
      body = model[name];
      // set explosion property
      body.exploded = (obj ? obj.exploded : false);

      if ( obj && !obj.exploded ) {
        position = new Vector2( obj.x * scale, obj.y * scale );
        // set space object's velocity
        if ( !obj.fixed ) {
          body.velocity.setXY( obj.velocity.x, obj.velocity.y );
        }

        // add space object
        body.view = new map[name]( position.copy(), obj.radius * scale );
        body.view.scale( body.radiusCoeff );
        body.view.scale( model.viewMode === model.viewModes[1] ? obj.radiusScaleMode : 1 );
        self.addChild( body.view );
        body.initDrag = true;

        // set space object's coordinates
        body.positionStart = position.copy();
        body.position = position.copy();

        model.timeMode = timeMode;
        body.view.setRadius( obj.radius * scale );

        // check label
        body.label.setVisible( body.view.getWidth() < 10 );

        // set space object's mass
        body.massCoeff = obj.massCoeff || 1;
        body.mass = obj.mass * body.massCoeff;

        if ( name === 'earth' && body.radiusCoeff !== 1 ) {
          body.view.setGrayView();
        }

        // set up previous values
        body.acceleration.setXY( obj.acceleration ? obj.acceleration.x : 0, obj.acceleration ? obj.acceleration.y : 0 );
        body.velocityHalf.setXY( obj.velocityHalf ? obj.velocityHalf.x : 0, obj.velocityHalf ? obj.velocityHalf.y : 0 );
      }
      else {
        body.view = new Node();
        body.label.setVisible( false );
      }
    } );
  }

  return inherit( Node, SpaceObjectsBuilder );
} );