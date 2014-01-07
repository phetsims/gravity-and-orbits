// Copyright 2002-2013, University of Colorado Boulder

/**
 * Container for planet mode menu.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' ),
    inherit = require( 'PHET_CORE/inherit' ),
    PlanetModeResetButton = require( 'view/right-control-panel/planet-mode-menu/PlanetModeResetButton' ),
    PlanetModeOption = require( 'view/right-control-panel/planet-mode-menu/PlanetModeOption' );

  /**
   * @param {Object} model set of properties
   * @param {Object} options options for node
   */

  function PlanetModeMenu( model, options ) {
    Node.call( this, options );

    // add reset button
    var dy = 30;
    this.addChild( new PlanetModeResetButton( model, {x: 161, y: -13}, dy ) );

    // add planet mode options
    for ( var i = 0; i < model.planetModes.length; i++ ) {
      this.addChild( new PlanetModeOption( model, {x: 0, y: -15 + i * dy}, i ) );
    }
  }

  return inherit( Node, PlanetModeMenu );
} );