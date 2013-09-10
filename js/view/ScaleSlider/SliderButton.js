/**
 * Copyright 2002-2013, University of Colorado
 * view for button scale control
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PushButton = require( 'SUN/PushButton' );
  var RectangleButton = require( 'SUN/RectangleButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  function Button( x, y, model, range, isIncrease ) {
    var rectangleButton, callback, sample, width = 25, height = 25;
    Node.call( this, {x: x - width / 2, y: y, cursor: 'pointer'} );

    sample = new Node( {children: [new Rectangle( 0, 0, width, height, 2, 2, {fill: '#DBD485'} ), new Rectangle( 4, height / 2 - 1, width - 8, 2, {fill: 'black'} )]} );

    if ( isIncrease ) {
      callback = function() {
        model.scale = Math.min( model.scale + 0.1, range.max );
      };
      sample.addChild( new Rectangle( width / 2 - 1, 4, 2, height - 8, {fill: 'black'} ) );
    }
    else {
      callback = function() {
        model.scale = Math.max( model.scale - 0.1, range.min );
      };
    }

    var options = {
      upNode: new Node( {children: [sample]} ),
      overNode: new Node( {children: [sample]} ),
      downNode: new Node( {children: [sample]} ),
      disabledNode: new Node( {children: [sample]} )
    };

    // add background
    var pushButton = new PushButton( options.upNode, options.overNode, options.downNode, options.disabledNode, callback );

    this.addChild( pushButton );
  }

  inherit( Node, Button );


  /*function Button( x, y, model, range, isIncrease ) {
   var rectangleButton, width = 20, height = 20;
   Node.call( this, {x: x - width / 2, y: y, cursor: 'pointer'} );

   // add background
   var node = new Node();
   node.addChild( new Rectangle( 0, 0, width, height ) );

   if ( isIncrease ) {
   rectangleButton = new RectangleButton( node, function() {
   model.scale = Math.min( model.scale + 0.1, range.max );
   } );
   }
   else {
   rectangleButton = new RectangleButton( node, function() {
   model.scale = Math.max( model.scale - 0.1, range.min );
   } );
   }

   this.addChild( rectangleButton );
   }

   inherit( RectangleButton, Button );*/

  return Button;
} );