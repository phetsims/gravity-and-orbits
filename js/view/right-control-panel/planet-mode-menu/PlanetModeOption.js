// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of single planet mode option button.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Sun = require( 'view/space-object/Sun' );
  var Earth = require( 'view/space-object/Earth' );
  var Moon = require( 'view/space-object/Moon' );
  var SpaceStation = require( 'view/space-object/SpaceStation' );

  /**
   * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
   * @param {Number} num - Number of planet mode.
   * @constructor
   */
  function PlanetModeOption( model, num ) {

    var map = {
      sun: Sun,
      earth: Earth,
      moon: Moon,
      spaceStation: SpaceStation
    };

    Rectangle.call( this, 0, 0, 150, 30, 5, 5 );

    // add space objects
    for ( var i = model.spaceObjects.length, currentObj; i--; ) {
      currentObj = model.spaceObjects[ i ];
      if ( model.planetModes[ num ][ currentObj ] ) {
        this.addChild( new map[ currentObj ]( { x: 16 + i * 36, y: 15 }, 11 ) );
      }
    }
  }

  return inherit( Rectangle, PlanetModeOption );
} );