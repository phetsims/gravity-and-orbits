// Copyright 2013-2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var CartoonScreen = require( 'GRAVITY_AND_ORBITS/cartoon/CartoonScreen' );
  var ToScaleScreen = require( 'GRAVITY_AND_ORBITS/toScale/ToScaleScreen' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  var GlobalOptionsNode = require( 'GRAVITY_AND_ORBITS/common/view/GlobalOptionsNode' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var gravityAndOrbitsTitleString = require( 'string!GRAVITY_AND_ORBITS/gravity-and-orbits.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Emily Moore, Noah Podolefsky, Amy Rouinfar',
      softwareDevelopment: 'Aaron Davis, Jesse Greenberg, Jon Olson, Sam Reid',
      team: 'Trish Loeblein, Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Ethan Johnson, Elise Morgan, \n\tOliver Orejola, Ben Roberts, Bryan Yoelin',
      graphicArts: '',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to HTML5.'
    },
    optionsNode: new GlobalOptionsNode()
  };

  SimLauncher.launch( function() {

    var cartoonScreen = new CartoonScreen( {
      backgroundColor: GravityAndOrbitsColorProfile.background.toCSS()
    } );

    var toScaleScreen = new ToScaleScreen( {
      backgroundColor: GravityAndOrbitsColorProfile.background.toCSS()
    } );

    GravityAndOrbitsColorProfile.backgroundProperty.link( function( color ) {
      cartoonScreen.backgroundColorProperty.value = color;
      toScaleScreen.backgroundColorProperty.value = color;
    } );

    // create and start the sim
    new Sim( gravityAndOrbitsTitleString, [ cartoonScreen, toScaleScreen ], simOptions ).start();
  } );
} );
