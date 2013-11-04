// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for bottom control panel
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SpeedPushButtons = require( 'view/BottomControlPanel/SpeedPushButtons/SpeedPushButtons' );
  var SpeedCheckbox = require( 'view/BottomControlPanel/SpeedCheckbox/SpeedCheckbox' );
  var DayCounter = require( 'view/BottomControlPanel/DayCounter/DayCounter' );

  function BottomControlPanel( model, x, y ) {
    Node.call( this, {x: x, y: y, scale: 0.9} );

    // add speed check box
    this.addChild( new SpeedCheckbox( model, {x: 0, y: 25} ) );

    // add speed push buttons
    this.addChild( new SpeedPushButtons( model, {x: 180, y: 15} ) );

    // add speed push buttons
    this.addChild( new DayCounter( model, {x: 275, y: 15} ) );
  }

  inherit( Node, BottomControlPanel );

  return BottomControlPanel;
} );