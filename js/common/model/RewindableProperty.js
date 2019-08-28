// Copyright 2014-2019, University of Colorado Boulder

/**
 * This is a property that can be rewound, and when rewound it goes back
 * to the value that was last set by storeRewindValueNoNotify. In this sim, the rewind value is
 * stored at the initial configuration of a mode, or when a user modifies the position of a body.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const Property = require( 'AXON/Property' );

  class RewindableProperty extends Property {
    /**
     * @param {Property.<boolean>} changeRewindValueProperty
     * @param {*} value
     * @param {Object} options
     * @constructor
     */
    constructor( changeRewindValueProperty, value, options ) {
      super( value, options );

      // @private
      this.rewindValue = value; // the "initial condition" tha the property can be rewound to
      this.changeRewindValueProperty = changeRewindValueProperty;

      // true when the rewind point value is different than the property's value
      this.differentProperty = new Property( !this.equalsRewindPoint() ); // @private
      this.rewindValueChangedListeners = []; // @private
    }


    /**
     * Reset both the value and the rewind value.
     *
     * @public
     * @override
     */
    reset() {
      super.reset();

      // reset the rewind value as well
      this.rewindValue = this.value;
    }

    /**
     * @public
     * @override
     */
    set( value ) {
      super.set( value );

      // If the user changed the initial conditions (as opposed to the state changing through model stepping),
      // then store the new initial conditions, which can be rewound to
      if ( this.changeRewindValueProperty.get() ) {
        this.storeRewindValueNoNotify();

        for ( let i = 0; i < this.rewindValueChangedListeners.length; i++ ) {
          this.rewindValueChangedListeners[ i ]();
        }
      }
      this.differentProperty.set( !this.equalsRewindPoint() );
    }

    /**
     * @public
     * Store the new value as the initial condition which can be rewound to. We have to skip notifications sometimes
     * or the wrong initial conditions get stored.
     */
    storeRewindValueNoNotify() {
      this.rewindValue = this.get();
      this.differentProperty.set( !this.equalsRewindPoint() );
    }

    /**
     * @public
     * Adds a listener that is notified when the user changes the initial conditions, which can be rewound to
     * @param listener
     */
    addRewindValueChangeListener( listener ) {
      this.rewindValueChangedListeners.push( listener );
    }

    /**
     * Check for equality between current and rewind values.  Supported types are number, boolean
     * and Vector2.
     *
     * @public
     * @returns {boolean}
     */
    equalsRewindPoint() {
      // if an object, must call unique function to check for equality
      if ( this.rewindValue.equals ) {
        return this.rewindValue.equals( this.get() );
      }
      else {
        return this.rewindValue === this.get();
      }
    }

    // @public
    rewind() {
      this.set( this.rewindValue );
    }

    /**
     * @public
     * Convenient access to whether the value has deviated from the initial condition
     */
    different() {
      return this.differentProperty;
    }

    /**
     * @public
     * Makes this public for use in gravity and orbits.
     */
    getRewindValue() {
      return this.rewindValue;
    }
  }

  return gravityAndOrbits.register( 'RewindableProperty', RewindableProperty );
} );