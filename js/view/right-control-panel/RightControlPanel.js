// Copyright 2002-2013, University of Colorado Boulder

/**
 * Container for right control panel.
 * Include planet mode menu, gravity switcher, checkbox with properties and mass sliders.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PlanetModeMenu = require( 'view/right-control-panel/planet-mode-menu/PlanetModeMenu' );
  var GravityModeMenu = require( 'view/right-control-panel/GravityModeMenu' );
  var SpaceObjectsPropertyCheckbox = require( 'view/right-control-panel/SpaceObjectsPropertyCheckbox' );
  var MassMenu = require( 'view/right-control-panel/mass-menu/MassMenu' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  function RightControlPanel( model ) {
    Node.call( this );

    // add background
    this.back = new Rectangle( 0, 0, 0, 0, 2, 2, {fill: '#030085', stroke: '#8E9097', lineWidth: 2} );
    this.addChild( this.back );

    // add container for sections
    this.box = new VBox( {spacing: 5, y: 5} );
    this.addChild( this.box );

    // add sections
    var sections = [PlanetModeMenu, GravityModeMenu, SpaceObjectsPropertyCheckbox, MassMenu];

    addSections.call( this, model, sections );

    // update container
    this.box.updateLayout();

    // set background size
    this.back.setRectHeight( this.box.getHeight() + this.box.y );
    this.back.setRectWidth( this.box.getWidth() );
  }

  var addSections = function( model, sections ) {
    var nodes = [], sectionLinks = [], width;

    // add sections
    for ( var i = 0, len = sections.length; i < len; i++ ) {
      sectionLinks[i] = new sections[i]( model, {x: 5} );
      nodes[i] = new Node( { children: [sectionLinks[i]]} );
      this.box.addChild( nodes[i] );
    }

    // find width for lines
    width = this.box.getWidth();

    for ( i = 0; i < len; i++ ) {
      // align center first and last sections
      if ( i === 0 || i === len - 1 ) {
        sectionLinks[i].centerX = width / 2 + 5;
      }

      // add bottom lines (last line is invisible)
      nodes[i].addChild( new Rectangle( 0, nodes[i].getHeight() - 7, width + 10, 2,
        {fill: ( (i !== len - 1) ? '#8E9097' : 'rgba(0,0,0,0)')}
      ) );
    }
  };

  return inherit( Node, RightControlPanel );
} );