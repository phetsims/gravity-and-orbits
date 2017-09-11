// Copyright 2014-2015, University of Colorado Boulder

/**
 * This is a property that can be rewound, and when rewound it goes back
 * to the value that was last set by storeRewindValueNoNotify. In this sim, the rewind value is
 * stored at the initial configuration of a mode, or when a user modifies the position of a body.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
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

  gravityAndOrbits.register( 'RewindableProperty', RewindableProperty );

  return inherit( Property, RewindableProperty, {

    /**
     * Reset both the value and the rewind value.
     *
     * @public
     * @override
     */
    reset: function() {
      Property.prototype.reset.call( this );

      // reset the rewind value as well
      this.rewindValue = this.value;
    },

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
      this.differentProperty.set( !this.equalsRewindPoint() );
    },

    /**
     * @public
     * Adds a listener that is notified when the user changes the initial conditions, which can be rewound to
     * @param listener
     */
    addRewindValueChangeListener: function( listener ) {
      this.rewindValueChangedListeners.push( listener );
    },

    /**
     * Check for equality between current and rewind values.  Supported types are number, boolean
     * and Vector2.
     *
     * @public
     * @returns {boolean}
     */
    equalsRewindPoint: function() {
      // if an object, must call unique function to check for equality
      if ( this.rewindValue.equals ) {
        return this.rewindValue.equals( this.get() );
      }
      else {
        return this.rewindValue === this.get();
      }
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
