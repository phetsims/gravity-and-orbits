// Copyright 2014-2016, University of Colorado Boulder

/**
 * ModelState represents an immutable representation of the entire physical state and code for performing the
 * numerical integration which produces the next ModelState.
 * It is used by the GravityAndOrbitsModel to update the physics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  // constants
  var GRAVITATION_CONSTANT = 6.67428E-11;
  var XI = 0.1786178958448091;
  var LAMBDA = -0.2123418310626054;
  var CHI = -0.06626458266981849;

  // reduce Vector2 allocation by reusing these Vector2 in computations
  var relativePosition = new Vector2(); // used in getTwoBodyForce()
  var velocity = new Vector2(); // used in updatePositions()
  var netForce = new Vector2(); // used in getNetForce()

  /**
   * @param {Array.<BodyState>} bodyStates
   * @constructor
   */
  function ModelState( bodyStates ) {
    this.bodyStates = bodyStates; // @private
  }

  gravityAndOrbits.register( 'ModelState', ModelState );

  return inherit( Object, ModelState, {

    /**
     * Updates the model, producing the next ModelState
     *
     * @public
     * @param {number} dt
     * @param {Property.<boolean>} gravityEnabledProperty
     * @returns {ModelState}
     */
    getNextState: function( dt, gravityEnabledProperty ) {
      var state = this; // eslint-disable-line consistent-this

      if ( gravityEnabledProperty.get() ) {
        state = state.getNextInteractingState( dt );
      }
      else {

        // gravity is not active, bodies are coasting;
        return this.getNextCoastingState( dt );
      }
      return state;
    },

    /**
     * Finds the positions of the bodies after a time dt
     *
     * @private
     * @param {dt} number
     */
    updatePositions: function( dt ) {
      for ( var i = 0; i < this.bodyStates.length; i++ ) {
        var bodyState = this.bodyStates[ i ];
        velocity.setXY( bodyState.velocity.x * dt, bodyState.velocity.y * dt );
        bodyState.position.add( velocity );
      }
    },

    /**
     * Finds the velocities of the bodies after a time dt
     *
     * @private
     * @param {number} dt
     */
    updateVelocities: function( dt ) {
      this.updateAccelerations();
      for ( var i = 0; i < this.bodyStates.length; i++ ) {
        var bodyState = this.bodyStates[ i ];
        bodyState.velocity.add( bodyState.acceleration.multiplyScalar( dt ) );
      }
    },

    /**
     * Finds the current values of the accelerations
     *
     * @private
     */
    updateAccelerations: function() {
      for ( var i = 0; i < this.bodyStates.length; i++ ) {
        var bodyState = this.bodyStates[ i ];
        var acceleration = this.getNetForce( bodyState ).divideScalar( bodyState.mass );
        bodyState.acceleration.setXY( acceleration.x, acceleration.y );
      }
    },

    /**
     * Sets all the accelerations to zero, useful when gravity is turned off
     *
     * @private
     */
    setAccelerationToZero: function() {
      for ( var i = 0; i < this.bodyStates.length; i++ ) {
        this.bodyStates[ i ].acceleration = new Vector2();
      }
    },

    /**
     * Gets the net force on the bodyState due to the other bodies
     * 
     * @private
     * @param {BodyState} bodyState
     * @returns {Vector2}
     */
    getNetForce: function( bodyState ) {

      // use netForce to keep track of the net force, initialize to zero.
      netForce.setXY( 0, 0 );

      for ( var j = 0; j < this.bodyStates.length; j++ ) {

        // an object cannot act on itself
        if ( bodyState !== this.bodyStates[ j ] ) {

          // netForce is a mutable vector
          netForce.add( this.getTwoBodyForce( bodyState, this.bodyStates[ j ] ) );
        }
      }
      return netForce;
    },

    /**
     * Returns the force on the body source due to the body target
     * @private
     * @param {BodyState} source
     * @param {BodyState} target
     * @returns {Vector2}
     */
    getTwoBodyForce: function( source, target ) {
      if ( source.position.equals( target.position ) ) {

        // TODO: limit distance so forces don't become too large, perhaps we could compare it to the radius of
        // the bodies. If they are on top of each other, force should be infinite, but ignore it since we want to have
        // semi-realistic behavior.
        return Vector2.ZERO;
      }
      else if ( source.exploded || target.exploded ) {

        // ignore in the computation if that body has exploded
        return Vector2.ZERO;
      }
      else {

        // reuse relativePosition as an intermediary value to reduce Vector2 allocations
        relativePosition.x = target.position.x - source.position.x;
        relativePosition.y = target.position.y - source.position.y;

        var multiplicativeFactor = GRAVITATION_CONSTANT * source.mass * target.mass /
                                   Math.pow( source.position.distanceSquared( target.position ), 1.5 );
        return relativePosition.multiplyScalar( multiplicativeFactor );
      }
    },

    /**
     * Updates the model, producing the next ModelState when gravity is present
     * @private
     * @param {number} dt
     * @return {ModelState}
     */
    getNextCoastingState: function( dt ) {

      // update Positions
      this.updatePositions( dt );

      // update to Velocities are unnecessary since they stay constant

      // set the acceleration to zero.
      this.setAccelerationToZero();

      // return this ModelState mutated instead of a new ModelState with new Vector2 for performance reasons
      return this;
    },


    /**
     * Updates the model, producing the next ModelState when gravity is present
     * @private
     * @param {number} dt
     * @returns {ModelState}
     */
    getNextInteractingState: function( dt ) {

      //-------------
      // Step One
      //--------------

      // update Positions
      this.updatePositions( XI * dt );  // net time: XI dt

      // update Velocities
      this.updateVelocities( (1 - 2 * LAMBDA) * dt / 2 );// net time: (1 - 2 * LAMBDA) * dt / 2

      //-------------
      // Step Two
      //--------------

      // update Positions
      this.updatePositions( CHI * dt ); // net time: (XI+CHI) dt

      // update Velocities
      this.updateVelocities( LAMBDA * dt ); // net time: dt / 2

      //-------------
      // Step Three
      //--------------

      // update Positions
      this.updatePositions( (1 - 2 * (CHI + XI)) * dt ); // net time: (1-(XI+CHI)) dt

      // update Velocities
      this.updateVelocities( LAMBDA * dt ); // net time: (1/2 + LAMBDA) dt

      //-------------
      // Step Four
      //--------------

      // update Positions
      this.updatePositions( CHI * dt ); // net time: (1-(XI)) dt

      // update Velocities
      // no update in velocities // net time: (1/2 + LAMBDA) dt

      //-------------
      // Step Five: last step, these are the final positions and velocities i.e. r(t+dt) and v(t+dt)
      //--------------

      // IMPORTANT: we need to update the velocities first

      // update Velocities
      this.updateVelocities( (1 - 2 * LAMBDA) * dt / 2 ); // net time:  dt;

      // update Positions
      this.updatePositions( XI * dt ); // net time:  dt

      //-------------
      // Update the new acceleration
      //-------------
      this.updateAccelerations();

      // return this ModelState mutated instead of a new ModelState with new Vector2 for performance reasons
      return this;
    },

    /**
     * Get the BodyState for the specified index--future work could
     * change this signature to getState(Body body) since it would be safer.
     * See usage in GravityAndOrbitsModel constructor.
     * @public
     * @param {number} index
     * @returns {Array.<BodyState>}
     */
    getBodyState: function( index ) {
      return this.bodyStates[ index ];
    }
  } );
} );
