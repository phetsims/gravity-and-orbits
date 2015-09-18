// Copyright 2002-2013, University of Colorado Boulder

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
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var GravityAndOrbitsColors = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsColors' );

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
    var dayText = new Text( '', { font: FONT, fill: '#fff' } );

    var clearButton = new TextPushButton( clearString, {
      font: FONT,
      listener: function() {
        clock.setSimulationTime( 0 );
      }
    } );

    GravityAndOrbitsColors.link( 'bottomControlText', function( color ) {
      dayText.fill = color;
    } );

    // update text representation of day
    clock.simulationTimeProperty.link( function( time ) {
      dayText.setText( timeFormatter( time ) );
      clearButton.enabled = ( time !== 0 );
    } );

    var box = new VBox( {
      resize: false, spacing: 4, children: [
        dayText,
        clearButton
      ]
    } );

    this.addChild( box );
    box.updateLayout(); // update layout view to center clear button

    this.mutate( options );
  }

  return inherit( Node, DayCounter );
} );