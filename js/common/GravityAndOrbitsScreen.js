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

  /**
   * @constructor
   */
  function GravityAndOrbitsScreen() {
    Screen.call( this,
      function() { return new GravityAndOrbitsModel(); },
      function( model ) { return new GravityAndOrbitsScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  return inherit( Screen, GravityAndOrbitsScreen );
} );