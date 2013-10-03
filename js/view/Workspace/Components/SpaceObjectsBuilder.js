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

  var Sun = require( 'view/SpaceObject/Sun' );
  var Earth = require( 'view/SpaceObject/Earth' );
  var Moon = require( 'view/SpaceObject/Moon' );
  var SpaceStation = require( 'view/SpaceObject/SpaceStation' );

  function SpaceObjectsBuilder( model, num ) {
    var self = this, i, name, obj = {}, scale = model.planetModes[num].options.scale, timeMode = model.planetModes[num].options.timeMode, modeCoeff;
    Node.call( this );

    var map = {
      sun: Sun,
      earth: Earth,
      moon: Moon,
      spaceStation: SpaceStation
    };

    // add planets
    for ( i = 0; i < model.spaceObjects.length; i++ ) {
      name = model.spaceObjects[i];
      obj = model.planetModes[num][name];
      if ( obj ) {
        // set space object's coordinates
        model[name + 'PositionStart'] = new Vector2( obj.x * scale, obj.y * scale );
        model[name + 'Position'] = new Vector2( obj.x * scale, obj.y * scale );

        // set space object's velocity
        if ( obj.velocity ) {
          model[name + 'Velocity'].set( obj.velocity.x, obj.velocity.y );
        }
        else {
          model[name + 'Velocity'].set( 0, 0 );
        }

        // set space object's mass
        model[name + 'MassCoeffProperty'].reset();
        model[name + 'Mass'] = obj.mass;

        // set space object's radius
        if ( model.viewMode === model.viewModes[0] ) {
          modeCoeff = 1;
        }
        else if ( model.viewMode === model.viewModes[1] ) {
          modeCoeff = obj.radiusScaleMode;
        }

        // add space object
        model[name + 'View'] = new map[name]( model[name + 'Position'], obj.radius * scale );
        model[name + 'View'].scale( modeCoeff );
        this.addChild( model[name + 'View'] );

        // check tooltip
        model[name + 'Tooltip'].setVisible( ( model[name + 'View'].getWidth() < 10 ) );

        // clean up previous values
        model[name + 'Acceleration'].set( 0, 0 );
        model[name + 'VelocityHalf'].set( 0, 0 );
        model[name + 'Exploded'] = false;

        model.timeMode = timeMode;
      }
      else {
        model[name + 'View'] = new Node();
        model[name + 'Tooltip'].setVisible( false );
      }
    }
  }

  inherit( Node, SpaceObjectsBuilder );

  return SpaceObjectsBuilder;
} );