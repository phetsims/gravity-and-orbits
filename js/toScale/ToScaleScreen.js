// Copyright 2015, University of Colorado Boulder

/**
 * The 'To Scale' screen.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  var GravityAndOrbitsScreenView = require( 'GRAVITY_AND_ORBITS/common/view/GravityAndOrbitsScreenView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var ToScaleModule = require( 'GRAVITY_AND_ORBITS/toScale/module/ToScaleModule' );

  // strings
  var toScaleString = require( 'string!GRAVITY_AND_ORBITS/toScale' );

  // images
  var toScaleMipmap = require( 'mipmap!GRAVITY_AND_ORBITS/to_scale_icon.png' );

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
