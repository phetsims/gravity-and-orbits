// Copyright 2015, University of Colorado Boulder

/**
 * Control panel used to change the mass of the various bodies.
 *
 * @author Aaron Davis
 */

define( function( require ) {
  'use strict';

  // modules
  var Panel = require( 'SUN/Panel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  var GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var BodyMassControl = require( 'GRAVITY_AND_ORBITS/common/view/BodyMassControl' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  // strings
  var planetMassString = require( 'string!GRAVITY_AND_ORBITS/planetMass' );
  // var spaceStationMassString = require( 'string!GRAVITY_AND_ORBITS/spaceStationMass' );
  var satelliteMassString = require( 'string!GRAVITY_AND_ORBITS/satelliteMass' );
  var moonMassString = require( 'string!GRAVITY_AND_ORBITS/moonMass' );
  var starMassString = require( 'string!GRAVITY_AND_ORBITS/starMass' );

  // constants
  var CONTROL_FONT = new PhetFont( 14 );
  var LABEL_MAP = {
    PLANET: planetMassString,
    SATELLITE: satelliteMassString,
    STAR: starMassString,
    MOON: moonMassString
  };

  /**
   * Constructor for MassControlPanel. This is the panel in the lower right section of the screen that holds sliders
   * for adjusting the mass of bodies.
   * @param massSettableBodies
   * @param options
   * @constructor
   */
  function MassControlPanel( massSettableBodies, options ) {

    options = _.extend( _.clone( GravityAndOrbitsConstants.CONTROL_PANEL_OPTIONS ), options );

    var children = [];

    for ( var i = 0; i < massSettableBodies.length; i++ ) {
      var sliderNode = new Node();

      var massSettableBody = massSettableBodies[ i ];

      var label = new Text( LABEL_MAP[ massSettableBody.name ], {
        font: CONTROL_FONT,
        fontWeight: 'bold',
        fill: GravityAndOrbitsColorProfile.panelTextProperty,
        maxWidth: 175,
        resize: false
      } );

      var icon = massSettableBody.createRenderer( 14 );

      // Top component that shows the body's name and icon
      var labelHBox = new HBox( { children: [ icon, label ], spacing: 10 } );

      sliderNode.addChild( labelHBox );

      var sliderVBox = new VBox( {
        top: labelHBox.bottom + 8,
        resize: false,
        children: [
          new HStrut( 220 ),
          new BodyMassControl(
            massSettableBody,
            massSettableBody.massProperty.getRewindValue() / 2,
            massSettableBody.massProperty.getRewindValue() * 2,
            massSettableBody.tickValue,
            massSettableBody.tickLabel )
        ]
      } );

      sliderNode.addChild( sliderVBox );
      children.push( sliderNode );
    }

    var vBox = new VBox( { children: children, spacing: 25, y: 5, resize: false, align: 'left' } );
    Panel.call( this, vBox, options );
  }

  gravityAndOrbits.register( 'MassControlPanel', MassControlPanel );

  return inherit( Panel, MassControlPanel );
} );
