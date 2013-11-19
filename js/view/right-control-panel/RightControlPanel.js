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
    this.lines = [];

    // add background
    this.back = new Rectangle( 0, 0, 0, 0, 2, 2, {fill: '#030085', stroke: '#8E9097', lineWidth: 2} );
    this.addChild( this.back );

    // add container for sections
    this.box = new VBox( {spacing: 5, y: 5} );
    this.addChild( this.box );

    // add sections
    var sections = [
      {constructor: PlanetModeMenu, name: 'PlanetModeMenu'},
      {constructor: GravityModeMenu, name: 'GravityModeMenu'},
      {constructor: SpaceObjectsPropertyCheckbox, name: 'SpaceObjectsPropertyCheckbox'},
      {constructor: MassMenu, name: 'MassMenu'}
    ];

    addSections.call( this, model, sections );

    // update container
    this.box.updateLayout();

    // set background size
    this.back.setRectHeight( this.box.getHeight() + this.box.y );
    this.back.setRectWidth( this.box.getWidth() );
  }

  var addSections = function( model, sections ) {
    var nodes = [], width;

    // add sections
    for ( var i = 0, len = sections.length; i < len; i++ ) {
      nodes[i] = new Node( { children: [
        new sections[i].constructor( model, {x:5} )
      ]} );
      this.box.addChild( nodes[i] );
    }

    // find width for lines
    width = this.box.getWidth();

    // add bottom lines (last line is invisible)
    for ( i = 0; i < len; i++ ) {
      nodes[i].addChild( new Rectangle( 0, nodes[i].getHeight() - 7, width + 10, 2,
        {fill: ( (i !== len - 1) ? '#8E9097' : 'rgba(0,0,0,0)')}
      ) );
    }
  };

  return inherit( Node, RightControlPanel );
} );