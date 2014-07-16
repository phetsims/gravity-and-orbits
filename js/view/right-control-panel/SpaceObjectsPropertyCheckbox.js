// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' ),
    inherit = require( 'PHET_CORE/inherit' ),
    CheckBox = require( 'SUN/CheckBox' ),
    ArrowNode = require( 'SCENERY_PHET/ArrowNode' ),
    Shape = require( 'KITE/Shape' ),
    Path = require( 'SCENERY/nodes/Path' ),
    iconPathImg = require( 'image!GRAVITY_AND_ORBITS/icon_path.png' ),
    measuringTapeImg = require( 'image!GRAVITY_AND_ORBITS/measuringTape.png' ),
    iconMassImg = require( 'image!GRAVITY_AND_ORBITS/icon_mass.png' ),
    Image = require( 'SCENERY/nodes/Image' ),
    Line = require( 'SCENERY/nodes/Line' ),
    gravityString = require( 'string!GRAVITY_AND_ORBITS/gravity' ),
    forceString = require( 'string!GRAVITY_AND_ORBITS/force' ),
    velocityString = require( 'string!GRAVITY_AND_ORBITS/velocity' ),
    pathString = require( 'string!GRAVITY_AND_ORBITS/path' ),
    tapeString = require( 'string!GRAVITY_AND_ORBITS/measuringTape' ),
    massString = require( 'string!GRAVITY_AND_ORBITS/mass' ),
    gridString = require( 'string!GRAVITY_AND_ORBITS/grid' ),
    Text = require( 'SCENERY/nodes/Text' ),
    PhetFont = require( 'SCENERY_PHET/PhetFont' ),
    FONT = new PhetFont( 14 ),
    VBox = require( 'SCENERY/nodes/VBox' ),
    HBox = require( 'SCENERY/nodes/HBox' );

  function SpaceObjectsPropertyCheckbox( model, options ) {
    Node.call( this, options );

    // checkbox params
    var measuringTapeImageNode = new Image( measuringTapeImg );
    var params = [
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
        node: new Node( {children: [

          //Sticking down metal "tab" at the end of the tape
          new Line( measuringTapeImageNode.width + 30 - 2, measuringTapeImageNode.height - 2, measuringTapeImageNode.width + 30 - 2, measuringTapeImageNode.height - 2 + 7, {stroke: '#aaaaaa', lineWidth: 3} ),

          //A small amount of tape to help identify the icon as measuring tape
          new Line( measuringTapeImageNode.width - 4, measuringTapeImageNode.height - 2, measuringTapeImageNode.width + 30, measuringTapeImageNode.height - 2, {stroke: 'gray', lineWidth: 3} ),

          measuringTapeImageNode], scale: 0.5} )
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
    for ( var i = 0; i < params.length; i++ ) {
      this[params[i].text] = {
        view: new CheckBox( new HBox( { spacing: 10, children: [
          new Text( params[i].text, { font: FONT, fill: '#fff', pickable: false} ),
          new Node( {children: [params[i].node]} )
        ]} ), params[i].property, {scale: 0.8} )
      };
    }

    this.vBox = new VBox( {resize: false, spacing: 5, align: 'left'} );

    menu = order[model.viewMode];
    for ( i = 0; i < menu.length; i++ ) {
      this.vBox.addChild( this[params[menu[i]].text].view );
    }

    this.addChild( this.vBox );
    this.vBox.bottom = -12;
    this.vBox.updateLayout();
  }

  return inherit( Node, SpaceObjectsPropertyCheckbox );
} );