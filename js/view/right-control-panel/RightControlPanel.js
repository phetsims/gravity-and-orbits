// Copyright 2002-2013, University of Colorado Boulder

/**
 * Container for right control panel.
 * Include planet mode menu, gravity switcher, checkbox with properties and mass sliders.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var Panel = require( 'SUN/Panel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PlanetModeMenu = require( 'view/right-control-panel/planet-mode-menu/PlanetModeMenu' );
  var GravityModeMenu = require( 'view/right-control-panel/GravityModeMenu' );
  var SpaceObjectsPropertyCheckbox = require( 'view/right-control-panel/SpaceObjectsPropertyCheckbox' );
  var MassMenu = require( 'view/right-control-panel/mass-menu/MassMenu' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var STROKE = '#8E9097';
  var MENU_SECTION_OPTIONS = { x: 5 };
  var PANEL_X_MARGIN = 5;

  /**
   * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
   * @constructor
   */
  function RightControlPanel( model ) {

    // add thin rectangles to separate the differnet menu components
    var separators = [];
    for ( var i = 0; i < 3; i++ ) {
      separators.push( new Rectangle( 0, 0, 0, 2, { fill: STROKE } ) );
    }

    // add menu sections with separator rectangles in between
    var sections = [
      new PlanetModeMenu( model, MENU_SECTION_OPTIONS ),
      separators[0],
      new GravityModeMenu( model, MENU_SECTION_OPTIONS ),
      separators[1],
      new SpaceObjectsPropertyCheckbox( model, MENU_SECTION_OPTIONS ),
      separators[2],
      new MassMenu( model, MENU_SECTION_OPTIONS )
    ];

    var vbox = new VBox( { children: sections, spacing: 4, y: 5, resize: false } );
    Panel.call( this, vbox, { fill: '#030085', stroke: STROKE, lineWidth: 2, cornerRadius: 2, resize: false, xMargin: PANEL_X_MARGIN } );

    // resize the separators to account for the margin
    var separatorWidth = vbox.width + 2 * PANEL_X_MARGIN;
    for ( i = 0; i < 3; i++ ) {
      separators[i].setRect( -separatorWidth / 2, 0, separatorWidth, 2 );
    }
  }

  return inherit( Panel, RightControlPanel );
} );