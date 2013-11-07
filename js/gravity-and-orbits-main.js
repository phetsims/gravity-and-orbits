// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the 'Gravity and Orbits Lab' sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define(
  function( require ) {
    'use strict';

    var
      SimLauncher = require( 'JOIST/SimLauncher' ),
      Sim = require( 'JOIST/Sim' ),
      Screen = require( 'JOIST/Screen' ),
      GravityAndOrbitsModel = require( 'model/GravityAndOrbitsModel' ),
      GravityAndOrbitsView = require( 'view/GravityAndOrbitsView' ),
      titleString = require( 'string!GRAVITY_AND_ORBITS/gravity-and-orbits.name' ),
      cartoonIcon = require( 'image!GRAVITY_AND_ORBITS/cartoon_icon.png' ),
      toScaleIcon = require( 'image!GRAVITY_AND_ORBITS/to_scale_icon.png' ),
      cartoonString = require( 'string!GRAVITY_AND_ORBITS/cartoon' ),
      toScaleString = require( 'string!GRAVITY_AND_ORBITS/toScale' ),
      ScreenView = require( 'JOIST/ScreenView' );

    var simOptions = {
      credits: {
        leadDesign: 'Noah Podolefsky, Emily Moore',
        softwareDevelopment: 'Sam Reid, Jon Olson',
        designTeam: 'Kathy Perkins, Trish Loeblein',
        thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to HTML5.'
      }
    };

    var Image = require( 'SCENERY/nodes/Image' );

    SimLauncher.launch( function() {
      // create and start the sim
      new Sim( titleString, [
        new Screen( cartoonString, new Image( cartoonIcon ),
          function() { return new GravityAndOrbitsModel( ScreenView.LAYOUT_BOUNDS.width, ScreenView.LAYOUT_BOUNDS.height, cartoonString ); },
          function( model ) { return new GravityAndOrbitsView( model ); },
          { backgroundColor: '#000' }
        ),
        new Screen( toScaleString, new Image( toScaleIcon ),
          function() { return new GravityAndOrbitsModel( ScreenView.LAYOUT_BOUNDS.width, ScreenView.LAYOUT_BOUNDS.height, toScaleString ); },
          function( model ) { return new GravityAndOrbitsView( model ); },
          { backgroundColor: '#000' }
        )
      ], simOptions ).start();
    } );
  } );