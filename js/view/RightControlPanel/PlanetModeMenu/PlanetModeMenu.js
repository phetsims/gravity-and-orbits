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
    this.addChild( new PlanetModeResetButton( model, {x: 161, y: -13} ) );

    // add planet mode options
    this.addChild( new PlanetModeOption( model, {x: 0, y: -15}, {num: 0, sun: true, earth: true, moon: false, spaceStation: false} ) );
    this.addChild( new PlanetModeOption( model, {x: 0, y: 15}, {num: 1, sun: true, earth: true, moon: true, spaceStation: false} ) );
    this.addChild( new PlanetModeOption( model, {x: 0, y: 45}, {num: 2, sun: false, earth: true, moon: true, spaceStation: false} ) );
    this.addChild( new PlanetModeOption( model, {x: 0, y: 75}, {num: 3, sun: false, earth: true, moon: false, spaceStation: true} ) );
  }

  inherit( Node, PlanetModeMenu );

  return PlanetModeMenu;
} );