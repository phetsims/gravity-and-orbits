// Copyright 2013-2019, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ModelScreen = require( 'GRAVITY_AND_ORBITS/model/ModelScreen' );
  const GlobalOptionsNode = require( 'GRAVITY_AND_ORBITS/common/view/GlobalOptionsNode' );
  const GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const Tandem = require( 'TANDEM/Tandem' );
  const ToScaleScreen = require( 'GRAVITY_AND_ORBITS/toScale/ToScaleScreen' );

  // strings
  const gravityAndOrbitsTitleString = require( 'string!GRAVITY_AND_ORBITS/gravity-and-orbits.title' );

  // Eagerly create GlobalOptionsNode so it works smoothly with PhET-iO
  const globalOptionsNode = new GlobalOptionsNode( Tandem.ROOT.createTandem( 'global' ).createTandem( 'view' ).createTandem( 'globalOptionsNode' ) );

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
    createOptionsDialogContent: () => globalOptionsNode
  };

  SimLauncher.launch( () => {

    const modelScreen = new ModelScreen( {
      backgroundColorProperty: GravityAndOrbitsColorProfile.backgroundProperty,
      tandem: Tandem.ROOT.createTandem( 'modelScreen' )
    } );
    const toScaleScreen = new ToScaleScreen( {
      backgroundColorProperty: GravityAndOrbitsColorProfile.backgroundProperty,
      tandem: Tandem.ROOT.createTandem( 'toScaleScreen' )
    } );
    new Sim( gravityAndOrbitsTitleString, [ modelScreen, toScaleScreen ], simOptions ).start();
  } );
} );