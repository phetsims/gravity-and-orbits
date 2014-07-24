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
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PlanetModeMenu = require( 'view/right-control-panel/planet-mode-menu/PlanetModeMenu' );
  var GravityModeMenu = require( 'view/right-control-panel/GravityModeMenu' );
  var SpaceObjectsPropertyCheckbox = require( 'view/right-control-panel/SpaceObjectsPropertyCheckbox' );
  var MassMenu = require( 'view/right-control-panel/mass-menu/MassMenu' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @param model {PropertySet} Contains set of properties. Instance of PropertySet class. General model for the whole application.
   */
  function RightControlPanel( model ) {
    Node.call( this );

    // add background
    this.back = new Rectangle( 0, 0, 0, 0, 2, 2, {fill: '#030085', stroke: '#8E9097', lineWidth: 2} );
    this.addChild( this.back );

    // add container for sections
    this.box = new VBox( {resize: false, spacing: 4, y: 5} );
    this.addChild( this.box );

    // add sections
    var sections = [PlanetModeMenu, GravityModeMenu, SpaceObjectsPropertyCheckbox, MassMenu];

    addSections( model, this.box, sections );

    // update container
    this.box.updateLayout();

    // set background size
    this.back.setRectHeight( this.box.getHeight() + this.box.y );
    this.back.setRectWidth( this.box.getWidth() );
  }

  /**
   * Add sections to
   * @param model {PropertySet} Contains set of properties. General model for the whole application. Necessary for building sections.
   * @param box {Node} target box node for appending sections.
   * @param sections {Array} Array of section constructors. Each constructor return node for appending to target node.
   */
  var addSections = function( model, box, sections ) {
    var nodes = [], sectionLinks = [], width;

    // add sections
    for ( var i = 0, len = sections.length; i < len; i++ ) {
      sectionLinks[i] = new sections[i]( model, {x: 5, y: 0} );
      nodes[i] = new Node( { children: [sectionLinks[i]]} );
      box.addChild( nodes[i] );
      assert && assert( !isNaN( nodes[i].width ) );
      assert && assert( !isNaN( nodes[i].height ) );
    }

    // find width for lines
    width = box.getWidth();

    for ( i = 0; i < len; i++ ) {
      // align center first and last sections
      if ( i === 0 || i === len - 1 ) {
        sectionLinks[i].centerX = width / 2 + 5;
      }

      // add bottom lines (last line is invisible)
      nodes[i].addChild( new Rectangle( 0, nodes[i].getHeight() - 7, width + 10, 2,
        {fill: ( (i !== len - 1) ? '#8E9097' : null)}
      ) );
    }
  };

  return inherit( Node, RightControlPanel );
} );