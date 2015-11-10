// Copyright 2014-2015, University of Colorado Boulder

/**
 *
 * @author PhET Interactive Simulations
 */
define( function( require ) {
  'use strict';

  // modules
  var GravityAndOrbitsModel = require( 'GRAVITY_AND_ORBITS/common/model/GravityAndOrbitsModel' );
  var GravityAndOrbitsScreenView = require( 'GRAVITY_AND_ORBITS/common/view/GravityAndOrbitsScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var gravityAndOrbitsTitleString = require( 'string!GRAVITY_AND_ORBITS/common.title' );

  /**
   * @constructor
   */
  function GravityAndOrbitsScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = null;

    Screen.call( this, gravityAndOrbitsTitleString, icon,
      function() { return new GravityAndOrbitsModel(); },
      function( model ) { return new GravityAndOrbitsScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  return inherit( Screen, GravityAndOrbitsScreen );
} );