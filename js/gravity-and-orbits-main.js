// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the 'Gravity and Orbits Lab' sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( [
  'JOIST/SimLauncher',
  'JOIST/Sim',
  'model/GravityAndOrbitsModel',
  'view/GravityAndOrbitsView',
  'string!GRAVITY_AND_ORBITS/gravity-and-orbits.name'], function( SimLauncher, Sim, GravityAndOrbitsModel, GravityAndOrbitsView, titleString ) {
  'use strict';

  var simOptions = {
    credits: 'PhET Development Team -\n' +
             'Software Development: Sam Reid, John Blanco, Chris Malley\n' +
             'Design Team: Carl Wieman, Trish Loeblein, Wendy Adams\n',
    thanks: 'Thanks -\n' +
            'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to HTML5.'
  };
  SimLauncher.launch( function() {
    //Create and start the sim
    new Sim( titleString, [
      {
        name: titleString,
        createModel: function() { return new GravityAndOrbitsModel( 768, 504 ); },
        createView: function( model ) { return new GravityAndOrbitsView( model ); },
        backgroundColor: '#000'
      }
    ], simOptions ).start();
  } );
} );
