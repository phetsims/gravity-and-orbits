// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var CartoonModeList = require( 'GRAVITY_AND_ORBITS/cartoon/module/CartoonModeList' );
  var GravityAndOrbitsModule = require( 'GRAVITY_AND_ORBITS/common/module/GravityAndOrbitsModule' );

  /**
   * @constructor
   */
  function CartoonModule() {
    GravityAndOrbitsModule.call( this, true, function( p ) {
      return new CartoonModeList( p.playButtonPressedProperty, p.gravityEnabledProperty, p.steppingProperty, p.rewindingProperty, p.timeSpeedScaleProperty );
    }, 0, true );
  }

  gravityAndOrbits.register( 'CartoonModule', CartoonModule );

  return inherit( GravityAndOrbitsModule, CartoonModule );
} );
