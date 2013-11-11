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
  var Panel = require( 'SUN/Panel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  var slowMotionString = require( 'string!GRAVITY_AND_ORBITS/slowMotion' );
  var fastForwardString = require( 'string!GRAVITY_AND_ORBITS/fastForward' );
  var normalString = require( 'string!GRAVITY_AND_ORBITS/normal' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FONT = new PhetFont( 16 );

  function SpeedRadioButton( model, coords ) {
    Node.call( this, coords );

    this.addChild( new VerticalAquaRadioButtonGroup( [
      {property: model.speedProperty, value: 1.75, node: new Text( fastForwardString, { font: FONT, fill: '#fff', pickable: false, y: -7 } )},
      {property: model.speedProperty, value: 1, node: new Text( normalString, { font: FONT, fill: '#fff', pickable: false, y: -7 } )},
      {property: model.speedProperty, value: 0.25, node: new Text( slowMotionString, { font: FONT, fill: '#fff', pickable: false, y: -7 } )}
    ], {scale: 0.9} ) );
  }

  return inherit( Node, SpeedRadioButton );
} );