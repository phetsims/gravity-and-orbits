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
  var PlanetModeMenu = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/right-control-panel/PlanetModeMenu' );
  var GravityModeMenu = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/right-control-panel/GravityModeMenu' );
  var SpaceObjectsPropertyCheckbox = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/right-control-panel/SpaceObjectsPropertyCheckbox' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsColorProfile' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var BodyMassControl = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/right-control-panel/BodyMassControl' );

  // constants
  var STROKE = '#8E9097';
  var MENU_SECTION_OPTIONS = { x: 5 };
  var PANEL_X_MARGIN = 5;
  var H_STRUT_WIDTH = 220;

  function MassSliderBox() {
    VBox.call( this, { spacing: 5 } );
  }

  inherit( VBox, MassSliderBox, {
    setBodyMassControl: function( bodyMassControl ) {
      this.removeAllChildren();
      this.addChild( new HStrut( H_STRUT_WIDTH ) );
      this.addChild( bodyMassControl );
      this.addChild( new HStrut( H_STRUT_WIDTH ) );
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

      sections[ 6 ].setBodyMassControl( new BodyMassControl(
        massSettableBodies[ 0 ],
        massSettableBodies[ 0 ].massProperty.getInitialValue() / 2,
        massSettableBodies[ 0 ].massProperty.getInitialValue() * 2,
        massSettableBodies[ 0 ].tickValue,
        massSettableBodies[ 0 ].tickLabel ) );
      sections[ 8 ].setBodyMassControl( new BodyMassControl(
        massSettableBodies[ 1 ],
        massSettableBodies[ 1 ].massProperty.getInitialValue() / 2,
        massSettableBodies[ 1 ].massProperty.getInitialValue() * 2,
        massSettableBodies[ 1 ].tickValue,
        massSettableBodies[ 1 ].tickLabel ) );
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