// Copyright 2002-2013, University of Colorado Boulder

/**
 * Container for mass sliders.
 * There should be two sliders.
 * Sliders can selected through variable showModes.
 *
 * @author Andrey Zelenkov (Mlearner)
 */


define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );

  var Slider = require( 'view/right-control-panel/mass-menu/Slider' );
  var ourSunString = require( 'string!GRAVITY_AND_ORBITS/ourSun' );
  var ourEarthString = require( 'string!GRAVITY_AND_ORBITS/ourEarth' );
  var ourMoonString = require( 'string!GRAVITY_AND_ORBITS/ourMoon' );
  var spaceStationString = require( 'string!GRAVITY_AND_ORBITS/spaceStation' );
  var starString = require( 'string!GRAVITY_AND_ORBITS/star' );
  var planetString = require( 'string!GRAVITY_AND_ORBITS/planet' );
  var moonString = require( 'string!GRAVITY_AND_ORBITS/moon' );
  var satelliteString = require( 'string!GRAVITY_AND_ORBITS/satellite' );

  var Sun = require( 'view/space-object/Sun' );
  var Earth = require( 'view/space-object/Earth' );
  var Moon = require( 'view/space-object/Moon' );
  var SpaceStation = require( 'view/space-object/SpaceStation' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  function MassMenu( model, x, y ) {
    var self = this;
    Node.call( this, {x: x, y: y, scale: 0.9} );

    // slides options
    var map = {
      sun: {
        title: ourSunString,
        property: model.sun.massCoeffProperty,
        icon: {
          text: starString,
          image: Sun
        }
      },
      earth: {
        title: ourEarthString,
        property: model.earth.massCoeffProperty,
        icon: {
          text: planetString,
          image: Earth
        }
      },
      moon: {
        title: ourMoonString,
        property: model.moon.massCoeffProperty,
        icon: {
          text: moonString,
          image: Moon
        }
      },
      spaceStation: {
        title: spaceStationString,
        property: model.spaceStation.massCoeffProperty,
        icon: {
          text: satelliteString,
          image: SpaceStation
        }
      }
    }, showModes = [
      ['sun', 'earth'], // planetMode === 0
      ['sun', 'earth'], // planetMode === 1
      ['earth', 'moon'], // planetMode === 2
      ['earth', 'spaceStation'] // planetMode === 3
    ];

    // init all sliders
    for ( var object in map ) {
      if ( map.hasOwnProperty( object ) ) {
        this[object] = new Slider( 10, 0, {title: map[object].title, property: map[object].property, icon: map[object].icon } );
      }
    }

    this.vBox = new VBox( {spacing: 2} );
    this.addChild( this.vBox );

    // add sliders
    model.planetModeProperty.link( function( mode ) {
      self.vBox.removeAllChildren();
      showModes[mode].forEach( function( el ) {
        self.vBox.addChild( self[el] );
      } );

      self.vBox.bottom = 40;
      self.vBox.updateLayout();
    } );
  }

  return inherit( Node, MassMenu );
} );