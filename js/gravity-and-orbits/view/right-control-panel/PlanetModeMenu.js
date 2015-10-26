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
  var Image = require( 'SCENERY/nodes/Image' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsColorProfile' );

  // images
  var resetArrowImg = require( 'image!GRAVITY_AND_ORBITS/reset_arrow.png' );

  /**
   * @param {GravityAndOrbitsMode} mode
   * @param {Object} [options]
   * @constructor
   */
  function PlanetModeResetButton( mode, options ) {

    // create button
    RectangularPushButton.call( this,
      {
        content: new Node( {
          children: [
            new Image( resetArrowImg, { scale: 0.3 } )
          ]
        } ),
        xMargin: 5,
        yMargin: 3,
        listener: function() {
          mode.resetMode();
        }
      } );

    this.mutate( options );
  }

  inherit( RectangularPushButton, PlanetModeResetButton );

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
      content.push( { value: modes[ i ], node: modes[ i ].iconImage } );

      var resetButton = new PlanetModeResetButton( modes[ i ] );

      // link reset buttons so that only the reset button next to the selected radio button is visible
      (function( currentMode, resetButton ) {
        module.modeProperty.link( function( mode ) {
          resetButton.visible = ( mode === currentMode );
        } );
      })( modes[ i ], resetButton );

      resetButtons.push( resetButton );
    }
    var buttonGroup = new RadioButtonGroup( module.modeProperty, content,
      {
        alignVertically: true,
        selectedStroke: 'white',
        selectedLineWidth: 2,
        baseColor: 'rgba(0,0,0,0)',
        deselectedLineWidth: 0,
        buttonContentXMargin: 5,
        buttonContentYMargin: 5,
        spacing: 0,
        deselectedOpacity: 1,
        cornerRadius: 5
      } );

    // TODO: RadioButtonGroup doesn't support changing the selectedStroke
    GravityAndOrbitsColorProfile.panelTextProperty.link( function( color ) {
      buttonGroup.selectedStroke = color;
    } );

    this.addChild( buttonGroup );
    this.addChild( new VBox( { children: resetButtons, left: buttonGroup.right + 10, spacing: 5, y: 2 } ) );
  }

  return inherit( Node, PlanetModeMenu );
} );