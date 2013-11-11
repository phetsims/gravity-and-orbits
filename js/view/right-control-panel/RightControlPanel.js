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

  function RightControlPanel( model, x, y ) {
    var self = this, options = {height: 0, lineOffset: 10, sectionsOffset: 20};
    Node.call( this, {x: x, y: y} );

    // add background
    this.back = new Rectangle( 0, 0, 200, 0, 2, 2, {fill: '#030085', stroke: '#8E9097', lineWidth: 2} );
    this.addChild( this.back );

    // add sections
    var sections = [
      {constructor: PlanetModeMenu, name: 'PlanetModeMenu'},
      {constructor: GravityModeMenu, name: 'GravityModeMenu'},
      {constructor: SpaceObjectsPropertyCheckbox, name: 'SpaceObjectsPropertyCheckbox'},
      {constructor: MassMenu, name: 'MassMenu'}
    ];

    addSections.call( this, model, sections, options );

    // set background height
    this.back.setRectHeight( options.height );
    model.rightPanelHeight = options.height;

    model.viewModeProperty.link( function() {
      resizeSections.call( self, model, sections, options );
    } );
  }

  var addSections = function( model, sections, options ) {
    for ( var i = 0, len = sections.length; i < len; i++ ) {
      // add section
      this[sections[i].name] = {
        view: new sections[i].constructor( model, {x: 7, y: options.height + options.sectionsOffset} )
      };
      options.height += this[sections[i].name].view.getHeight() + options.lineOffset;
      this.addChild( this[sections[i].name].view );

      // add bottom line
      if ( i !== len - 1 ) {
        this[sections[i].name].line = new Rectangle( -1, options.height, 200, 2, {fill: '#8E9097'} );
        this.addChild( this[sections[i].name].line );
      }
    }
  };

  var resizeSections = function( model, sections, options ) {
    var i, len = sections.length;
    options.height = 0;

    for ( i = 0; i < len; i++ ) {
      this[sections[i].name].view.setY( options.height + options.sectionsOffset );
      options.height += this[sections[i].name].view.getHeight() + options.lineOffset;
      if ( i !== len - 1 ) {
        this[sections[i].name].line.setRectY( options.height );
      }
    }
    this.back.setRectHeight( options.height );
    model.rightPanelHeight = options.height;
  };

  return inherit( Node, RightControlPanel );
} );