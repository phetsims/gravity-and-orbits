// Copyright 2015-2018, University of Colorado Boulder

/**
 * Location for most colors of the simulation (especially those that could be tweaked)
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const ColorProfile = require( 'SCENERY_PHET/ColorProfile' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  const GravityAndOrbitsColorProfile = new ColorProfile( [ 'default', 'projector' ], {
    background: {
      default: 'black',
      projector: 'white'
    },
    bodyNodeText: {
      default: 'white',
      projector: 'black'
    },
    measuringTapeText: {
      default: 'white',
      projector: 'black'
    },
    bottomControlText: {
      default: 'white',
      projector: 'black'
    },
    panelBackground: {
      default: 'black',
      projector: new Color( 222, 234, 255 )
    },
    panelText: {
      default: 'white',
      projector: 'black'
    },
    arrowIndicator: {
      default: new Color( 255, 255, 0 ),
      projector: 'black'
    },
    gridIcon: {
      default: 'gray',
      projector: 'black'
    },
    checkboxFill: {
      default: 'black',
      projector: 'white'
    }
  } );

  gravityAndOrbits.register( 'GravityAndOrbitsColorProfile', GravityAndOrbitsColorProfile );

  return GravityAndOrbitsColorProfile;
} );
