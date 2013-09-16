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

  var imageLoader = require( 'gravity-and-orbits-images' );
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
        node: new Node( {children: [new Image( imageLoader.getImage( 'icon_path.png' ) )], x: 70, y: -23} )
      },
      {
        property: model.gridProperty,
        text: Strings['GAO.grid'],
        node: new Node()
      },
      {
        property: model.tapeProperty,
        text: Strings['GAO.tape'],
        node: new Node( {children: [new Image( imageLoader.getImage( 'measuringTape.svg' ) )], x: 140, y: -23, scale: 0.5} )
      },
      {
        property: model.massProperty,
        text: Strings['GAO.mass'],
        node: new Node( {children: [new Image( imageLoader.getImage( 'icon_mass.svg' ) )], x: 70, y: -23} )
      }
    ], dy = 30;

    // add checkboxes
    for ( var i = 0; i < options.length; i++ ) {
      this[options[i].text] = new CheckBox( new Node( {children: [
        new Text( options[i].text, { font: FONT, fill: '#fff', pickable: false, x: 30, y: i * dy } ),
        new Node( {children: [options[i].node], x: 0, y: 4 + i * dy} )
      ]} ), options[i].property, {x: 3, y: 7 + i * dy} );
      this.addChild( this[options[i].text] );
    }

    model.viewModeProperty.link( function( mode ) {
        if ( mode === model.viewModes[0] ) {
          self.removeChild( self[options[4].text] );
          self.removeChild( self[options[5].text] );
        }
        else if ( mode === model.viewModes[1] ) {
          self.addChild( self[options[4].text] );
          self.addChild( self[options[5].text] );
        }
      }
    );
  }

  inherit( Node, SpaceObjectsPropertyCheckbox );

  return SpaceObjectsPropertyCheckbox;
} );