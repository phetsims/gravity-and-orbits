// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the 'Gravity and Orbits Lab' sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var SimLauncher = require( 'JOIST/SimLauncher' ),
    Sim = require( 'JOIST/Sim' ),
    Strings = require( 'Strings' ),
    GravityAndOrbitsModel = require( 'model/GravityAndOrbitsModel' ),
    GravityAndOrbitsView = require( 'view/GravityAndOrbitsView' ),
    GravityAndOrbitsImages = require( 'gravity-and-orbits-images' );

  var simOptions = {
    credits: 'PhET Development Team -\n' +
             'Software Development: Sam Reid, John Blanco, Chris Malley\n' +
             'Design Team: Carl Wieman, Trish Loeblein, Wendy Adams\n',
    thanks: 'Thanks -\n' +
            'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to HTML5.'
  };
  SimLauncher.launch( GravityAndOrbitsImages, function() {
    //Create and start the sim
    new Sim( Strings['GAO.name'], [
      {
        name: Strings['GAO.name'],
        createModel: function() { return new GravityAndOrbitsModel( 768, 504 ); },
        createView: function( model ) { return new GravityAndOrbitsView( model ); },
        backgroundColor: '#000'
      }
    ], simOptions ).start();
  } );
} );
