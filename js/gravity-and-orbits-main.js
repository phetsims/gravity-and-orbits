// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the 'Gravity and Orbits Lab' sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define(
  function( require ) {
    'use strict';

    // modules
    var SimLauncher = require( 'JOIST/SimLauncher' );
    var Sim = require( 'JOIST/Sim' );
    var Screen = require( 'JOIST/Screen' );
    var GravityAndOrbitsModel = require( 'model/GravityAndOrbitsModel' );
    var GravityAndOrbitsView = require( 'view/GravityAndOrbitsView' );
    var ScreenView = require( 'JOIST/ScreenView' );
    var Image = require( 'SCENERY/nodes/Image' );

    // images
    var cartoonIcon = require( 'image!GRAVITY_AND_ORBITS/cartoon_icon.png' );
    var toScaleIcon = require( 'image!GRAVITY_AND_ORBITS/to_scale_icon.png' );

    // strings
    var cartoonString = require( 'string!GRAVITY_AND_ORBITS/cartoon' );
    var toScaleString = require( 'string!GRAVITY_AND_ORBITS/toScale' );
    var titleString = require( 'string!GRAVITY_AND_ORBITS/gravity-and-orbits.name' );

    var simOptions = {
      credits: {
        leadDesign: 'Noah Podolefsky, Emily Moore',
        softwareDevelopment: 'Sam Reid, Jon Olson',
        designTeam: 'Kathy Perkins, Trish Loeblein',
        thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to HTML5.'
      }
    };

    SimLauncher.launch( function() {
      // create and start the sim
      new Sim( titleString, [
        new Screen( cartoonString, new Image( cartoonIcon ),
          function() { return new GravityAndOrbitsModel( ScreenView.DEFAULT_LAYOUT_BOUNDS.width, ScreenView.DEFAULT_LAYOUT_BOUNDS.height, cartoonString ); },
          function( model ) { return new GravityAndOrbitsView( model ); },
          { backgroundColor: '#000' }
        ),
        new Screen( toScaleString, new Image( toScaleIcon ),
          function() { return new GravityAndOrbitsModel( ScreenView.DEFAULT_LAYOUT_BOUNDS.width, ScreenView.DEFAULT_LAYOUT_BOUNDS.height, toScaleString ); },
          function( model ) { return new GravityAndOrbitsView( model ); },
          { backgroundColor: '#000' }
        )
      ], simOptions ).start();
    } );
  } );