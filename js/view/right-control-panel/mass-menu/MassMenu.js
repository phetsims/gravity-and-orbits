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

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MassMenuSlider = require( 'view/right-control-panel/mass-menu/MassMenuSlider' );
  var Sun = require( 'view/space-object/Sun' );
  var Earth = require( 'view/space-object/Earth' );
  var Moon = require( 'view/space-object/Moon' );
  var SpaceStation = require( 'view/space-object/SpaceStation' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var ourSunString = require( 'string!GRAVITY_AND_ORBITS/ourSun' );
  var earthString = require( 'string!GRAVITY_AND_ORBITS/earth' );
  var ourMoonString = require( 'string!GRAVITY_AND_ORBITS/ourMoon' );
  var spaceStationString = require( 'string!GRAVITY_AND_ORBITS/spaceStation' );
  var starString = require( 'string!GRAVITY_AND_ORBITS/star' );
  var planetString = require( 'string!GRAVITY_AND_ORBITS/planet' );
  var moonString = require( 'string!GRAVITY_AND_ORBITS/moon' );
  var satelliteString = require( 'string!GRAVITY_AND_ORBITS/satellite' );

  /**
   * @param {PropertySet} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
   * @param {Object} coords - Coordinates of node.
   * @param {Number} coords.x - X-coordinate.
   * @param {Number} coords.y - Y-coordinate.
   * @constructor
   */
  function MassMenu( model, coords ) {
    var massMenu = this;
    Node.call( this, {scale: 0.85} );
    if ( coords ) {
      this.setTranslation( coords );
    }
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
        title: earthString,
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
        this[object] = new MassMenuSlider( 10, 0, {title: map[object].title, property: map[object].property, icon: map[object].icon } );
      }
    }

    this.vBox = new VBox( {resize: false, spacing: 2} );
    this.addChild( this.vBox );

    // add sliders
    model.planetModeProperty.link( function( mode ) {
      massMenu.vBox.removeAllChildren();
      showModes[mode].forEach( function( spaceObject ) {
        massMenu.vBox.addChild( massMenu[spaceObject] );
      } );

      massMenu.vBox.updateLayout();
    } );

    assert && assert( !isNaN( this.height ) );
  }

  return inherit( Node, MassMenu );
} );