// Copyright 2013-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import { CreditsData } from '../../joist/js/CreditsNode.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import GravityAndOrbitsColors from './common/GravityAndOrbitsColors.js';
import GlobalOptionsNode from './common/view/GlobalOptionsNode.js';
import gravityAndOrbitsStrings from './gravityAndOrbitsStrings.js';
import ModelScreen from './model/ModelScreen.js';
import ToScaleScreen from './toScale/ToScaleScreen.js';

// @ts-ignore
const gravityAndOrbitsTitleString = gravityAndOrbitsStrings[ 'gravity-and-orbits' ].title;

simLauncher.launch( () => {

  const credits: CreditsData = {
    leadDesign: 'Emily B. Moore, Noah Podolefsky, Amy Rouinfar',
    softwareDevelopment: 'Aaron Davis, Jesse Greenberg, Jon Olson, Sam Reid',
    team: 'Trish Loeblein, Ariel Paul, Kathy Perkins',
    qualityAssurance: 'Logan Bray, Steele Dalton, Ethan Johnson, Brooklyn Lash, Emily Miller, Elise Morgan, Liam Mulhall, Oliver Orejola, Devon Quispe, Ben Roberts, Kathryn Woessner, Bryan Yoelin',
    thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to ' +
            'HTML5.'
  };
  const simOptions = {
    credits: credits,

    // Creates content for the Options dialog
    createOptionsDialogContent: ( tandem: Tandem ) => new GlobalOptionsNode( tandem ),

    // phet-io
    phetioDesigned: true
  };

  const backgroundColorProperty = GravityAndOrbitsColors.backgroundProperty;

  const modelScreen = new ModelScreen( {
    backgroundColorProperty: backgroundColorProperty,
    tandem: Tandem.ROOT.createTandem( 'modelScreen' )
  } );
  const toScaleScreen = new ToScaleScreen( {
    backgroundColorProperty: backgroundColorProperty,
    tandem: Tandem.ROOT.createTandem( 'toScaleScreen' )
  } );
  new Sim( gravityAndOrbitsTitleString, [ modelScreen, toScaleScreen ], simOptions ).start();
} );