// Copyright 2002-2015, University of Colorado Boulder

/**
 * Container for right control panel.
 *
 * @author Aaron Davis
 */

define( function( require ) {
  'use strict';

  // modules
  var Panel = require( 'SUN/Panel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlanetModeMenu = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/right-control-panel/PlanetModeMenu' );
  var GravityModeMenu = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/right-control-panel/GravityModeMenu' );
  var SpaceObjectsPropertyCheckbox = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/right-control-panel/SpaceObjectsPropertyCheckbox' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsColorProfile' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var BodyMassControl = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/right-control-panel/BodyMassControl' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // constants
  var STROKE = '#8E9097';
  var MENU_SECTION_OPTIONS = { x: 5 };
  var PANEL_X_MARGIN = 5;
  var CONTROL_FONT = new PhetFont( 14 );

  function MassSliderBox() {
    Node.call( this );
  }

  inherit( Node, MassSliderBox, {
    setBodyMassControl: function( massSettableBody ) {
      this.removeAllChildren();

      var label = new Text( massSettableBody.name, {
        font: CONTROL_FONT,
        fontWeight: 'bold',
        fill: GravityAndOrbitsColorProfile.panelTextProperty
      } );

      var image = massSettableBody.createRenderer( 14 );

      // Top component that shows the body's name and icon
      var content = new HBox( { children: [ label, image ], spacing: 10 } );

      this.addChild( content );

      this.addChild( new VBox( {
        top: content.bottom + 10,
        resize: false,
        children: [
          new HStrut( 220 ),
          new BodyMassControl(
            massSettableBody,
            massSettableBody.massProperty.getInitialValue() / 2,
            massSettableBody.massProperty.getInitialValue() * 2,
            massSettableBody.tickValue,
            massSettableBody.tickLabel )
        ]
      } ) );
    }
  } );

  /**
   * @param {GravityAndOrbitsModule} module
   * @param {Object} [options]
   * @constructor
   */
  function RightControlPanel( module, options ) {

    options = _.extend( {
      stroke: STROKE,
      lineWidth: 2,
      cornerRadius: 2,
      resize: false,
      xMargin: PANEL_X_MARGIN,
      scale: 1.05,
      fill: GravityAndOrbitsColorProfile.panelBackgroundProperty
    }, options );

    var makeSeparatorRectangle = function() {
      return new Rectangle( 0, 0, 0, 2, { fill: STROKE } );
    };

    // menu sections and separators
    var sections = [
      new PlanetModeMenu( module, MENU_SECTION_OPTIONS ),
      makeSeparatorRectangle(),
      new GravityModeMenu( module, MENU_SECTION_OPTIONS ),
      makeSeparatorRectangle(),
      new SpaceObjectsPropertyCheckbox( module, MENU_SECTION_OPTIONS ),
      makeSeparatorRectangle(),
      new MassSliderBox(),
      makeSeparatorRectangle(),
      new MassSliderBox()
    ];

    module.modeProperty.link( function( mode ) {
      var massSettableBodies = mode.getMassSettableBodies();
      assert && assert( massSettableBodies.length === 2, 'There should be 2 mass settable bodies per mode' );

      sections[ 6 ].setBodyMassControl( massSettableBodies[ 0 ] );
      sections[ 8 ].setBodyMassControl( massSettableBodies[ 1 ] );
    } );

    assert && assert( sections.length === 9, 'There should be 9 sections in the RightControlPanel' );

    var vbox = new VBox( { children: sections, spacing: 4, y: 5, resize: false, align: 'left' } );
    Panel.call( this, vbox, options );

    // resize the separators to allow them to go inside the panel margins
    var separatorWidth = vbox.width + 2 * PANEL_X_MARGIN;
    for ( var i = 0; i < Math.floor( sections.length / 2 ); i++ ) {
      sections[ i * 2 + 1 ].setRect( -PANEL_X_MARGIN, 0, separatorWidth, 2 );
    }
  }

  return inherit( Panel, RightControlPanel );
} );