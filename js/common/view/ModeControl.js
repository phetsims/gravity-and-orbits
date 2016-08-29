// Copyright 2015, University of Colorado Boulder

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
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  // images
  var resetArrowImg = require( 'image!GRAVITY_AND_ORBITS/reset_arrow.png' );

  /**
   * @param {Property.<GravityAndOrbitsMode>} modeProperty
   * @param {Array.<GravityAndOrbitsMode>} modes
   * @param {Object} [options] - This object contains options for main node of planet mode menu.
   * @constructor
   */
  function ModeControl( modeProperty, modes, options ) {
    Node.call( this, options );

    var content = []; // for radio buttons
    var resetButtons = [];
    for ( var i = 0; i < modes.length; i++ ) {
      content.push( { value: modes[ i ], node: modes[ i ].iconImage } );

      var resetButton = new PlanetModeResetButton( modes[ i ] );

      // link reset buttons so that only the reset button next to the selected radio button is visible
      (function( currentMode, resetButton ) {
        modeProperty.link( function( mode ) {
          resetButton.visible = ( mode === currentMode );
        } );
      })( modes[ i ], resetButton );

      resetButtons.push( resetButton );
    }
    var buttonGroup = new RadioButtonGroup( modeProperty, content,
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

  gravityAndOrbits.register( 'ModeControl.PlanetModeResetButton', PlanetModeResetButton );

  inherit( RectangularPushButton, PlanetModeResetButton );

  return ModeControl;
} );
