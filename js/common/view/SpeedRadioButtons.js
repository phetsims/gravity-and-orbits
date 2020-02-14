// Copyright 2013-2020, University of Colorado Boulder

/**
 * Visual representation of speed radio buttons.
 * Three different modes: slow/normal/fast motion.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  const merge = require( 'PHET_CORE/merge' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const SpeedType = require( 'GRAVITY_AND_ORBITS/common/model/SpeedType' );
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

      options = merge( {
        spacing: 1,
        touchAreaDilation: 5,
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
        { value: SpeedType.FAST_FORWARD, node: fastText, tandemName: 'fastForwardRadioButton' },
        { value: SpeedType.NORMAL, node: normalText, tandemName: 'normalSpeedRadioButton' },
        { value: SpeedType.SLOW_MOTION, node: slowText, tandemName: 'slowMotionRadioButton' }
      ], options );
    }
  }

  return gravityAndOrbits.register( 'SpeedRadioButtons', SpeedRadioButtons );
} );