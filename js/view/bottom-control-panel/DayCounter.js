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
  var inherit = require( 'PHET_CORE/inherit' ),
    Node = require( 'SCENERY/nodes/Node' ),
    TextPushButton = require( 'SUN/buttons/TextPushButton' ),
    clearString = require( 'string!GRAVITY_AND_ORBITS/clear' ),
    earthDaysString = require( 'string!GRAVITY_AND_ORBITS/earthDays' ),
    earthMinutesString = require( 'string!GRAVITY_AND_ORBITS/earthMinutes' ),
    Text = require( 'SCENERY/nodes/Text' ),
    PhetFont = require( 'SCENERY_PHET/PhetFont' ),
    FONT = new PhetFont( 16 ),
    VBox = require( 'SCENERY/nodes/VBox' );

  function DayCounter( model ) {
    var self = this;
    Node.call( this );

    var updateDay = function() {
      self.day.setText( parseInt( (model.day - model.dayOffset) * self.multiplier, 10 ).toString() + ' ' + self.text );
    };

    // day text counter
    this.day = new Text( '', { font: FONT, fill: '#fff', pickable: false } );

    var box = new VBox( {resize: false, spacing: 4, children: [
      // add day text counter
      this.day,

      // add clear button
      new TextPushButton( clearString, {
        font: FONT,
        listener: function() {
          model.dayOffset = model.day;
          updateDay();
        }} )
    ]} );

    this.addChild( box );

    model.timeModeProperty.link( function( mode ) {
      if ( mode === model.timeModes[0] ) { // days
        self.text = earthDaysString;
        self.multiplier = 1;
      }
      else if ( mode === model.timeModes[1] ) { // minutes
        self.text = earthMinutesString;
        self.multiplier = 24 * 60;
      }
      updateDay();
    } );

    model.dayProperty.link( updateDay );
    model.dayOffsetProperty.link( updateDay );

    // update layout view
    box.updateLayout();
  }

  return inherit( Node, DayCounter );
} );