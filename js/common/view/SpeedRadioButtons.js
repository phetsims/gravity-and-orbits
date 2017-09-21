// Copyright 2013-2017, University of Colorado Boulder

/**
 * Visual representation of speed radio buttons.
 * Three different modes: slow/normal/fast motion.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis (PhET)
 */

define( function( require ) {
  'use strict';

  // modules
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  var GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  var fastForwardString = require( 'string!GRAVITY_AND_ORBITS/fastForward' );
  var normalString = require( 'string!GRAVITY_AND_ORBITS/normal' );
  var slowMotionString = require( 'string!GRAVITY_AND_ORBITS/slowMotion' );

  /**
   * @param {Property.<number>} speedProperty - The rate of flow of time.
   * @param [options]
   * @constructor
   */
  function SpeedRadioButtons( speedProperty, options ) {

    options = _.extend( {
      spacing: 1,
      radius: 8,
      touchAreaXDilation: 5
    }, options );

    var textOptions = {
      font: new PhetFont( 18 ),
      fill: GravityAndOrbitsColorProfile.bottomControlTextProperty,
      maxWidth: 200
    };
    var fastText = new Text( fastForwardString, textOptions );
    var normalText = new Text( normalString, textOptions );
    var slowText = new Text( slowMotionString, textOptions );

    VerticalAquaRadioButtonGroup.call( this, [
      { property: speedProperty, value: GravityAndOrbitsConstants.FAST_SPEED_SCALE, node: fastText },
      { property: speedProperty, value: GravityAndOrbitsConstants.STARTING_SPEED_SCALE, node: normalText },
      { property: speedProperty, value: GravityAndOrbitsConstants.SLOW_SPEED_SCALE, node: slowText }
    ], options );
  }

  gravityAndOrbits.register( 'SpeedRadioButtons', SpeedRadioButtons );

  return inherit( VerticalAquaRadioButtonGroup, SpeedRadioButtons );
} );
