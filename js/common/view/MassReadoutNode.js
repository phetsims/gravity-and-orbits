// Copyright 2014-2016, University of Colorado Boulder

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
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  function MassReadoutNode( bodyNode, visibleProperty ) {
    Node.call( this );
    var self = this;
    this.bodyNode = bodyNode; // @protected

    var readoutText = new Text( this.createText(), {
      pickable: false,
      font: new PhetFont( 18 ),
      fill: GravityAndOrbitsColorProfile.bodyNodeTextProperty
    } );
    this.addChild( readoutText );

    var updateLocation = function() {
      var bounds = bodyNode.bodyRenderer.getBounds();

      self.x = bounds.centerX - self.width / 2;
      if ( bodyNode.body.massReadoutBelow ) {
        self.y = bounds.maxX + self.height;
      }
      else {
        self.y = bounds.minY - self.height;
      }
    };

    bodyNode.body.massProperty.link( function() {
      readoutText.setText( self.createText() );
      updateLocation();
    } );

    visibleProperty.link( function( visible ) {
      // set visible and update location
      self.visible = visible;
      updateLocation();
    } );
  }

  gravityAndOrbits.register( 'MassReadoutNode', MassReadoutNode );

  return inherit( Node, MassReadoutNode );
} );
