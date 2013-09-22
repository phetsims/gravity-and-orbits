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
    var self = this, i, obj = {}, scale = model.planetModes[num].options.scale;
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
      }
    }

    // create link mass to radius
    /*model.spaceObjects.forEach( function( el ) {
     if ( model.planetModes[num][el] ) {
     var defaultRadius = model.planetModes[num][el].radius;
     model[el + 'MassProperty'].link( function( newValue, oldValue ) {

     //Math.pow( newValue, 1 / 3 );

     console.log(Math.pow( newValue, 1 / 3 ));

     //model[model.spaceObjects[i] + 'Radius'] =

     if ( oldValue ) {
     self[el].scale( 1 / oldValue );
     }
     //self[el].scale( model[el + 'Radius'] / defaultRadius );
     //console.log( defaultRadius, model[el + 'Radius'] );
     } );

     model[model.spaceObjects[i] + 'RadiusProperty'].link( function() {

     } );
     }
     } ); */
  }

  inherit( Node, WorkspaceBuilder );

  return WorkspaceBuilder;
} );