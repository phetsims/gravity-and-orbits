/**
 * Copyright 2002-2013, University of Colorado
 * view for right control panel
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PlanetModeMenu = require( 'view/RightControlPanel/PlanetModeMenu/PlanetModeMenu' );
  var GravityModeMenu = require( 'view/RightControlPanel/GravityModeMenu/GravityModeMenu' );
  var SpaceObjectsPropertyCheckbox = require( 'view/RightControlPanel/SpaceObjectsPropertyCheckbox/SpaceObjectsPropertyCheckbox' );

  function RightControlPanel( model, x, y ) {
    var self = this, height = 0, lineOffset, sectionsOffset;
    Node.call( this, {x: x, y: y} );

    // add background
    this.back = new Rectangle( 0, 0, 200, 0, 2, 2, {fill: '#030085', stroke: '#8E9097', lineWidth: 2} );
    this.addChild( this.back );

    // add sections
    var sections = [
      {constructor: PlanetModeMenu, name: 'PlanetModeMenu'},
      {constructor: GravityModeMenu, name: 'GravityModeMenu'},
      {constructor: SpaceObjectsPropertyCheckbox, name: 'SpaceObjectsPropertyCheckbox'}
    ];

    lineOffset = 10;
    sectionsOffset = 20;
    for ( var i = 0, len = sections.length; i < len; i++ ) {
      // add section
      this[sections[i].name] = {
        view: new sections[i].constructor( model, {x: 7, y: height + sectionsOffset} )
      };
      height += this[sections[i].name].view.getHeight() + lineOffset;
      this.addChild( this[sections[i].name].view );

      // add bottom line
      if ( i !== len - 1 ) {
        this[sections[i].name].line = new Rectangle( -1, height, 200, 2, {fill: '#8E9097'} );
        this.addChild( this[sections[i].name].line );
      }
    }

    // set background height
    this.back.setRectHeight( height );

    model.viewModeProperty.link( function() {
      // resize control panel
      var i, h = 0, len = sections.length;
      for ( i = 0; i < len; i++ ) {
        self[sections[i].name].view.setY( h + sectionsOffset );
        h += self[sections[i].name].view.getHeight() + lineOffset;
        if ( i !== len - 1 ) {
          self[sections[i].name].line.setRectY( h );
        }
      }
      self.back.setRectHeight( h );
    } );
  }

  inherit( Node, RightControlPanel );

  return RightControlPanel;
} );