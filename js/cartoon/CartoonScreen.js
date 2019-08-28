// Copyright 2016-2019, University of Colorado Boulder

/**
 * The 'Model' screen, though it is called 'Cartoon' throughout the code.  Possibly because 'ModelScreen' is
 * confusing.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const CartoonModule = require( 'GRAVITY_AND_ORBITS/cartoon/module/CartoonModule' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsScreenView = require( 'GRAVITY_AND_ORBITS/common/view/GravityAndOrbitsScreenView' );
  const Image = require( 'SCENERY/nodes/Image' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const modelString = require( 'string!GRAVITY_AND_ORBITS/model' );

  // images
  const cartoonMipmap = require( 'mipmap!GRAVITY_AND_ORBITS/cartoon_icon.png' );

  class CartoonScreen extends Screen {
    constructor( options ) {

      options = _.extend( {
        name: modelString,
        homeScreenIcon: new Image( cartoonMipmap )
      }, options );

      super(
        () => new CartoonModule(),
        model => new GravityAndOrbitsScreenView( model ),
        options
      );
    }
  }

  return gravityAndOrbits.register( 'CartoonScreen', CartoonScreen );
} );