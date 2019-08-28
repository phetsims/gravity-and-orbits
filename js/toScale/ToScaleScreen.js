// Copyright 2016-2017, University of Colorado Boulder

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
  const inherit = require( 'PHET_CORE/inherit' );
  const Screen = require( 'JOIST/Screen' );
  const ToScaleModule = require( 'GRAVITY_AND_ORBITS/toScale/module/ToScaleModule' );

  // strings
  const toScaleString = require( 'string!GRAVITY_AND_ORBITS/toScale' );

  // images
  const toScaleMipmap = require( 'mipmap!GRAVITY_AND_ORBITS/to_scale_icon.png' );

  /**
   * @constructor
   */
  function ToScaleScreen( options ) {

    options = _.extend( {
      name: toScaleString,
      homeScreenIcon: new Image( toScaleMipmap )
    }, options );

    Screen.call( this,
      function() { return new ToScaleModule(); },
      function( model ) { return new GravityAndOrbitsScreenView( model ); },
      options
    );
  }

  gravityAndOrbits.register( 'ToScaleScreen', ToScaleScreen );

  return inherit( Screen, ToScaleScreen );
} );
