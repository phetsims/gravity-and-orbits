/**
 * Copyright 2002-2013, University of Colorado
 * view for gravity mode menu
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RadioButton = require( 'SUN/RadioButton' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  var Strings = require( 'Strings' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FONT = new PhetFont( 16 );

  function GravityModeMenu( model, coords ) {
    var text, radio;
    Node.call( this, coords );

    // add "gravity" text
    text = new Text( Strings['GAO.gravity'] + ':', { font: FONT, fill: '#fff', pickable: false } );
    this.addChild( text );

    // radio buttons views
    var views = {
      selectedNode: new Node( {children: [new Circle( 6, {fill: '#fff' } ), new Circle( 3, {fill: '#000' } )]} ),
      deselectedNode: new Node( {children: [new Circle( 6, {fill: '#fff' } )]} )
    };

    // add on button
    radio = new RadioButton( model.gravityProperty, true, new Node( {children: [views.selectedNode]} ), new Node( {children: [views.deselectedNode]} ), {x: 70, y: -5} );
    this.addChild( radio );
    text = new Text( Strings['GAO.on'], { font: FONT, fill: '#fff', pickable: false, x: 82 } );
    this.addChild( text );

    // add off button
    radio = new RadioButton( model.gravityProperty, false, new Node( {children: [views.selectedNode]} ), new Node( {children: [views.deselectedNode]} ), {x: 120, y: -5} );
    this.addChild( radio );
    text = new Text( Strings['GAO.off'], { font: FONT, fill: '#fff', pickable: false, x: 132 } );
    this.addChild( text );
  }

  inherit( Node, GravityModeMenu );

  return GravityModeMenu;
} );