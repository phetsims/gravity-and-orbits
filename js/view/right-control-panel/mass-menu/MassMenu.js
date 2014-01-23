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
  var Node = require( 'SCENERY/nodes/Node' ),
    inherit = require( 'PHET_CORE/inherit' ),
    Slider = require( 'view/right-control-panel/mass-menu/Slider' ),
    ourSunString = require( 'string!GRAVITY_AND_ORBITS/ourSun' ),
    earthString = require( 'string!GRAVITY_AND_ORBITS/earth' ),
    ourMoonString = require( 'string!GRAVITY_AND_ORBITS/ourMoon' ),
    spaceStationString = require( 'string!GRAVITY_AND_ORBITS/spaceStation' ),
    starString = require( 'string!GRAVITY_AND_ORBITS/star' ),
    planetString = require( 'string!GRAVITY_AND_ORBITS/planet' ),
    moonString = require( 'string!GRAVITY_AND_ORBITS/moon' ),
    satelliteString = require( 'string!GRAVITY_AND_ORBITS/satellite' ),

    Sun = require( 'view/space-object/Sun' ),
    Earth = require( 'view/space-object/Earth' ),
    Moon = require( 'view/space-object/Moon' ),
    SpaceStation = require( 'view/space-object/SpaceStation' ),
    VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   * @param {Object} model
   * @param {Object} coords coordinates of node
   * @param {number} coords.x x-coordinate
   * @param {number} coords.y y-coordinate
   */

  function MassMenu( model, coords ) {
    var self = this;
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
        this[object] = new Slider( 10, 0, {title: map[object].title, property: map[object].property, icon: map[object].icon } );
      }
    }

    this.vBox = new VBox( {resize: false, spacing: 2} );
    this.addChild( this.vBox );

    // add sliders
    model.planetModeProperty.link( function( mode ) {
      self.vBox.removeAllChildren();
      showModes[mode].forEach( function( el ) {
        self.vBox.addChild( self[el] );
      } );

      self.vBox.updateLayout();
    } );
  }

  return inherit( Node, MassMenu );
} );