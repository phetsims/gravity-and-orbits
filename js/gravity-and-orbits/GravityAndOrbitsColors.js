// Copyright 2002-2015, University of Colorado Boulder

/**
 * Location for most colors of the simulation (especially those that could be tweaked)
 *
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var ColorProfile = require( 'SCENERY_PHET/ColorProfile' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  // constants
  var BLACK = new Color( 0, 0, 0 );
  var WHITE = new Color( 255, 255, 255 );

  function GravityAndOrbitsColors() {
    ColorProfile.call( this, {
      background: {
        default: BLACK,
        projector: WHITE
      }
    } );
  }

  inherit( ColorProfile, GravityAndOrbitsColors );

  return new GravityAndOrbitsColors();

} );
