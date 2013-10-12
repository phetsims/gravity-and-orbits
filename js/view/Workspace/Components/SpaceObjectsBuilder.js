// Copyright 2002-2013, University of Colorado Boulder

/**
 * return view of space objects
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );

  var map = {
    sun: require( 'view/SpaceObject/Sun' ),
    earth: require( 'view/SpaceObject/Earth' ),
    moon: require( 'view/SpaceObject/Moon' ),
    spaceStation: require( 'view/SpaceObject/SpaceStation' )
  };

  function SpaceObjectsBuilder( model, num, state ) {
    var self = this, position, obj = {}, scale = model.planetModes[num].options.scale, timeMode = model.planetModes[num].options.timeMode;
    Node.call( this );

    model.spaceObjects.forEach( function( name ) {
      obj = (state && state[name] ? state[name] : model.planetModes[num][name]);

      // set explosion property
      model[name + 'Exploded'] = (obj ? obj.exploded : false);

      if ( obj && !obj.exploded ) {
        position = new Vector2( obj.x * scale, obj.y * scale );
        // set space object's velocity
        if ( !obj.fixed ) {
          model[name + 'Velocity'].set( obj.velocity.x, obj.velocity.y );
        }

        // add space object
        model[name + 'View'] = new map[name]( position.copy(), obj.radius * scale );
        model[name + 'View'].scale( model.viewMode === model.viewModes[1] ? obj.radiusScaleMode : 1 );
        self.addChild( model[name + 'View'] );

        // set space object's coordinates
        model[name + 'PositionStart'] = position.copy();
        model[name + 'Position'] = position.copy();

        model.timeMode = timeMode;
        model[name + 'View'].setRadius( obj.radius * scale );

        // check tooltip
        model[name + 'Tooltip'].setVisible( ( model[name + 'View'].getWidth() < 10 ) );

        // set space object's mass
        model[name + 'MassCoeff'] = obj.massCoeff || 1;
        model[name + 'Mass'] = obj.mass;

        // set up previous values
        model[name + 'Acceleration'].set( obj.acceleration ? obj.acceleration.x : 0, obj.acceleration ? obj.acceleration.y : 0 );
        model[name + 'VelocityHalf'].set( obj.velocityHalf ? obj.velocityHalf.x : 0, obj.velocityHalf ? obj.velocityHalf.y : 0 );
      }
      else {
        model[name + 'View'] = new Node();
        model[name + 'Tooltip'].setVisible( false );
      }
    } );
  }

  inherit( Node, SpaceObjectsBuilder );

  return SpaceObjectsBuilder;
} );