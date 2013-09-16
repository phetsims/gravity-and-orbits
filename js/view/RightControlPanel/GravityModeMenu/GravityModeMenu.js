/**
 * Copyright 2002-2013, University of Colorado
 * view for gravity mode menu
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );

  var Strings = require( 'Strings' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FONT = new PhetFont( 16 );

  function GravityModeMenu( model, coords ) {
    Node.call( this, coords );

    // add "gravity" text
    this.addChild( new Text( Strings['GAO.gravity'] + ':', { font: FONT, fill: '#fff', pickable: false } ) );

    // add on/off buttons
    this.addChild( new AquaRadioButton( model.gravityProperty, true, new Text( Strings['GAO.on'], { font: FONT, fill: '#fff', pickable: false, x: 82 } ), {radius: 7, x: 70, y: -5} ) );
    this.addChild( new AquaRadioButton( model.gravityProperty, false, new Text( Strings['GAO.off'], { font: FONT, fill: '#fff', pickable: false, x: 132 } ), {radius: 7, x: 120, y: -5 } ) );
  }

  inherit( Node, GravityModeMenu );

  return GravityModeMenu;
} );