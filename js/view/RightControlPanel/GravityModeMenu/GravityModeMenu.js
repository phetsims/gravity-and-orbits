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

  var gravityString = require( 'string!GRAVITY_AND_ORBITS/gravity' );
  var onString = require( 'string!GRAVITY_AND_ORBITS/on' );
  var offString = require( 'string!GRAVITY_AND_ORBITS/off' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FONT = new PhetFont( 14 );

  function GravityModeMenu( model, coords ) {
    Node.call( this, coords );

    // add "gravity" text
    this.addChild( new Text( gravityString + ':', { font: FONT, fill: '#fff', pickable: false, y: -1 } ) );

    // add on/off buttons
    this.addChild( new AquaRadioButton( model.gravityProperty, true, new Text( onString, { font: FONT, fill: '#fff', pickable: false, x: 82 } ), {radius: 7, x: 70, y: -6} ) );
    this.addChild( new AquaRadioButton( model.gravityProperty, false, new Text( offString, { font: FONT, fill: '#fff', pickable: false, x: 132 } ), {radius: 7, x: 120, y: -6 } ) );
  }

  inherit( Node, GravityModeMenu );

  return GravityModeMenu;
} );