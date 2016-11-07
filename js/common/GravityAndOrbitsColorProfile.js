// Copyright 2015-2016, University of Colorado Boulder

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
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  var GravityAndOrbitsColorProfile = new ColorProfile( {
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
    checkBoxFill: {
      default: 'black',
      projector: 'white'
    }
  } );

  gravityAndOrbits.register( 'GravityAndOrbitsColorProfile', GravityAndOrbitsColorProfile );

  return GravityAndOrbitsColorProfile;
} );
