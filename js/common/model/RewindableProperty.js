// Copyright 2014-2015, University of Colorado Boulder

/**
 * This is a property that can be rewound, and when rewound it goes back
 * to the value that was last set by storeRewindValueNoNotify.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Property.<boolean>} changeRewindValueProperty
   * @param {*} value
   * @constructor
   */
  function RewindableProperty( changeRewindValueProperty, value ) {
    Property.call( this, value );

    // @private
    this.rewindValue = value; // the "initial condition" tha the property can be rewound to
    this.changeRewindValueProperty = changeRewindValueProperty;

    // true when the rewind point value is different than the property's value
    this.differentProperty = new Property( !this.equalsRewindPoint() ); // @private
    this.rewindValueChangedListeners = []; // @private
  }

  return inherit( Property, RewindableProperty, {

    /**
     * @public
     * @override
     */
    set: function( value ) {
      Property.prototype.set.call( this, value );

      // If the user changed the initial conditions (as opposed to the state changing through model stepping),
      // then store the new initial conditions, which can be rewound to
      if ( this.changeRewindValueProperty.get() ) {
        this.storeRewindValueNoNotify();

        for ( var i = 0; i < this.rewindValueChangedListeners.length; i++ ) {
          this.rewindValueChangedListeners[ i ]();
        }
      }
      this.differentProperty.set( !this.equalsRewindPoint() );
    },

    /**
     * @public
     * Store the new value as the initial condition which can be rewound to. We have to skip notifications sometimes
     * or the wrong initial conditions get stored.
     */
    storeRewindValueNoNotify: function() {
      this.rewindValue = this.get();
    },

    /**
     * @public
     * Adds a listener that is notified when the user changes the initial conditions, which can be rewound to
     * @param listener
     */
    addRewindValueChangeListener: function( listener ) {
      this.rewindValueChangedListeners.push( listener );
    },

    // @public
    equalsRewindPoint: function() {
      return this.rewindValue === this.get();
    },

    // @public
    rewind: function() {
      this.set( this.rewindValue );
    },

    /**
     * @public
     * Convenient access to whether the value has deviated from the initial condition
     */
    different: function() {
      return this.differentProperty;
    },

    /**
     * @public
     * Makes this public for use in gravity and orbits.
     */
    getRewindValue: function() {
      return this.rewindValue;
    }
  } );
} );