// Copyright 2016-2019, University of Colorado Boulder

/**
 * The 'To Scale' screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsScreenView = require( 'GRAVITY_AND_ORBITS/common/view/GravityAndOrbitsScreenView' );
  const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const Screen = require( 'JOIST/Screen' );
  const ToScaleModule = require( 'GRAVITY_AND_ORBITS/toScale/module/ToScaleModule' );

  // strings
  const toScaleString = require( 'string!GRAVITY_AND_ORBITS/toScale' );

  // images
  const toScaleMipmap = require( 'mipmap!GRAVITY_AND_ORBITS/to_scale_icon.png' );

  class ToScaleScreen extends Screen {
    constructor( options ) {
      options = merge( {
        name: toScaleString,
        homeScreenIcon: new Image( toScaleMipmap )
      }, options );

      super(
        () => new ToScaleModule(),
        model => new GravityAndOrbitsScreenView( model ),
        options
      );
    }
  }

  return gravityAndOrbits.register( 'ToScaleScreen', ToScaleScreen );
} );