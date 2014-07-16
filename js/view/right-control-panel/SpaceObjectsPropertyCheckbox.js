// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var CheckBox = require( 'SUN/CheckBox' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );

  // images
  var iconPathImg = require( 'image!GRAVITY_AND_ORBITS/icon_path.png' );
  var measuringTapeImg = require( 'image!GRAVITY_AND_ORBITS/measuringTape.png' );
  var iconMassImg = require( 'image!GRAVITY_AND_ORBITS/icon_mass.png' );

  // strings
  var gravityString = require( 'string!GRAVITY_AND_ORBITS/gravity' );
  var forceString = require( 'string!GRAVITY_AND_ORBITS/force' );
  var velocityString = require( 'string!GRAVITY_AND_ORBITS/velocity' );
  var pathString = require( 'string!GRAVITY_AND_ORBITS/path' );
  var tapeString = require( 'string!GRAVITY_AND_ORBITS/measuringTape' );
  var massString = require( 'string!GRAVITY_AND_ORBITS/mass' );
  var gridString = require( 'string!GRAVITY_AND_ORBITS/grid' );

  // constants
  var FONT = new PhetFont( 14 );

  function SpaceObjectsPropertyCheckbox( model, options ) {
    Node.call( this, options );

    // checkbox params
    var measuringTapeImageNode = new Image( measuringTapeImg );

    // options for the grid line icon
    var strokeOptions = {stroke: 'gray', lineWidth: 1.5};

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
          new Path( Shape.lineSegment( 0, 0, 20, 0 ), strokeOptions ),
          new Path( Shape.lineSegment( 20, 0, 20, 20 ), strokeOptions ),
          new Path( Shape.lineSegment( 20, 20, 0, 20 ), strokeOptions ),
          new Path( Shape.lineSegment( 0, 20, 0, 0 ), strokeOptions ),
          new Path( Shape.lineSegment( 10, 0, 10, 20 ), strokeOptions ),
          new Path( Shape.lineSegment( 0, 10, 20, 10 ), strokeOptions )
        ]} )
      },
      {
        property: model.tapeProperty,
        text: tapeString,
        node: new Node( {
          children: [

            //Sticking down metal "tab" at the end of the tape
            new Line( measuringTapeImageNode.width + 30 - 2, measuringTapeImageNode.height - 2, measuringTapeImageNode.width + 30 - 2, measuringTapeImageNode.height - 2 + 7, {stroke: '#aaaaaa', lineWidth: 3} ),

            //A small amount of tape to help identify the icon as measuring tape
            new Line( measuringTapeImageNode.width - 4, measuringTapeImageNode.height - 2, measuringTapeImageNode.width + 30, measuringTapeImageNode.height - 2, {stroke: 'gray', lineWidth: 3} ),

            measuringTapeImageNode],
          scale: 0.5
        } )
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