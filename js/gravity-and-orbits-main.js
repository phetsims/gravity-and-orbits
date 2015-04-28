// Copyright 2002-2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author PhET Interactive Simulations
 */
define( function( require ) {
  'use strict';

  // modules
  var GravityAndOrbitsModule = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/GravityAndOrbitsModule' );
  var GravityAndOrbitsScreenView = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/GravityAndOrbitsScreenView' );
  var CartoonModeList = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/CartoonModeList' );
  var RealModeList = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/RealModeList' );
  var UserComponents = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/UserComponents' );
  var GAOStrings = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GAOStrings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var Screen = require( 'JOIST/Screen' );
  var Property = require( 'AXON/Property' );
  var Image = require( 'SCENERY/nodes/Image' );

  // images
  var cartoonIcon = require( 'image!GRAVITY_AND_ORBITS/cartoon_icon.png' );
  var toScaleIcon = require( 'image!GRAVITY_AND_ORBITS/to_scale_icon.png' );

  // strings
  var cartoonString = require( 'string!GRAVITY_AND_ORBITS/cartoon' );
  var toScaleString = require( 'string!GRAVITY_AND_ORBITS/toScale' );
  var simTitle = require( 'string!GRAVITY_AND_ORBITS/gravity-and-orbits.name' );

  // these modules are originally from GravityAndOrbitsApplication

  // static class: IntroModule
  function ToScaleModule( phetFrame, whiteBackgroundProperty ) {
    GravityAndOrbitsModule.call( this, UserComponents.toScaleTab, phetFrame, whiteBackgroundProperty, GAOStrings.TO_SCALE, true, function( p ) {
      return new RealModeList( p.playButtonPressed, p.gravityEnabled, p.stepping, p.rewinding, p.timeSpeedScale );
    }, 0, true );
  }

  inherit( GravityAndOrbitsModule, ToScaleModule );

  // static class: CartoonModule
  function CartoonModule( phetFrame, whiteBackgroundProperty ) {
    GravityAndOrbitsModule.call( this, UserComponents.cartoonTab, phetFrame, whiteBackgroundProperty, GAOStrings.CARTOON, false, function( p ) {
        return new CartoonModeList( p.playButtonPressed, p.gravityEnabled, p.stepping, p.rewinding, p.timeSpeedScale );
      }, 0, false );
  }

  inherit( GravityAndOrbitsModule, CartoonModule );

  var simOptions = {
    credits: {
      //TODO fill in proper credits, all of these fields are optional, see joist.AboutDialog
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
//  if ( window.phetcommon.getQueryParameter( 'dev' ) ) {
//    simOptions = _.extend( {
//      // add dev-specific options here
//    }, simOptions );
//  }

//  SimLauncher.launch( function() {
//    var sim = new Sim( simTitle, [ new GravityAndOrbitsScreen() ], simOptions );
//    sim.start();
//  } );

  // taken from MLL version, need to incorporate the modules somehow
  SimLauncher.launch( function() {
    // create and start the sim
    new Sim( simTitle, [
      new Screen( cartoonString, new Image( cartoonIcon ),
        function() { return new CartoonModule( null, new Property( true ) ); },
        function( model ) { return new GravityAndOrbitsScreenView( model ); },
        { backgroundColor: '#000' }
      ),
      new Screen( toScaleString, new Image( toScaleIcon ),
        function() { return new ToScaleModule( null, new Property( true ) ); },
        function( model ) { return new GravityAndOrbitsScreenView( model ); },
        { backgroundColor: '#000' }
      )
    ], simOptions ).start();
  } );
} );