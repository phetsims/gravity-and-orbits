// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the 'Gravity and Orbits Lab' sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( [
  'JOIST/SimLauncher', 'JOIST/Sim', 'JOIST/Screen', 'model/GravityAndOrbitsModel', 'view/GravityAndOrbitsView',
  'string!GRAVITY_AND_ORBITS/gravity-and-orbits.name',
  'image!GRAVITY_AND_ORBITS/cartoon_icon.png', 'image!GRAVITY_AND_ORBITS/to_scale_icon.png',
  'string!GRAVITY_AND_ORBITS/cartoon', 'string!GRAVITY_AND_ORBITS/toScale'],
  function( SimLauncher, Sim, Screen, GravityAndOrbitsModel, GravityAndOrbitsView, titleString, cartoonIcon, toScaleIcon, cartoonString, toScaleString ) {
    'use strict';

    var simOptions = {
      credits: 'PhET Development Team -\n' +
               'Software Development: Sam Reid, John Blanco, Chris Malley\n' +
               'Design Team: Carl Wieman, Trish Loeblein, Wendy Adams\n',
      thanks: 'Thanks -\n' +
              'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to HTML5.'
    };

    var Image = require( 'SCENERY/nodes/Image' );

    SimLauncher.launch( function() {
      //Create and start the sim
      new Sim( titleString, [
        new Screen( cartoonString, new Image( cartoonIcon ),
          function() { return new GravityAndOrbitsModel( 768, 504, cartoonString ); },
          function( model ) { return new GravityAndOrbitsView( model ); },
          { backgroundColor: '#000' }
        ),
        new Screen( toScaleString, new Image( toScaleIcon ),
          function() { return new GravityAndOrbitsModel( 768, 504, toScaleString ); },
          function( model ) { return new GravityAndOrbitsView( model ); },
          { backgroundColor: '#000' }
        )
      ], simOptions ).start();
    } );
  } );
