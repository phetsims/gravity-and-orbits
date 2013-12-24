// Copyright 2002-2013, University of Colorado Boulder

/**
 * Container for bottom control panel.
 * Include day counter, speed radio buttons and speed controls.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' ),
    inherit = require( 'PHET_CORE/inherit' ),
    SpeedPushButtons = require( 'view/bottom-control-panel/SpeedPushButtons' ),
    SpeedRadioButtons = require( 'view/bottom-control-panel/SpeedRadioButtons' ),
    DayCounter = require( 'view/bottom-control-panel/DayCounter' ),
    HBox = require( 'SCENERY/nodes/HBox' );

  function BottomControlPanel( model, x, y ) {
    Node.call( this, {x: x, y: y, scale: 0.9, children: [
      new HBox( {spacing: 20, children: [
        // add speed check box
        new SpeedRadioButtons( model ),

        // add speed push buttons
        new SpeedPushButtons( model ),

        //add day counter
        new DayCounter( model ) ]
      } )
    ]} );
  }

  return inherit( Node, BottomControlPanel );
} );