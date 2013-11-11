// Copyright 2002-2013, University of Colorado Boulder

/**
 * Container for bottom control panel.
 * Include day counter, speed radio buttons and speed controls.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SpeedPushButtons = require( 'view/bottom-control-panel/speed-push-buttons/SpeedPushButtons' );
  var SpeedCheckbox = require( 'view/bottom-control-panel/SpeedRadioButton' );
  var DayCounter = require( 'view/bottom-control-panel/DayCounter' );

  function BottomControlPanel( model, x, y ) {
    Node.call( this, {x: x, y: y, scale: 0.9, children: [

      // add speed check box
      new SpeedCheckbox( model, {x: 0, y: 25} ),

      // add speed push buttons
      new SpeedPushButtons( model, {x: 180, y: 15} ),

      //add Day counter
      new DayCounter( model, {x: 275, y: 15} )
    ]} );
  }

  return inherit( Node, BottomControlPanel );
} );