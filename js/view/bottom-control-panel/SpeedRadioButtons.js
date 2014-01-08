// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of speed radio buttons.
 * Three different modes: slow/normal/fast motion.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' ),
    VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' ),
    slowMotionString = require( 'string!GRAVITY_AND_ORBITS/slowMotion' ),
    fastForwardString = require( 'string!GRAVITY_AND_ORBITS/fastForward' ),
    normalString = require( 'string!GRAVITY_AND_ORBITS/normal' ),
    Text = require( 'SCENERY/nodes/Text' ),
    PhetFont = require( 'SCENERY_PHET/PhetFont' );

  function SpeedRadioButtons( model ) {
    var textOption = { font: new PhetFont( 16 ), fill: '#fff', pickable: false, y: -7 };
    VerticalAquaRadioButtonGroup.call( this, [
      {property: model.speedProperty, value: 1.75, node: new Text( fastForwardString, textOption )},
      {property: model.speedProperty, value: 1, node: new Text( normalString, textOption )},
      {property: model.speedProperty, value: 0.25, node: new Text( slowMotionString, textOption )}
    ], {
      spacing: 1,
      radius: 10
    } );
  }

  return inherit( VerticalAquaRadioButtonGroup, SpeedRadioButtons );
} );