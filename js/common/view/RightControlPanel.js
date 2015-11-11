// Copyright 2013-2015, University of Colorado Boulder

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
  var PlanetModeMenu = require( 'GRAVITY_AND_ORBITS/common/view/PlanetModeMenu' );
  var GravityModeMenu = require( 'GRAVITY_AND_ORBITS/common/view/GravityModeMenu' );
  var CheckboxPanel = require( 'GRAVITY_AND_ORBITS/common/view/CheckboxPanel' );
  var GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var MENU_SECTION_OPTIONS = { x: 5 };

  /**
   * @param {GravityAndOrbitsModule} module
   * @param {Object} [options]
   * @constructor
   */
  function RightControlPanel( module, options ) {

    options = _.extend( _.clone( GravityAndOrbitsConstants.CONTROL_PANEL_OPTIONS ), options );

    var makeSeparatorRectangle = function() {
      return new Rectangle( 0, 0, 0, 2, { fill: GravityAndOrbitsConstants.CONTROL_PANEL_STROKE } );
    };

    // menu sections and separators
    var sections = [
      new PlanetModeMenu( module.modeProperty, module.getModes(), MENU_SECTION_OPTIONS ),
      makeSeparatorRectangle(),
      new GravityModeMenu( module.gravityEnabledProperty, MENU_SECTION_OPTIONS ),
      makeSeparatorRectangle(),
      new CheckboxPanel( module, MENU_SECTION_OPTIONS )
    ];

    assert && assert( sections.length === 5, 'There should be 5 sections in the RightControlPanel' );

    var vBox = new VBox( { children: sections, spacing: 4, y: 5, resize: false, align: 'left' } );
    Panel.call( this, vBox, options );

    // resize the separators to allow them to go inside the panel margins
    var separatorWidth = vBox.width + 2 * GravityAndOrbitsConstants.PANEL_X_MARGIN;
    for ( var i = 0; i < Math.floor( sections.length / 2 ); i++ ) {
      sections[ i * 2 + 1 ].setRect( -GravityAndOrbitsConstants.PANEL_X_MARGIN, 0, separatorWidth, 2 );
    }
  }

  return inherit( Panel, RightControlPanel );
} );