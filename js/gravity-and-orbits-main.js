// Copyright 2013-2019, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const CartoonScreen = require( 'GRAVITY_AND_ORBITS/cartoon/CartoonScreen' );
  const GlobalOptionsNode = require( 'GRAVITY_AND_ORBITS/common/view/GlobalOptionsNode' );
  const GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const Tandem = require( 'TANDEM/Tandem' );
  const ToScaleScreen = require( 'GRAVITY_AND_ORBITS/toScale/ToScaleScreen' );

  // strings
  const gravityAndOrbitsTitleString = require( 'string!GRAVITY_AND_ORBITS/gravity-and-orbits.title' );

  const simOptions = {
    credits: {
      leadDesign: 'Emily B. Moore, Noah Podolefsky, Amy Rouinfar',
      softwareDevelopment: 'Aaron Davis, Jesse Greenberg, Jon Olson, Sam Reid',
      team: 'Trish Loeblein, Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Ethan Johnson, Elise Morgan, Oliver Orejola, Ben Roberts, Bryan Yoelin',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to ' +
              'HTML5.'
    },

    // Creates content for the Options dialog
    createOptionsDialogContent: () => new GlobalOptionsNode( Tandem.rootTandem.createTandem( 'global' ).createTandem( 'view' ).createTandem( 'globalOptionsNode' ) )
  };

  SimLauncher.launch( () => {

    // TODO: Rename to ModelScreen
    const cartoonScreen = new CartoonScreen( {
      backgroundColorProperty: GravityAndOrbitsColorProfile.backgroundProperty,
      tandem: Tandem.rootTandem.createTandem( 'modelScreen' )
    } );
    const toScaleScreen = new ToScaleScreen( {
      backgroundColorProperty: GravityAndOrbitsColorProfile.backgroundProperty,
      tandem: Tandem.rootTandem.createTandem( 'toScaleScreen' )
    } );
    new Sim( gravityAndOrbitsTitleString, [ cartoonScreen, toScaleScreen ], simOptions ).start();
  } );
} );