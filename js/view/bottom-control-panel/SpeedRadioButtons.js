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
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  var slowMotionString = require( 'string!GRAVITY_AND_ORBITS/slowMotion' );
  var fastForwardString = require( 'string!GRAVITY_AND_ORBITS/fastForward' );
  var normalString = require( 'string!GRAVITY_AND_ORBITS/normal' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  function SpeedRadioButtons( model ) {
    var textOption = { font: new PhetFont( 16 ), fill: '#fff', pickable: false, y: -7 };
    Node.call( this );

    this.addChild( new VerticalAquaRadioButtonGroup( [
      {property: model.speedProperty, value: 1.75, node: new Text( fastForwardString, textOption )},
      {property: model.speedProperty, value: 1, node: new Text( normalString, textOption )},
      {property: model.speedProperty, value: 0.25, node: new Text( slowMotionString, textOption )}
    ], {scale: 0.9} ) );
  }

  return inherit( Node, SpeedRadioButtons );
} );