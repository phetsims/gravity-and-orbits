/**
 * Copyright 2002-2013, University of Colorado
 * view for button scale control
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PlanetModeMenu = require( 'view/RightControlPanel/PlanetModeMenu/PlanetModeMenu' );
  var GravityModeMenu = require( 'view/RightControlPanel/GravityModeMenu/GravityModeMenu' );

  function RightControlPanel( model, x, y ) {
    Node.call( this, {x: x, y: y} );

    // add background
    this.addChild( new Rectangle( 0, 0, 200, 375, 2, 2, {fill: '#030085', stroke: '#8E9097', lineWidth: 2} ) );

    // add planet mode menu
    this.addChild( new PlanetModeMenu( model, {x: 7, y: 5} ) );

    // add gravity mode menu
    this.addChild( new GravityModeMenu( model, {x: 7, y: 145} ) );
  }

  inherit( Node, RightControlPanel );

  return RightControlPanel;
} );