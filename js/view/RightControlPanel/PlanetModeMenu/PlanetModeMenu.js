/**
 * Copyright 2002-2013, University of Colorado
 * view for planet mode menu
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PlanetModeResetButton = require( 'view/RightControlPanel/PlanetModeMenu/PlanetModeResetButton' );
  var PlanetModeOption = require( 'view/RightControlPanel/PlanetModeMenu/PlanetModeOption' );

  function PlanetModeMenu( model, coords ) {
    Node.call( this, coords );

    // add reset button
    this.addChild( new PlanetModeResetButton( model, {x: 143, y: 7} ) );

    // add planet mode options
    this.addChild( new PlanetModeOption( model, {x: 7, y: 5}, 0 ) );
    this.addChild( new PlanetModeOption( model, {x: 7, y: 35}, 1 ) );
    this.addChild( new PlanetModeOption( model, {x: 7, y: 65}, 2 ) );
    this.addChild( new PlanetModeOption( model, {x: 7, y: 95}, 3 ) );
  }

  inherit( Node, PlanetModeMenu );

  return PlanetModeMenu;
} );