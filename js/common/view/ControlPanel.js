// Copyright 2013-2016, University of Colorado Boulder

/**
 * Control panel containing the controls for orbital mode, gravity, and visibility of plantary path
 * and vectors.
 *
 * @author Aaron Davis
 */

define( function( require ) {
  'use strict';

  // modules
  var Panel = require( 'SUN/Panel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ModeControl = require( 'GRAVITY_AND_ORBITS/common/view/ModeControl' );
  var GravityControl = require( 'GRAVITY_AND_ORBITS/common/view/GravityControl' );
  var CheckboxPanel = require( 'GRAVITY_AND_ORBITS/common/view/CheckboxPanel' );
  var GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  // constants
  var MENU_SECTION_OPTIONS = { x: 5 };

  /**
   * @param {GravityAndOrbitsModule} module
   * @param {Object} [options]
   * @constructor
   */
  function ControlPanel( module, options ) {

    options = _.extend( _.clone( GravityAndOrbitsConstants.CONTROL_PANEL_OPTIONS ), options );

    // top separator rectangle for the gravity control section
    var makeTopSeparatorRectangle = function() {
      return new Rectangle( 0, 0, 0, 3, { fill: GravityAndOrbitsConstants.CONTROL_PANEL_STROKE } );
    };

    // make bottom separator rectangle for the gravity control
    // slightly taller - the vertical draw of the 'y' in gravity creates the illusion that
    // the top has more space
    var makeBottomSeparatorRectangle = function() {
      return new Rectangle( 0, 0, 0, 4, { fill: GravityAndOrbitsConstants.CONTROL_PANEL_STROKE } );
    };

    // menu sections and separators
    var sections = [
      new ModeControl( module.modeProperty, module.getModes(), MENU_SECTION_OPTIONS ),
      makeTopSeparatorRectangle(),
      new GravityControl( module.gravityEnabledProperty, MENU_SECTION_OPTIONS ),
      makeBottomSeparatorRectangle(),
      new CheckboxPanel( module, MENU_SECTION_OPTIONS )
    ];

    assert && assert( sections.length === 5, 'There should be 5 sections in the ControlPanel' );

    var vBox = new VBox( { children: sections, spacing: 4, y: 5, resize: false, align: 'left' } );
    Panel.call( this, vBox, options );

    // resize the separators to allow them to go inside the panel margins
    var separatorWidth = vBox.width + 2 * GravityAndOrbitsConstants.PANEL_X_MARGIN;
    for ( var i = 0; i < Math.floor( sections.length / 2 ); i++ ) {
      sections[ i * 2 + 1 ].setRect( -GravityAndOrbitsConstants.PANEL_X_MARGIN, 0, separatorWidth, 2 );
    }
  }

  gravityAndOrbits.register( 'ControlPanel', ControlPanel );

  return inherit( Panel, ControlPanel );
} );
