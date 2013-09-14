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
  var Strings = require( 'Strings' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlanetModeMenu = require( 'view/RightControlPanel/PlanetModeMenu/PlanetModeMenu' );

  var FONT = new PhetFont( 16 );

  function RightControlPanel( model, x, y ) {
    Node.call( this, {x: x, y: y} );

    // add background
    this.addChild( new Rectangle( 0, 0, 175, 375, 2, 2, {fill: '#030085', stroke: '#8E9097', lineWidth: 2} ) );

    // add planet mode menu
    this.addChild( new PlanetModeMenu( model ) );
  }

  inherit( Node, RightControlPanel );

  return RightControlPanel;
} )
;