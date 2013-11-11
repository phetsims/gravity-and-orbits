// Copyright 2002-2013, University of Colorado Boulder

/**
 * Container for speed control buttons.
 * Contains play/pause, rewind and forward button.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );

  var PlayPauseButton = require( 'view/bottom-control-panel/speed-push-buttons/PlayPauseButton' );

  function SpeedPushButtons( model, coords ) {
    var self = this;
    Node.call( this, coords );

    // add speed push buttons
    this.addChild( new PlayPauseButton( model, {x: 0, y: 0} ) );
  }

  return inherit( Node, SpeedPushButtons );
} );