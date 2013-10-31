// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for speed control buttons
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );

  var PlayPauseButton = require('view/BottomControlPanel/SpeedPushButtons/PlayPauseButton');

  function SpeedPushButtons( model, coords ) {
    var self = this;
    Node.call( this, coords );

    // add speed push buttons
    this.addChild( new PlayPauseButton( model, {x: 0, y: 0} ) );
  }

  inherit( Node, SpeedPushButtons );

  return SpeedPushButtons;
} );