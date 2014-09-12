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
  var inherit = require( 'PHET_CORE/inherit' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var PlanetModeResetButton = require( 'view/right-control-panel/planet-mode-menu/PlanetModeResetButton' );
  var PlanetModeOption = require( 'view/right-control-panel/planet-mode-menu/PlanetModeOption' );

  /**
   * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
   * @param {Object} options - This object contains options for main node of planet mode menu.
   * @constructor
   */
  function PlanetModeMenu( model, options ) {
    Node.call( this, options );

    // add reset button
    this.addChild( new PlanetModeResetButton( model, { x: 161 }, 30 ) );

    var content = [];
    for ( var i = 0; i < model.planetModes.length; i++ ) {
      content.push( { value: i, node: new PlanetModeOption( model, i ) } );
    }

    this.addChild( new RadioButtonGroup( model.planetModeProperty, content,
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
      } ) );
  }

  return inherit( Node, PlanetModeMenu );
} );