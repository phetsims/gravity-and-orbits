// Copyright 2014-2019, University of Colorado Boulder

/**
 * Abstract class provides functionality for displaying the mass readout (in text) of a Body node.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );

  class MassReadoutNode extends Node {
    constructor( bodyNode, visibleProperty ) {
      super();
      this.bodyNode = bodyNode; // @protected

      const readoutText = new Text( this.createText(), {
        pickable: false,
        font: new PhetFont( 18 ),
        fill: GravityAndOrbitsColorProfile.bodyNodeTextProperty
      } );
      this.addChild( readoutText );

      const updateLocation = () => {
        const bounds = bodyNode.bodyRenderer.getBounds();

        this.x = bounds.centerX - this.width / 2;
        if ( bodyNode.body.massReadoutBelow ) {
          this.y = bounds.maxX + this.height;
        }
        else {
          this.y = bounds.minY - this.height;
        }
      };

      bodyNode.body.massProperty.link( () => {
        readoutText.setText( this.createText() );
        updateLocation();
      } );

      visibleProperty.link( visible => {
        this.visible = visible;
        updateLocation();
      } );
    }
  }

  return gravityAndOrbits.register( 'MassReadoutNode', MassReadoutNode );
} );