// Copyright 2016-2017, University of Colorado Boulder

/**
 * The 'Model' screen, though it is called 'Cartoon' throughout the code.  Possibly because 'ModelScreen' is
 * confusing.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  const CartoonModule = require( 'GRAVITY_AND_ORBITS/cartoon/module/CartoonModule' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsScreenView = require( 'GRAVITY_AND_ORBITS/common/view/GravityAndOrbitsScreenView' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const modelString = require( 'string!GRAVITY_AND_ORBITS/model' );

  // images
  const cartoonMipmap = require( 'mipmap!GRAVITY_AND_ORBITS/cartoon_icon.png' );

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
