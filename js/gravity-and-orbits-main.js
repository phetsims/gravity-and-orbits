// Copyright 2013-2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import GravityAndOrbitsColorProfile from './common/GravityAndOrbitsColorProfile.js';
import GlobalOptionsNode from './common/view/GlobalOptionsNode.js';
import gravityAndOrbitsStrings from './gravityAndOrbitsStrings.js';
import ModelScreen from './model/ModelScreen.js';
import ToScaleScreen from './toScale/ToScaleScreen.js';

const gravityAndOrbitsTitleString = gravityAndOrbitsStrings[ 'gravity-and-orbits' ].title;

simLauncher.launch( () => {

  const simOptions = {
    credits: {
      leadDesign: 'Emily B. Moore, Noah Podolefsky, Amy Rouinfar',
      softwareDevelopment: 'Aaron Davis, Jesse Greenberg, Jon Olson, Sam Reid',
      team: 'Trish Loeblein, Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Logan Bray, Steele Dalton, Ethan Johnson, Brooklyn Lash, Elise Morgan, Oliver Orejola, Devon Quispe, Ben Roberts, Kathryn Woessner, Bryan Yoelin',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to ' +
              'HTML5.'
    },

    // Creates content for the Options dialog
    createOptionsDialogContent: tandem => new GlobalOptionsNode( tandem )
  };

  const modelScreen = new ModelScreen( {
    backgroundColorProperty: GravityAndOrbitsColorProfile.backgroundProperty,
    tandem: Tandem.ROOT.createTandem( 'modelScreen' ),
    phetioDesigned: true
  } );
  const toScaleScreen = new ToScaleScreen( {
    backgroundColorProperty: GravityAndOrbitsColorProfile.backgroundProperty,
    tandem: Tandem.ROOT.createTandem( 'toScaleScreen' ),
    phetioDesigned: true
  } );
  new Sim( gravityAndOrbitsTitleString, [ modelScreen, toScaleScreen ], simOptions ).start();
} );