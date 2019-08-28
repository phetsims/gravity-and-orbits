// Copyright 2016-2017, University of Colorado Boulder

/**
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const CartoonModeList = require( 'GRAVITY_AND_ORBITS/cartoon/module/CartoonModeList' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsModule = require( 'GRAVITY_AND_ORBITS/common/module/GravityAndOrbitsModule' );
  const inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   */
  function CartoonModule() {
    GravityAndOrbitsModule.call( this, false, function( p ) {
      return new CartoonModeList( p.playButtonPressedProperty, p.gravityEnabledProperty, p.steppingProperty, p.rewindingProperty, p.timeSpeedScaleProperty );
    }, 0, false );
  }

  gravityAndOrbits.register( 'CartoonModule', CartoonModule );

  return inherit( GravityAndOrbitsModule, CartoonModule );
} );
