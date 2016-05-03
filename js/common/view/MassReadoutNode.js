// Copyright 2014-2015, University of Colorado Boulder

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
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  function MassReadoutNode( bodyNode, visibleProperty ) {
    Node.call( this );
    var thisNode = this;
    this.bodyNode = bodyNode; // @protected

    var readoutText = new Text( this.createText(), {
      pickable: false,
      font: new PhetFont( 18 ),
      fill: 'white'
    } );
    this.addChild( readoutText );

    var updateLocation = function() {
      var bounds = bodyNode.bodyRenderer.getBounds();

      thisNode.x = bounds.centerX - thisNode.width / 2;
      if ( bodyNode.body.massReadoutBelow ) {
        thisNode.y = bounds.maxX + thisNode.height;
      }
      else {
        thisNode.y = bounds.minY - thisNode.height;
      }
    };

    bodyNode.body.massProperty.link( function() {
      readoutText.setText( thisNode.createText() );
      updateLocation();
    } );

    visibleProperty.link( function( visible ) {
      if ( !bodyNode.body.collidedProperty.get() ) {
        thisNode.visible = visible;
        updateLocation();
      }
    } );
  }

  gravityAndOrbits.register( 'MassReadoutNode', MassReadoutNode );
  
  return inherit( Node, MassReadoutNode );
} );
