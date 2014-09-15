// Copyright 2002-2013, University of Colorado Boulder

/**
 * Container for gravity mode menu.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var gravityString = require( 'string!GRAVITY_AND_ORBITS/gravity' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var HBox = require( 'SCENERY/nodes/HBox' );

  // strings
  var onString = require( 'string!GRAVITY_AND_ORBITS/on' );
  var offString = require( 'string!GRAVITY_AND_ORBITS/off' );

  // constants
  var FONT = new PhetFont( 14 );

  /**
   * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
   * @param {Object} [options] - This object contains options for main node of gravity mode menu.
   * @constructor
   */
  function GravityModeMenu( model, options ) {
    Node.call( this, options );

    this.addChild( new HBox( {spacing: 10, bottom: 2, children: [
      new Text( gravityString + ':', { font: FONT, fill: '#fff', pickable: false } ),
      new AquaRadioButton( model.gravityProperty, true, new Text( onString, { font: FONT, fill: '#fff', pickable: false } ), {radius: 7} ),
      new AquaRadioButton( model.gravityProperty, false, new Text( offString, { font: FONT, fill: '#fff', pickable: false } ), {radius: 7} )
    ]} ) );
  }

  return inherit( Node, GravityModeMenu );
} );