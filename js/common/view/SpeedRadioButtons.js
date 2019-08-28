// Copyright 2013-2019, University of Colorado Boulder

/**
 * Visual representation of speed radio buttons.
 * Three different modes: slow/normal/fast motion.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  const GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  const fastForwardString = require( 'string!GRAVITY_AND_ORBITS/fastForward' );
  const normalString = require( 'string!GRAVITY_AND_ORBITS/normal' );
  const slowMotionString = require( 'string!GRAVITY_AND_ORBITS/slowMotion' );

  class SpeedRadioButtons extends VerticalAquaRadioButtonGroup {

    /**
     * @param {Property.<number>} speedProperty - The rate of flow of time.
     * @param {Object} [options]
     * @constructor
     */
    constructor( speedProperty, options ) {

      options = _.extend( {
        spacing: 1,
        touchAreaXDilation: 5,
        radioButtonOptions: { radius: 8 }
      }, options );

      const textOptions = {
        font: new PhetFont( 18 ),
        fill: GravityAndOrbitsColorProfile.bottomControlTextProperty,
        maxWidth: 200
      };
      const fastText = new Text( fastForwardString, textOptions );
      const normalText = new Text( normalString, textOptions );
      const slowText = new Text( slowMotionString, textOptions );

      super( speedProperty, [
        { value: GravityAndOrbitsConstants.FAST_SPEED_SCALE, node: fastText },
        { value: GravityAndOrbitsConstants.STARTING_SPEED_SCALE, node: normalText },
        { value: GravityAndOrbitsConstants.SLOW_SPEED_SCALE, node: slowText }
      ], options );
    }
  }

  return gravityAndOrbits.register( 'SpeedRadioButtons', SpeedRadioButtons );
} );
