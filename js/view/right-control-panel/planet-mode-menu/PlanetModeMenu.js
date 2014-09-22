// Copyright 2002-2013, University of Colorado Boulder

/**
 * Container for planet mode menu.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var PlanetModeResetButton = require( 'view/right-control-panel/planet-mode-menu/PlanetModeResetButton' );
  var PlanetModeOption = require( 'view/right-control-panel/planet-mode-menu/PlanetModeOption' );

  /**
   * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
   * @param {Object} [options] - This object contains options for main node of planet mode menu.
   * @constructor
   */
  function PlanetModeMenu( model, options ) {
    Node.call( this, options );

    var content = []; // for radio buttons
    var resetButtons = [];
    for ( var i = 0; i < model.planetModes.length; i++ ) {
      content.push( { value: i, node: new PlanetModeOption( model, i ) } );

      var resetButton = new PlanetModeResetButton( model );

      // link reset buttons so that only the reset button next to the selected radio button is visible
      ( function( i, resetButton ) {
        model.planetModeProperty.link( function( mode ) {
          resetButton.visible = ( mode === i );
        } );
      } )( i, resetButton );

      resetButtons.push( resetButton );
    }

    var buttonGroup = new RadioButtonGroup( model.planetModeProperty, content,
      {
        alignVertically: true,
        selectedStroke: 'white',
        selectedLineWidth: 2,
        baseColor: 'rgba(0,0,0,0)',
        deselectedLineWidth: 0,
        buttonContentXMargin: 0,
        buttonContentYMargin: 0,
        spacing: -2,
        deselectedOpacity: 1,
        cornerRadius: 5
      } );

    this.addChild( buttonGroup );

    this.addChild( new VBox( { children: resetButtons, left: buttonGroup.right + 4.5, spacing: 2.5, y: 2.5 } ) );
  }

  return inherit( Node, PlanetModeMenu );
} );