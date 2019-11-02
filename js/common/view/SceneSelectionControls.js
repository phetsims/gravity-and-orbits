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
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // images
  const resetArrowImg = require( 'image!GRAVITY_AND_ORBITS/reset_arrow.png' );

  class SceneSelectionControls extends Node {

    /**
     * @param {Property.<GravityAndOrbitsScene>} modeIndexProperty
     * @param {Array.<GravityAndOrbitsScene>} modes
     * @param {Object} [options] - This object contains options for main node of planet mode menu.
     */
    constructor( modeIndexProperty, modes, options ) {
      super( options );

      const content = []; // for radio buttons
      const resetButtons = modes.map( ( mode, i ) => {
        content.push( { value: i, node: mode.iconImage, tandemName: mode.radioButtonTandemName } );

        // TODO(phet-io design): These should be nested in one node, so you can hide the whole thing.  But that will be complicated
        const resetButton = new PlanetModeResetButton( mode, {
          tandem: options.tandem.createTandem( mode.resetButtonTandemName )
        } );

        // link reset buttons so that only the reset button next to the selected radio button is visible
        modeIndexProperty.link( modeIndex => resetButton.setVisible( modes[ modeIndex ] === mode ) );

        return resetButton;
      } );
      const radioButtonGroup = new RadioButtonGroup( modeIndexProperty, content, {
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
        touchAreaYDilation: 0, // reduce to 0 to prevent overlap between buttons
        tandem: options.tandem.createTandem( 'radioButtonGroup' )
      } );

      this.addChild( radioButtonGroup );
      this.addChild( new VBox( { children: resetButtons, left: radioButtonGroup.right + 10, spacing: 5, y: 2 } ) );
      this.addChild( new HStrut( 219 ) );
    }
  }

  gravityAndOrbits.register( 'SceneSelectionControls', SceneSelectionControls );

  class PlanetModeResetButton extends RectangularPushButton {

    /**
     * @param {GravityAndOrbitsScene} mode
     * @param {Object} [options]
     */
    constructor( mode, options ) {
      options = merge( {
        content: new Node( {
          children: [
            new Image( resetArrowImg, { scale: 0.3 } )
          ]
        } ),
        xMargin: 5,
        yMargin: 3,
        baseColor: new Color( 220, 220, 220 ),
        listener: () => mode.resetMode()
      }, options );

      super( options );
    }
  }

  gravityAndOrbits.register( 'PlanetModeResetButton', PlanetModeResetButton );

  return SceneSelectionControls;
} );