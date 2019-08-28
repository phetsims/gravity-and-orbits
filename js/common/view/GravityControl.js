// Copyright 2015-2017, University of Colorado Boulder

/**
 * Container for gravity mode menu.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

define( require => {
  'use strict';

  // modules
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  const gravityString = require( 'string!GRAVITY_AND_ORBITS/gravity' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const offString = require( 'string!GRAVITY_AND_ORBITS/off' );
  const onString = require( 'string!GRAVITY_AND_ORBITS/on' );

  // constants
  const FONT = new PhetFont( 14 );
  const TEXT_OPTIONS = { font: FONT, fill: GravityAndOrbitsColorProfile.panelTextProperty, maxWidth: 50 };
  const RADIO_OPTIONS = { radius: 7 };

  class GravityControl extends Node {

    /**
     * @param {Property.<boolean>} gravityEnabledProperty
     * @param {Object} [options] - This object contains options for main node of gravity mode menu.
     */
    constructor( gravityEnabledProperty, options ) {
      super( options );

      const gravityTextNode = new Text( gravityString, TEXT_OPTIONS );
      const onTextNode = new Text( onString, TEXT_OPTIONS );
      const offTextNode = new Text( offString, TEXT_OPTIONS );

      this.addChild( new HBox( {
        spacing: 10, bottom: 2, resize: false, children: [
          gravityTextNode,
          new AquaRadioButton( gravityEnabledProperty, true, onTextNode, RADIO_OPTIONS ),
          new AquaRadioButton( gravityEnabledProperty, false, offTextNode, RADIO_OPTIONS )
        ]
      } ) );
    }
  }

  return gravityAndOrbits.register( 'GravityControl', GravityControl );
} );