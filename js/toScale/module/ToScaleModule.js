// Copyright 2016-2017, University of Colorado Boulder

/**
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsModule = require( 'GRAVITY_AND_ORBITS/common/module/GravityAndOrbitsModule' );
  const inherit = require( 'PHET_CORE/inherit' );
  const RealModeList = require( 'GRAVITY_AND_ORBITS/toScale/module/RealModeList' );

  /**
   * @constructor
   */
  function ToScaleModule() {
    GravityAndOrbitsModule.call( this, true, function( p ) {
      return new RealModeList( p.playButtonPressedProperty, p.gravityEnabledProperty, p.steppingProperty, p.rewindingProperty, p.timeSpeedScaleProperty );
    }, 0, true );
  }

  gravityAndOrbits.register( 'ToScaleModule', ToScaleModule );

  return inherit( GravityAndOrbitsModule, ToScaleModule );
} );
