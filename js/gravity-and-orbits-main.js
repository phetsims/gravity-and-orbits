// Copyright 2013-2019, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var CartoonScreen = require( 'GRAVITY_AND_ORBITS/cartoon/CartoonScreen' );
  var GlobalOptionsNode = require( 'GRAVITY_AND_ORBITS/common/view/GlobalOptionsNode' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var ToScaleScreen = require( 'GRAVITY_AND_ORBITS/toScale/ToScaleScreen' );

  // strings
  var gravityAndOrbitsTitleString = require( 'string!GRAVITY_AND_ORBITS/gravity-and-orbits.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Emily B. Moore, Noah Podolefsky, Amy Rouinfar',
      softwareDevelopment: 'Aaron Davis, Jesse Greenberg, Jon Olson, Sam Reid',
      team: 'Trish Loeblein, Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Ethan Johnson, Elise Morgan, Oliver Orejola, Ben Roberts, Bryan Yoelin',
      graphicArts: '',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to ' +
              'HTML5.'
    },

    // Creates content for the Options dialog
    createOptionsDialogContent: () => new GlobalOptionsNode()
  };

  SimLauncher.launch( function() {

    var cartoonScreen = new CartoonScreen( {
      backgroundColorProperty: GravityAndOrbitsColorProfile.backgroundProperty
    } );

    var toScaleScreen = new ToScaleScreen( {
      backgroundColorProperty: GravityAndOrbitsColorProfile.backgroundProperty
    } );

    // create and start the sim
    new Sim( gravityAndOrbitsTitleString, [ cartoonScreen, toScaleScreen ], simOptions ).start();
  } );
} );
