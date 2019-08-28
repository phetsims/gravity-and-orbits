// Copyright 2013-2019, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  const CartoonScreen = require( 'GRAVITY_AND_ORBITS/cartoon/CartoonScreen' );
  const GlobalOptionsNode = require( 'GRAVITY_AND_ORBITS/common/view/GlobalOptionsNode' );
  const GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const ToScaleScreen = require( 'GRAVITY_AND_ORBITS/toScale/ToScaleScreen' );

  // strings
  const gravityAndOrbitsTitleString = require( 'string!GRAVITY_AND_ORBITS/gravity-and-orbits.title' );

  const simOptions = {
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

    const cartoonScreen = new CartoonScreen( {
      backgroundColorProperty: GravityAndOrbitsColorProfile.backgroundProperty
    } );

    const toScaleScreen = new ToScaleScreen( {
      backgroundColorProperty: GravityAndOrbitsColorProfile.backgroundProperty
    } );

    // create and start the sim
    new Sim( gravityAndOrbitsTitleString, [ cartoonScreen, toScaleScreen ], simOptions ).start();
  } );
} );
