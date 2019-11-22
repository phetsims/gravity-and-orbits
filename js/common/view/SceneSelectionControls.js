// Copyright 2015-2019, University of Colorado Boulder

/**
 * Container for scene selection controls.
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
     * @param {Property.<GravityAndOrbitsScene>} sceneIndexProperty
     * @param {Array.<GravityAndOrbitsScene>} modes
     * @param {Object} [options] - This object contains options for main node of planet menu.
     */
    constructor( sceneIndexProperty, modes, options ) {
      super( options );

      const content = []; // for radio buttons
      const resetButtons = modes.map( ( scene, i ) => {
        content.push( { value: i, node: scene.iconImage, tandemName: scene.radioButtonTandemName } );

        // TODO(phet-io design): These should be nested in one node, so you can hide the whole thing.  But that will be complicated.  Worth it?
        const resetButton = new PlanetModeResetButton( scene, {
          tandem: options.tandem.createTandem( scene.resetButtonTandemName )
        } );

        // link reset buttons so that only the reset button next to the selected radio button is visible
        sceneIndexProperty.link( modeIndex => resetButton.setVisible( modes[ modeIndex ] === scene ) );

        return resetButton;
      } );
      const radioButtonGroup = new RadioButtonGroup( sceneIndexProperty, content, {
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
        tandem: options.tandem.createTandem( 'sceneSelectionRadioButtonGroup' )
      } );

      this.addChild( radioButtonGroup );
      this.addChild( new VBox( { children: resetButtons, left: radioButtonGroup.right + 10, spacing: 5, y: 2 } ) );
      this.addChild( new HStrut( 219 ) );
    }
  }

  gravityAndOrbits.register( 'SceneSelectionControls', SceneSelectionControls );

  class PlanetModeResetButton extends RectangularPushButton {

    /**
     * @param {GravityAndOrbitsScene} scene
     * @param {Object} [options]
     */
    constructor( scene, options ) {
      options = merge( {
        content: new Node( {
          children: [
            new Image( resetArrowImg, { scale: 0.3 } )
          ]
        } ),
        xMargin: 5,
        yMargin: 3,
        baseColor: new Color( 220, 220, 220 ),
        listener: () => scene.resetScene()
      }, options );

      super( options );
    }
  }

  gravityAndOrbits.register( 'PlanetModeResetButton', PlanetModeResetButton );

  return SceneSelectionControls;
} );