/**
 * Copyright 2002-2013, University of Colorado
 * view for space objects property checkbox
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var CheckBox = require( 'SUN/CheckBox' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  var iconPathImg = require( 'image!GRAVITY_AND_ORBITS/../images/icon_path.png' );
  var measuringTapeImg = require( 'image!GRAVITY_AND_ORBITS/../images/measuringTape.svg' );
  var iconMassImg = require( 'image!GRAVITY_AND_ORBITS/../images/icon_mass.svg' );
  var Image = require( 'SCENERY/nodes/Image' );

  var Strings = require( 'Strings' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FONT = new PhetFont( 14 );

  function SpaceObjectsPropertyCheckbox( model, coords ) {
    var self = this;
    Node.call( this, coords );

    // checkbox options
    var options = [
      {
        property: model.forceArrowProperty,
        text: Strings['GAO.gravity'] + ' ' + Strings['GAO.force'],
        node: new ArrowNode( 135, -10, 180, -10, {fill: '#4380C2'} )
      },
      {
        property: model.velocityArrowProperty,
        text: Strings['GAO.velocity'],
        node: new ArrowNode( 95, -10, 140, -10, {fill: '#ED1C24'} )
      },
      {
        property: model.pathProperty,
        text: Strings['GAO.path'],
        node: new Node( {children: [new Image( iconPathImg )], x: 70, y: -23} )
      },
      {
        property: model.gridProperty,
        text: Strings['GAO.grid'],
        node: new Node( {children: [
          new Path( Shape.lineSegment( 0, 0, 20, 0 ), {stroke: 'gray', lineWidth: 1.5} ),
          new Path( Shape.lineSegment( 20, 0, 20, 20 ), {stroke: 'gray', lineWidth: 1.5} ),
          new Path( Shape.lineSegment( 20, 20, 0, 20 ), {stroke: 'gray', lineWidth: 1.5} ),
          new Path( Shape.lineSegment( 0, 20, 0, 0 ), {stroke: 'gray', lineWidth: 1.5} ),
          new Path( Shape.lineSegment( 10, 0, 10, 20 ), {stroke: 'gray', lineWidth: 1.5} ),
          new Path( Shape.lineSegment( 0, 10, 20, 10 ), {stroke: 'gray', lineWidth: 1.5} )
        ], x: 74, y: -18} )
      },
      {
        property: model.tapeProperty,
        text: Strings['GAO.tape'],
        node: new Node( {children: [new Image( measuringTapeImg )], x: 140, y: -23, scale: 0.5} )
      },
      {
        property: model.massProperty,
        text: Strings['GAO.mass'],
        node: new Node( {children: [new Image( iconMassImg )], x: 70, y: -23} )
      }
    ], dy = 25, order = {
      cartoon: [0, 1, 2, 3],
      scale: [0, 1, 5, 2, 3, 4]
    };

    // add checkboxes
    for ( var i = 0; i < options.length; i++ ) {
      this[options[i].text] = {
        view: new CheckBox( new Node( {children: [
          new Text( options[i].text, { font: FONT, fill: '#fff', pickable: false, x: 30, y: i * dy } ),
          new Node( {children: [options[i].node], x: 0, y: 4 + i * dy} )
        ]} ), options[i].property, {x: 3, y: 4 + i * dy, scale: 0.8} ),
        y: 4 + i * dy};
      this.addChild( this[options[i].text].view );
    }

    model.viewModeProperty.link( function( mode ) {
        var menu = order[mode];
        self.removeAllChildren();
        for ( var i = 0; i < menu.length; i++ ) {
          self.addChild( self[options[menu[i]].text].view.setY( self[options[i].text].y ) );
        }
      }
    );
  }

  inherit( Node, SpaceObjectsPropertyCheckbox );

  return SpaceObjectsPropertyCheckbox;
} );