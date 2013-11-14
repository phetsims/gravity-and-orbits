// Copyright 2002-2013, University of Colorado Boulder

/**
 * Container for gravity mode menu.
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
  var HBox = require( 'SCENERY/nodes/HBox' );

  function GravityModeMenu( model, coords ) {
    Node.call( this, coords );

    this.addChild( new HBox( {spacing: 10, bottom: 2, children: [
      new Text( gravityString + ':', { font: FONT, fill: '#fff', pickable: false } ),
      new AquaRadioButton( model.gravityProperty, true, new Text( onString, { font: FONT, fill: '#fff', pickable: false } ), {radius: 7} ),
      new AquaRadioButton( model.gravityProperty, false, new Text( offString, { font: FONT, fill: '#fff', pickable: false } ), {radius: 7} )
    ]} ) );
  }

  return inherit( Node, GravityModeMenu );
} );