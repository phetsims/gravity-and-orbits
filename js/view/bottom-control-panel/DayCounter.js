// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of day counter.
 * Contains clear button and numeric counter.
 * Mode of counting (day/minutes) depends on the planet mode.
 *
 * @author Andrey Zelenkov (Mlearner)
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

  // strings
  var clearString = require( 'string!GRAVITY_AND_ORBITS/clear' );
  var earthDaysString = require( 'string!GRAVITY_AND_ORBITS/earthDays' );
  var earthMinutesString = require( 'string!GRAVITY_AND_ORBITS/earthMinutes' );

  // constants
  var FONT = new PhetFont( 16 );

  /**
   * @param {Property} dayProperty - Passed time in days.
   * @param {Property} dayOffsetProperty - Zero day value.
   * @param {Property} timeModeProperty - Type of representation of passed time.
   * @param {Array} timeModes - Possible time representation modes.
   * @constructor
   */
  function DayCounter( dayProperty, dayOffsetProperty, timeModeProperty, timeModes ) {
    var dayCounter = this;
    Node.call( this );

    // update text representation of day
    var updateDay = function() {
      dayCounter.day.setText( parseInt( (dayProperty.value - dayOffsetProperty.value) * dayCounter.multiplier, 10 ).toString() + ' ' + dayCounter.text );
    };

    // day text counter
    this.day = new Text( '', { font: FONT, fill: '#fff', pickable: false } );

    var box = new VBox( {
      resize: false, spacing: 4, children: [
        // add day text counter
        this.day,

        // add clear button
        new TextPushButton( clearString, {
          font: FONT,
          listener: function() {
            dayOffsetProperty.value = dayProperty.value;
            updateDay();
          }
        } )
      ]
    } );

    this.addChild( box );

    timeModeProperty.link( function( mode ) {
      if ( mode === timeModes[ 0 ] ) { // days
        dayCounter.text = earthDaysString;
        dayCounter.multiplier = 1;
      }
      else if ( mode === timeModes[ 1 ] ) { // minutes
        dayCounter.text = earthMinutesString;
        dayCounter.multiplier = 24 * 60;
      }
      updateDay();
    } );

    dayProperty.link( updateDay );
    dayOffsetProperty.link( updateDay );

    // update layout view
    box.updateLayout();
  }

  return inherit( Node, DayCounter );
} );