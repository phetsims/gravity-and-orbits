// Copyright 2016-2017, University of Colorado Boulder

/**
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  var GravityAndOrbitsModule = require( 'GRAVITY_AND_ORBITS/common/module/GravityAndOrbitsModule' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RealModeList = require( 'GRAVITY_AND_ORBITS/toScale/module/RealModeList' );

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
