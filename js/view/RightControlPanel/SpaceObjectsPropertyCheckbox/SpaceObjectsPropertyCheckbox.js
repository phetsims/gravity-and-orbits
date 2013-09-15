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
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );

  var imageLoader = require( 'gravity-and-orbits-images' );
  var Image = require( 'SCENERY/nodes/Image' );

  var Strings = require( 'Strings' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FONT = new PhetFont( 15 );

  function SpaceObjectsPropertyCheckbox( model, coords ) {
    Node.call( this, coords );

    var options = [
      {
        property: model.forceArrowProperty,
        text: Strings['GAO.gravity'] + ' ' + Strings['GAO.force'],
        node: new ArrowNode( 135, -8, 180, -8, {fill: '#4380C2'} )
      },
      {
        property: model.velocityArrowProperty,
        text: Strings['GAO.velocity'],
        node: new ArrowNode( 95, -8, 140, -8, {fill: '#ED1C24'} )
      },
      {
        property: model.pathProperty,
        text: Strings['GAO.path'],
        node: new Node( {children: [new Image( imageLoader.getImage( 'icon_path.png' ) )], x: 70, y: -23} )
      },
      {
        property: model.gridProperty,
        text: Strings['GAO.grid'],
        node: new Node()
      }
    ], dy = 30;

    for ( var i = 0; i < options.length; i++ ) {
      this.addChild( new CheckBox( new Node(), options[i].property, {x: 3, y: 3 + i * dy} ) );
      this.addChild( new Text( options[i].text, { font: FONT, fill: '#fff', pickable: false, x: 30, y: -2 + i * dy } ) );
      this.addChild( new Node( {children: [options[i].node], x: 0, y: i * dy} ) );
    }
  }

  inherit( Node, SpaceObjectsPropertyCheckbox );

  return SpaceObjectsPropertyCheckbox;
} );