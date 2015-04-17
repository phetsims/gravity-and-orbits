// Copyright 2002-2015, University of Colorado Boulder

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

  // constants
  var STARTING_VALUE = GravityAndOrbitsModule.STARTING_SPEED_SCALE;

  // strings
  var normalString = require( 'string!GRAVITY_AND_ORBITS/normal' );
  var slowMotionString = require( 'string!GRAVITY_AND_ORBITS/slowMotion' );
  var fastForwardString = require( 'string!GRAVITY_AND_ORBITS/fastForward' );

  /**
   * @param {Property} speedProperty - The rate of flow of time.
   * @param [options]
   * @constructor
   */
  function SpeedRadioButtons( speedProperty, options ) {

    options = _.extend( {
      spacing: 1,
      radius: 10
    }, options );

    var textOption = { font: new PhetFont( 22 ), fill: '#fff', pickable: false, y: -7 };
    VerticalAquaRadioButtonGroup.call( this, [
      { property: speedProperty, value: STARTING_VALUE * 1.75, node: new Text( fastForwardString, textOption ) },
      { property: speedProperty, value: STARTING_VALUE, node: new Text( normalString, textOption ) },
      { property: speedProperty, value: STARTING_VALUE * 0.25, node: new Text( slowMotionString, textOption ) }
    ], options );
  }

  return inherit( VerticalAquaRadioButtonGroup, SpeedRadioButtons );
} );