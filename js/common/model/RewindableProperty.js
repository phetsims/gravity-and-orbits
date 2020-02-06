// Copyright 2014-2020, University of Colorado Boulder

/**
 * This is a property that can be rewound, and when rewound it goes back to the value that was last set by
 * storeRewindValueNoNotify. In this sim, the rewind value is stored at the initial configuration of a mode, or when a
 * user modifies the position of a body.
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
     * @param {Property.<boolean>} changeRewindValueProperty - whether the newly set value should be captured as a rewindable point
     * @param {*} value
     * @param {Object} [options]
     * @constructor
     */
    constructor( changeRewindValueProperty, value, options ) {
      super( value, options );

      // @private - the "initial condition" the property can be rewound to, different than the overall "reset" value
      this.rewindValue = value;

      // @private - see above
      this.changeRewindValueProperty = changeRewindValueProperty;

      // @public (read-only) true when the rewind point value is different than the property's current value
      this.differentProperty = new Property( !this.equalsRewindValue() );
    }

    /**
     * Take the rewind value as the initial value
     * @param {*} value
     * @override
     */
    setInitialValue( value ) {
      super.setInitialValue( value );
      this.rewindValue = value;
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
      }
      this.differentProperty.set( !this.equalsRewindValue() );
    }

    /**
     * Store the new value as the initial condition which can be rewound to. We have to skip notifications sometimes
     * or the wrong initial conditions get stored.
     * @public
     */
    storeRewindValueNoNotify() {
      this.rewindValue = this.get();
      this.differentProperty.set( !this.equalsRewindValue() );
    }

    /**
     * Check for equality between current and rewind values.  Supported types are number, boolean
     * and Vector2.
     *
     * @public
     * @returns {boolean}
     */
    equalsRewindValue() {

      // if an object, must call unique function to check for equality
      if ( this.rewindValue.equals ) {
        return this.rewindValue.equals( this.get() );
      }
      else {
        return this.rewindValue === this.get();
      }
    }

    /**
     * Set the value to match the last recorded rewindValue
     * @public
     */
    rewind() {
      this.set( this.rewindValue );
    }
  }

  return gravityAndOrbits.register( 'RewindableProperty', RewindableProperty );
} );