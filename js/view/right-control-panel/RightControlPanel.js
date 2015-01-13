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

    // menu sections
    var sections = [
      new PlanetModeMenu( model, MENU_SECTION_OPTIONS ),
      new GravityModeMenu( model, MENU_SECTION_OPTIONS ),
      new SpaceObjectsPropertyCheckbox( model, MENU_SECTION_OPTIONS ),
      new MassMenu( model, MENU_SECTION_OPTIONS )
    ];

    // add thin rectangles to separate the differnet menu components
    // these get inserted into the sections array inbetween each component
    var separators = [];
    var numSeparators = sections.length - 1;
    for ( var i = 0; i < numSeparators; i++ ) {
      var separatorRectangle = new Rectangle( 0, 0, 0, 2, { fill: STROKE } );
      sections.splice( ( i * 2 ) + 1, 0, separatorRectangle );
      separators.push( separatorRectangle );
    }

    var vbox = new VBox( { children: sections, spacing: 4, y: 5, resize: false, align: 'left' } );
    Panel.call( this, vbox, { fill: '#030085', stroke: STROKE, lineWidth: 2, cornerRadius: 2, resize: false, xMargin: PANEL_X_MARGIN } );

    // resize the separators to allow them to go inside the panel margins
    var separatorWidth = vbox.width + 2 * PANEL_X_MARGIN;
    for ( i = 0; i < 3; i++ ) {
      separators[ i ].setRect( -PANEL_X_MARGIN, 0, separatorWidth, 2 );
    }

    // center bottom control section
    sections[ sections.length - 1 ].centerX = ( vbox.width / 2 ) - PANEL_X_MARGIN;
  }

  return inherit( Panel, RightControlPanel );
} );