// Copyright 2002-2015, University of Colorado

/**
 * Abstract class provides functionality for displaying the mass readout (in text) of a Body node.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );

  function MassReadoutNode( bodyNode, visibleProperty ) {
    Node.call( this );
    var thisNode = this;
    this.bodyNode = bodyNode;

    var readoutText = new Text( this.createText(), {
      pickable: false,
      font: new PhetFont( 18 ),
      fill: 'white'
    } );
    this.addChild( readoutText );

    var updateLocation = function() {
      var bounds = bodyNode.getBodyRenderer().getBounds();

      thisNode.x = bounds.centerX - thisNode.width / 2;
      if ( bodyNode.getBody().massReadoutBelow ) {
        thisNode.y = bounds.maxX + thisNode.height;
      }
      else {
        thisNode.y = bounds.minY - thisNode.height;
      }
    };

    bodyNode.getBody().massProperty.link( function() {
      readoutText.setText( thisNode.createText() );
      updateLocation();
    } );

    visibleProperty.link( function( visible ) {
      if ( !bodyNode.getBody().collidedProperty.get() ) {
        thisNode.visible = visible;
        updateLocation();
      }
    } );
  }

  return inherit( Node, MassReadoutNode );
} );
