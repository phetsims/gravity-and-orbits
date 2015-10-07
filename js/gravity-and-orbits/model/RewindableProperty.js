// Copyright 2002-2015, University of Colorado Boulder

/**
 * This is a property that can be rewound, and when rewound it goes back
 * to the value that was last set while the clock was paused.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   *
   * @param {Property.<boolean>} playButtonPressedProperty
   * @param {Property.<boolean>} isSteppingProperty
   * @param {Property.<boolean>} isRewindingProperty
   * @param {*} value
   * @constructor
   */
  function RewindableProperty( playButtonPressedProperty, isSteppingProperty, isRewindingProperty, value ) {
    Property.call( this, value );
    this.playButtonPressedProperty = playButtonPressedProperty;

    // if the clock is paused and the user pressed 'step', do not store a rewind point
    this.isSteppingProperty = isSteppingProperty;

    // if the clock is paused and the user pressed 'rewind', do not store a rewind point
    this.isRewindingProperty= isRewindingProperty;

    // the "initial condition" tha the property can be rewound to
    this.rewindValue = value;

    // true when the rewind point value is different than the property's value
    this.differentProperty = new Property( !this.equalsRewindPoint() );

    this.rewindValueChangedListeners = [];
  }

  return inherit( Property, RewindableProperty, {

    set: function( value ) {
      Property.prototype.set.call( this, value );

      // If the user changed the initial conditions (as opposed to the state changing through model stepping), then store the new initial conditions, which can be rewound to
      if ( !this.playButtonPressedProperty.get() && !this.isSteppingProperty.get() && !this.isRewindingProperty.get() ) {
        this.storeRewindValueNoNotify();

        for ( var i = 0; i < this.rewindValueChangedListeners.length; i++ ) {
          this.rewindValueChangedListeners[i]();
        }
      }
      this.differentProperty.set( !this.equalsRewindPoint() );
    },

    // Store the new value as the initial condition which can be rewound to.  We have to skip notifications sometimes or the wrong initial conditions get stored.
    storeRewindValueNoNotify: function() {
      this.rewindValue = this.get();
    },

    // Adds a listener that is notified when the user changes the initial conditions, which can be rewound to
    addRewindValueChangeListener: function( listener ) {
      this.rewindValueChangedListeners.push( listener );
    },

    equalsRewindPoint: function() {
      return this.rewindValue === this.get();
    },

    rewind: function() {
      this.set( this.rewindValue );
    },

    // Convenient access to whether the value has deviated from the initial condition
    different: function() {
      return this.differentProperty;
    },

    /**
     * Makes this public for use in gravity and orbits.
     */
    getInitialValue: function() {
      return this.rewindValue;
    }
  } );
} );