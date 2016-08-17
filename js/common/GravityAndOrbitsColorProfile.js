// Copyright 2015, University of Colorado Boulder

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
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  // constants
  var BLACK = new Color( 0, 0, 0 );
  var WHITE = new Color( 255, 255, 255 );

  function Profile() {
    ColorProfile.call( this, {
      background: {
        default: BLACK,
        projector: WHITE
      },
      bodyNodeText: {
        default: WHITE,
        projector: BLACK
      },
      bottomControlText: {
        default: WHITE,
        projector: BLACK
      },
      panelBackground: {
        default: BLACK,
        projector: new Color( 222, 234, 255 )
      },
      panelText: {
        default: WHITE,
        projector: BLACK
      },
      arrowIndicator: {
        default: new Color( 255, 255, 0 ),
        projector: BLACK
      },
      gridIcon: {
        default: 'gray',
        projector: BLACK
      },
      checkBoxFill: {
        default: BLACK,
        projector: WHITE
      }
    } );
  }

  inherit( ColorProfile, Profile );

  var GravityAndOrbitsColorProfile = new Profile();

  gravityAndOrbits.register( 'GravityAndOrbitsColorProfile', GravityAndOrbitsColorProfile );

  return GravityAndOrbitsColorProfile;
} );
