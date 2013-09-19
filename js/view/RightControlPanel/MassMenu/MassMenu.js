/**
 * Copyright 2002-2013, University of Colorado
 * Container for mass sliders
 *
 * @author Andrey Zelenkov (Mlearner)
 */


define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );

  var Slider = require( 'view/RightControlPanel/MassMenu/Slider/Slider' );
  var Strings = require( 'Strings' );

  var Sun = require( 'view/SpaceObject/Sun' );
  var Earth = require( 'view/SpaceObject/Earth' );
  var Moon = require( 'view/SpaceObject/Moon' );
  var SpaceStation = require( 'view/SpaceObject/SpaceStation' );


  function MassMenu( model, x, y ) {
    var self = this;
    Node.call( this, {x: x, y: y, scale: 0.9} );

    // slides options
    var map = {
      sun: {
        title: Strings['GAO.ourSun'],
        property: model.sunMassProperty,
        icon: {
          text: Strings['GAO.star'],
          image: Sun
        }
      },
      earth: {
        title: Strings['GAO.ourEarth'],
        property: model.earthMassProperty,
        icon: {
          text: Strings['GAO.planet'],
          image: Earth
        }
      },
      moon: {
        title: Strings['GAO.ourMoon'],
        property: model.moonMassProperty,
        icon: {
          text: Strings['GAO.moon'],
          image: Moon
        }
      },
      spaceStation: {
        title: Strings['GAO.spaceStation'],
        property: model.spaceStationMassProperty,
        icon: {
          text: Strings['GAO.satellite'],
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
        this[object] = new Slider( 10, 0, {title: map[object].title, property: map[object].property, icon: map[object].icon, rounding: 2, tick: {step: 0.5} } );
      }
    }

    // add sliders
    model.planetModeProperty.link( function( mode ) {
      self.removeAllChildren();
      showModes[mode].forEach( function( el, i ) { // i === 0 or i === 1
        self.addChild( (i ? self[el].setY( self.getHeight() + 3 ) : self[el].setY( 0 ) ) );
      } );
    } );
  }

  inherit( Node, MassMenu );

  return MassMenu;
} );