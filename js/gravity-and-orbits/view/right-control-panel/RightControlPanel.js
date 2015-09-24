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
  var MassMenu = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/right-control-panel/MassMenu' );
  var SpaceObjectsPropertyCheckbox = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/right-control-panel/SpaceObjectsPropertyCheckbox' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsColorProfile' );

  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var STROKE = '#8E9097';
  var MENU_SECTION_OPTIONS = { x: 5 };
  var PANEL_X_MARGIN = 5;

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
      scale: 1.05
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
      new MassMenu( module, MENU_SECTION_OPTIONS )
    ];

    var vbox = new VBox( { children: sections, spacing: 4, y: 5, resize: false, align: 'left' } );
    Panel.call( this, vbox, options );

    // resize the separators to allow them to go inside the panel margins
    var separatorWidth = vbox.width + 2 * PANEL_X_MARGIN;
    for ( var i = 0; i < 3; i++ ) {
      sections[ i * 2 + 1 ].setRect( -PANEL_X_MARGIN, 0, separatorWidth, 2 );
    }

    var thisPanel = this;
    GravityAndOrbitsColorProfile.panelBackgroundProperty.link( function( color ) {
      thisPanel.fill = color;
    } );
  }

  return inherit( Panel, RightControlPanel );
} );