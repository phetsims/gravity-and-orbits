// Copyright 2013-2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var GravityAndOrbitsModule = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/GravityAndOrbitsModule' );
  var GravityAndOrbitsScreenView = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/GravityAndOrbitsScreenView' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsColorProfile' );
  var CartoonModeList = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/CartoonModeList' );
  var RealModeList = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/RealModeList' );
  var GlobalOptionsNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/GlobalOptionsNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var Screen = require( 'JOIST/Screen' );
  var Image = require( 'SCENERY/nodes/Image' );

  // images
  var cartoonMipmap = require( 'mipmap!GRAVITY_AND_ORBITS/cartoon_icon.png' );
  var toScaleMipmap = require( 'mipmap!GRAVITY_AND_ORBITS/to_scale_icon.png' );

  // strings
  var cartoonString = require( 'string!GRAVITY_AND_ORBITS/cartoon' );
  var toScaleString = require( 'string!GRAVITY_AND_ORBITS/toScale' );
  var gravityAndOrbitsTitleString = require( 'string!GRAVITY_AND_ORBITS/gravity-and-orbits.title' );

  /**
   * ToScaleModule
   * @constructor
   */
  function ToScaleModule() {
    GravityAndOrbitsModule.call( this, true, function( p ) {
      return new RealModeList( p.playButtonPressed, p.gravityEnabled, p.stepping, p.rewinding, p.timeSpeedScale );
    }, 0, true );
  }

  inherit( GravityAndOrbitsModule, ToScaleModule );

  /**
   * CartoonModule
   * @constructor
   */
  function CartoonModule() {
    GravityAndOrbitsModule.call( this, false, function( p ) {
      return new CartoonModeList( p.playButtonPressed, p.gravityEnabled, p.stepping, p.rewinding, p.timeSpeedScale );
    }, 0, false );
  }

  inherit( GravityAndOrbitsModule, CartoonModule );

  var simOptions = {
    credits: {
      leadDesign: 'Amy Rouinfar, Noah Podolefsky, Emily Moore',
      softwareDevelopment: 'Aaron Davis, Sam Reid, Jon Olson',
      team: 'Kathy Perkins, Trish Loeblein',
      qualityAssurance: 'Steele Dalton, Elise Morgan, Oliver Orejola, Bryan Yoelin',
      graphicArts: '',
      thanks: ''
    },
    optionsNode: new GlobalOptionsNode()
  };

  var cartoonScreen = new Screen( cartoonString, new Image( cartoonMipmap ),
    function() { return new CartoonModule(); },
    function( model ) { return new GravityAndOrbitsScreenView( model ); },
    { backgroundColor: GravityAndOrbitsColorProfile.background.toCSS() }
  );

  var toScaleScreen = new Screen( toScaleString, new Image( toScaleMipmap ),
    function() { return new ToScaleModule(); },
    function( model ) { return new GravityAndOrbitsScreenView( model ); },
    { backgroundColor: GravityAndOrbitsColorProfile.background.toCSS() }
  );

  GravityAndOrbitsColorProfile.backgroundProperty.link( function( color ) {
    cartoonScreen.backgroundColor = color;
    toScaleScreen.backgroundColor = color;
  } );

  SimLauncher.launch( function() {
    // create and start the sim
    new Sim( gravityAndOrbitsTitleString, [ cartoonScreen, toScaleScreen ], simOptions ).start();
  } );
} );