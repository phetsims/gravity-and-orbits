// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
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

  var iconPathImg = require( 'image!GRAVITY_AND_ORBITS/icon_path.png' );
  var measuringTapeImg = require( 'image!GRAVITY_AND_ORBITS/measuringTape.png' );
  var iconMassImg = require( 'image!GRAVITY_AND_ORBITS/icon_mass.svg' );
  var Image = require( 'SCENERY/nodes/Image' );

  var gravityString = require( 'string!GRAVITY_AND_ORBITS/gravity' );
  var forceString = require( 'string!GRAVITY_AND_ORBITS/force' );
  var velocityString = require( 'string!GRAVITY_AND_ORBITS/velocity' );
  var pathString = require( 'string!GRAVITY_AND_ORBITS/path' );
  var tapeString = require( 'string!GRAVITY_AND_ORBITS/measuringTape' );
  var massString = require( 'string!GRAVITY_AND_ORBITS/mass' );
  var gridString = require( 'string!GRAVITY_AND_ORBITS/grid' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FONT = new PhetFont( 14 );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );

  function SpaceObjectsPropertyCheckbox( model, coords ) {
    Node.call( this, coords );

    // checkbox options
    var options = [
      {
        property: model.forceArrowProperty,
        text: gravityString + ' ' + forceString,
        node: new ArrowNode( 135, -10, 180, -10, {fill: '#4380C2'} )
      },
      {
        property: model.velocityArrowProperty,
        text: velocityString,
        node: new ArrowNode( 95, -10, 140, -10, {fill: '#ED1C24'} )
      },
      {
        property: model.pathProperty,
        text: pathString,
        node: new Node( {children: [new Image( iconPathImg )], scale: 0.9} )
      },
      {
        property: model.gridProperty,
        text: gridString,
        node: new Node( {children: [
          new Path( Shape.lineSegment( 0, 0, 20, 0 ), {stroke: 'gray', lineWidth: 1.5} ),
          new Path( Shape.lineSegment( 20, 0, 20, 20 ), {stroke: 'gray', lineWidth: 1.5} ),
          new Path( Shape.lineSegment( 20, 20, 0, 20 ), {stroke: 'gray', lineWidth: 1.5} ),
          new Path( Shape.lineSegment( 0, 20, 0, 0 ), {stroke: 'gray', lineWidth: 1.5} ),
          new Path( Shape.lineSegment( 10, 0, 10, 20 ), {stroke: 'gray', lineWidth: 1.5} ),
          new Path( Shape.lineSegment( 0, 10, 20, 10 ), {stroke: 'gray', lineWidth: 1.5} )
        ]} )
      },
      {
        property: model.tapeProperty,
        text: tapeString,
        node: new Node( {children: [new Image( measuringTapeImg )], scale: 0.5} )
      },
      {
        property: model.massProperty,
        text: massString,
        node: new Node( {children: [new Image( iconMassImg )], scale: 0.8} )
      }
    ], order = {}, menu;

    order[model.viewModes[0]] = [0, 1, 2, 3];
    order[model.viewModes[1]] = [0, 1, 5, 2, 3, 4];

    // add checkboxes
    for ( var i = 0; i < options.length; i++ ) {
      this[options[i].text] = {
        view: new CheckBox( new HBox( { spacing: 10, children: [
          new Text( options[i].text, { font: FONT, fill: '#fff', pickable: false} ),
          new Node( {children: [options[i].node]} )
        ]} ), options[i].property, {scale: 0.8} )
      };
    }

    this.vBox = new VBox( {spacing: 5, align: 'left'} );

    menu = order[model.viewMode];
    for ( i = 0; i < menu.length; i++ ) {
      this.vBox.addChild( this[options[menu[i]].text].view );
    }

    this.addChild( this.vBox );
    this.vBox.bottom = -12;
    this.vBox.updateLayout();
  }

  return inherit( Node, SpaceObjectsPropertyCheckbox );
} );