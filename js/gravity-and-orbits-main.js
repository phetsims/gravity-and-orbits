// Copyright 2013-2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import GravityAndOrbitsColorProfile from './common/GravityAndOrbitsColorProfile.js';
import GlobalOptionsNode from './common/view/GlobalOptionsNode.js';
import gravityAndOrbitsStrings from './gravity-and-orbits-strings.js';
import ModelScreen from './model/ModelScreen.js';
import ToScaleScreen from './toScale/ToScaleScreen.js';

const gravityAndOrbitsTitleString = gravityAndOrbitsStrings[ 'gravity-and-orbits' ].title;

SimLauncher.launch( () => {

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