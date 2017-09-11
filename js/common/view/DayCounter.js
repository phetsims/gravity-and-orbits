// Copyright 2013-2015, University of Colorado Boulder

/**
 * Visual representation of day counter.
 * Contains clear button and numeric counter.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis (PhET)
 */

define( function( require ) {
  'use strict';

  // modules
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var clearString = require( 'string!GRAVITY_AND_ORBITS/clear' );

  // constants
  var FONT = new PhetFont( 22 );

  /**
   *
   * @param {function} timeFormatter
   * @param {GravityAndOrbitsClock} clock
   * @param [options]
   * @constructor
   */
  function DayCounter( timeFormatter, clock, options ) {
    Node.call( this );

    // day text counter
    var dayText = new Text( '', {
      font: FONT,
      fill: GravityAndOrbitsColorProfile.bottomControlTextProperty,
      maxWidth: 200
    } );

    var clearButton = new TextPushButton( clearString, {
      font: FONT,
      listener: function() {
        clock.setSimulationTime( 0 );
      },
      maxWidth: 200
    } );

    // update text representation of day
    this.timeListener = function( time ) {
      dayText.setText( timeFormatter( time ) );
      dayText.centerX = clearButton.centerX;
      clearButton.enabled = ( time !== 0 );
    };
    clock.simulationTimeProperty.link( this.timeListener );

    this.addChild( new VBox( {
      resize: false,
      spacing: 4,
      children: [
        dayText,
        clearButton
      ]
    } ) );

    this.mutate( options );
  }

  gravityAndOrbits.register( 'DayCounter', DayCounter );

  return inherit( Node, DayCounter );
} );
