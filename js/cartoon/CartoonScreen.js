// Copyright 2016, University of Colorado Boulder

/**
 * The 'Model' screen, though it is called 'Cartoon' throughout the code.  Possibly because 'ModelScreen' is
 * confusing.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var GravityAndOrbitsScreenView = require( 'GRAVITY_AND_ORBITS/common/view/GravityAndOrbitsScreenView' );
  var CartoonModule = require( 'GRAVITY_AND_ORBITS/cartoon/module/CartoonModule' );
  var Screen = require( 'JOIST/Screen' );
  var Image = require( 'SCENERY/nodes/Image' );

  // strings
  var modelString = require( 'string!GRAVITY_AND_ORBITS/model' );

  // images
  var cartoonMipmap = require( 'mipmap!GRAVITY_AND_ORBITS/cartoon_icon.png' );

  /**
   * @constructor
   */
  function CartoonScreen( options ) {

    options = _.extend( {
      name: modelString,
      homeScreenIcon: new Image( cartoonMipmap )
    }, options );

    Screen.call( this,
      function() { return new CartoonModule(); },
      function( model ) { return new GravityAndOrbitsScreenView( model ); },
      options
    );
  }

  gravityAndOrbits.register( 'CartoonScreen', CartoonScreen );

  return inherit( Screen, CartoonScreen );
} );
