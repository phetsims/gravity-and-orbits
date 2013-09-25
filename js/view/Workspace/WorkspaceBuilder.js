// Copyright 2002-2013, University of Colorado Boulder

/**
 * main object view
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  var Sun = require( 'view/SpaceObject/Sun' );
  var Earth = require( 'view/SpaceObject/Earth' );
  var Moon = require( 'view/SpaceObject/Moon' );
  var SpaceStation = require( 'view/SpaceObject/SpaceStation' );

  function WorkspaceBuilder( model, num ) {
    var self = this, i, obj = {}, scale = model.planetModes[num].options.scale, timeMode = model.planetModes[num].options.timeMode;
    Node.call( this );

    var map = {
      sun: Sun,
      earth: Earth,
      moon: Moon,
      spaceStation: SpaceStation
    };

    // set scale center
    model.scaleCenter.set( model.planetModes[num].options.centerX, model.planetModes[num].options.centerY );

    // add planets
    for ( i = 0; i < model.spaceObjects.length; i++ ) {
      obj = model.planetModes[num][model.spaceObjects[i]];
      if ( obj ) {
        // set space object's coordinates
        model[model.spaceObjects[i] + 'PositionStart'].set( obj.x * scale, obj.y * scale );
        model[model.spaceObjects[i] + 'Position'].set( obj.x * scale, obj.y * scale );

        // set space object's velocity
        if ( obj.velocity ) {
          model[model.spaceObjects[i] + 'Velocity'].set( obj.velocity.x, obj.velocity.y );
        }
        else {
          model[model.spaceObjects[i] + 'Velocity'].set( 0, 0 );
        }

        // set space object's mass
        model[model.spaceObjects[i] + 'MassCoeffProperty'].reset();
        model[model.spaceObjects[i] + 'Mass'] = obj.mass;

        // set space object's radius
        model[model.spaceObjects[i] + 'Radius'] = obj.radius;

        // add space object
        model[model.spaceObjects[i] + 'View'] = new map[model.spaceObjects[i]]( model[model.spaceObjects[i] + 'Position'], obj.radius * scale );
        this.addChild( model[model.spaceObjects[i] + 'View'] );

        // clean up previous values
        model[model.spaceObjects[i] + 'Acceleration'].set( 0, 0 );
        model[model.spaceObjects[i] + 'VelocityHalf'].set( 0, 0 );
        model[model.spaceObjects[i] + 'Exploded'] = false;

        model.timeMode = timeMode;
      }
      else {
        model[model.spaceObjects[i] + 'View'] = new Node();
      }
    }
  }

  inherit( Node, WorkspaceBuilder );

  return WorkspaceBuilder;
} );