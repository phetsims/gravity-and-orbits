// Copyright 2015-2019, University of Colorado Boulder

/**
 * Container for planet mode menu.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // images
  const resetArrowImg = require( 'image!GRAVITY_AND_ORBITS/reset_arrow.png' );

  /**
   * @param {Property.<GravityAndOrbitsMode>} modeProperty
   * @param {Array.<GravityAndOrbitsMode>} modes
   * @param {Object} [options] - This object contains options for main node of planet mode menu.
   * @constructor
   */
  function ModeControl( modeProperty, modes, options ) {
    Node.call( this, options );

    const content = []; // for radio buttons
    const resetButtons = [];
    for ( let i = 0; i < modes.length; i++ ) {
      content.push( { value: modes[ i ], node: modes[ i ].iconImage } );

      const resetButton = new PlanetModeResetButton( modes[ i ] );

      // link reset buttons so that only the reset button next to the selected radio button is visible
      (function( currentMode, resetButton ) {
        modeProperty.link( function( mode ) {
          resetButton.visible = ( mode === currentMode );
        } );
      })( modes[ i ], resetButton );

      resetButtons.push( resetButton );
    }
    const buttonGroup = new RadioButtonGroup( modeProperty, content,
      {
        alignVertically: true,
        selectedStroke: GravityAndOrbitsColorProfile.panelTextProperty,
        selectedLineWidth: 2,
        baseColor: 'rgba(0,0,0,0)',
        deselectedLineWidth: 0,
        buttonContentXMargin: 5,
        buttonContentYMargin: 5,
        spacing: 0,
        resize: false,
        deselectedOpacity: 1,
        cornerRadius: 5,
        touchAreaYDilation: 0 // reduce to 0 to prevent overlap between buttons
      } );

    this.addChild( buttonGroup );
    this.addChild( new VBox( { children: resetButtons, left: buttonGroup.right + 10, spacing: 5, y: 2 } ) );
    this.addChild( new HStrut( 219 ) );
  }

  gravityAndOrbits.register( 'ModeControl', ModeControl );

  inherit( Node, ModeControl );

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
        baseColor: new Color( 220, 220, 220 ),
        listener: function() {
          mode.resetMode();
        }
      } );

    this.mutate( options );
  }

  inherit( RectangularPushButton, PlanetModeResetButton );

  return ModeControl;
} );