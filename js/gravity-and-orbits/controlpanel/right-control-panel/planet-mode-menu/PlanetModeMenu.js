// Copyright 2002-2015, University of Colorado Boulder

/**
 * Container for planet mode menu.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis
 */

define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var PlanetModeResetButton = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/controlpanel/right-control-panel/planet-mode-menu/PlanetModeResetButton' );
  var PlanetModeOption = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/controlpanel/right-control-panel/planet-mode-menu/PlanetModeOption' );

  /**
   * @param {GravityAndOrbitsModule} module
   * @param {Object} [options] - This object contains options for main node of planet mode menu.
   * @constructor
   */
  function PlanetModeMenu( module, options ) {
    Node.call( this, options );

    var content = []; // for radio buttons
    var resetButtons = [];
    var modes = module.getModes();
    for ( var i = 0; i < modes.length; i++ ) {
      content.push( { value: modes[i], node: modes[i].newControl() } );

      var resetButton = new PlanetModeResetButton( module );

      // link reset buttons so that only the reset button next to the selected radio button is visible
      (function( i, resetButton ) {
        module.modeProperty.link( function( mode ) {
          resetButton.visible = ( mode === i );
        } );
      })( i, resetButton );

      resetButtons.push( resetButton );
    }
    var buttonGroup = new RadioButtonGroup( module.modeProperty, content,
      {
        alignVertically: true,
        selectedStroke: 'white',
        selectedLineWidth: 2,
        baseColor: 'rgba(0,0,0,0)',
        deselectedLineWidth: 0,
        buttonContentXMargin: 2.5,
        buttonContentYMargin: 2.5,
        spacing: -2,
        deselectedOpacity: 1,
        cornerRadius: 5
      } );

    this.addChild( buttonGroup );

    this.addChild( new VBox( { children: resetButtons, left: buttonGroup.right + 4.5, spacing: 2.5, y: 2.5 } ) );
  }

  return inherit( Node, PlanetModeMenu );
} );