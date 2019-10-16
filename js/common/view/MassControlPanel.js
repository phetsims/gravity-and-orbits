// Copyright 2015-2019, University of Colorado Boulder

/**
 * Control panel used to change the mass of the various bodies.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

define( require => {
  'use strict';

  // modules
  const BodyMassControl = require( 'GRAVITY_AND_ORBITS/common/view/BodyMassControl' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  const GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  // const spaceStationMassString = require( 'string!GRAVITY_AND_ORBITS/spaceStationMass' );
  const moonMassString = require( 'string!GRAVITY_AND_ORBITS/moonMass' );
  const planetMassString = require( 'string!GRAVITY_AND_ORBITS/planetMass' );
  const satelliteMassString = require( 'string!GRAVITY_AND_ORBITS/satelliteMass' );
  const starMassString = require( 'string!GRAVITY_AND_ORBITS/starMass' );

  // constants
  const CONTROL_FONT = new PhetFont( 14 );
  const LABEL_MAP = {
    PLANET: planetMassString,
    SATELLITE: satelliteMassString,
    STAR: starMassString,
    MOON: moonMassString
  };

  class MassControlPanel extends Panel {

    /**
     * Constructor for MassControlPanel. This is the panel in the lower right section of the screen that holds sliders
     * for adjusting the mass of bodies.
     * @param massSettableBodies
     * @param options
     */
    constructor( massSettableBodies, options ) {

      options = _.extend( _.clone( GravityAndOrbitsConstants.CONTROL_PANEL_OPTIONS ), options );

      const children = [];

      for ( let i = 0; i < massSettableBodies.length; i++ ) {
        const sliderNode = new Node();

        const massSettableBody = massSettableBodies[ i ];

        const label = new Text( LABEL_MAP[ massSettableBody.name ], {
          font: CONTROL_FONT,
          fontWeight: 'bold',
          fill: GravityAndOrbitsColorProfile.panelTextProperty,
          maxWidth: 175,
          resize: false
        } );

        const icon = massSettableBody.createRenderer( 14 );

        // Top component that shows the body's name and icon
        const labelHBox = new HBox( { children: [ icon, label ], spacing: 10 } );

        sliderNode.addChild( labelHBox );

        const sliderVBox = new VBox( {
          top: labelHBox.bottom + 8,
          resize: false,
          children: [
            new HStrut( 220 ),
            new BodyMassControl(
              massSettableBody,
              massSettableBody.massProperty.value / 2,
              massSettableBody.massProperty.value * 2,
              massSettableBody.tickValue,
              massSettableBody.tickLabel )
          ]
        } );

        sliderNode.addChild( sliderVBox );
        children.push( sliderNode );
      }

      const vBox = new VBox( { children: children, spacing: 15, y: 5, resize: false, align: 'left' } );
      super( vBox, options );
    }
  }

  return gravityAndOrbits.register( 'MassControlPanel', MassControlPanel );
} );