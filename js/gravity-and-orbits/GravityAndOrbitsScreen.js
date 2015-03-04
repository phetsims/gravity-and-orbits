//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author PhET Interactive Simulations
 */
define( function( require ) {
  'use strict';

  // modules
  var GravityAndOrbitsModel = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/GravityAndOrbitsModel' );
  var GravityAndOrbitsScreenView = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/GravityAndOrbitsScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var gravityAndOrbitsSimString = require( 'string!GRAVITY_AND_ORBITS/gravity-and-orbits.name' );

  /**
   * @constructor
   */
  function GravityAndOrbitsScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = null;

    Screen.call( this, gravityAndOrbitsSimString, icon,
      function() { return new GravityAndOrbitsModel(); },
      function( model ) { return new GravityAndOrbitsScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  return inherit( Screen, GravityAndOrbitsScreen );
} );