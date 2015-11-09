// Copyright 2013-2015, University of Colorado Boulder

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
  var inherit = require( 'PHET_CORE/inherit' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var GravityAndOrbitsModule = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/GravityAndOrbitsModule' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsColorProfile' );

  // constants
  var STARTING_VALUE = GravityAndOrbitsModule.STARTING_SPEED_SCALE;

  // strings
  var normalString = require( 'string!GRAVITY_AND_ORBITS/normal' );
  var slowMotionString = require( 'string!GRAVITY_AND_ORBITS/slowMotion' );
  var fastForwardString = require( 'string!GRAVITY_AND_ORBITS/fastForward' );

  /**
   * @param {Property.<number>} speedProperty - The rate of flow of time.
   * @param [options]
   * @constructor
   */
  function SpeedRadioButtons( speedProperty, options ) {

    options = _.extend( {
      spacing: 1,
      radius: 8
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
      { property: speedProperty, value: STARTING_VALUE * 1.75, node: fastText },
      { property: speedProperty, value: STARTING_VALUE, node: normalText },
      { property: speedProperty, value: STARTING_VALUE * 0.25, node: slowText }
    ], options );
  }

  return inherit( VerticalAquaRadioButtonGroup, SpeedRadioButtons );
} );