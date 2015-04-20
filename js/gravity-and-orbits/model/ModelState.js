// Copyright 2002-2015, University of Colorado

/**
 * ModelState represents an immutable representation of the entire physical state and code for performing the numerical integration which produces the next ModelState.
 * It is used by the GravityAndOrbitsModel to update the physics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var BodyState = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/BodyState' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var GRAVITATION_CONSTANT = 6.67428E-11;
  var XI = 0.1786178958448091;
  var LAMBDA = -0.2123418310626054;
  var CHI = -0.06626458266981849;

  /**
   * @param {Array.<BodyState>} bodyStates
   * @constructor
   */
  function ModelState( bodyStates ) {

    var self = this;

    this.bodyStates = bodyStates;

    this.workingCopyBodyStates = []; // Array.<BodyState>}

    this.bodyStates.forEach( function( bodyState ) {
      self.workingCopyBodyStates.push( new BodyState(
        bodyState.position,
        bodyState.velocity,
        bodyState.acceleration,
        bodyState.mass,
        bodyState.exploded
      ) );
    } );
  }

  return inherit( Object, ModelState, {

    /**
     * Updates the model, producing the next ModelState
     * @public
     * @param {number} dt
     * @param {number} numSteps
     * @param {Property.<Boolean>} gravityEnabledProperty
     * @returns {ModelState}
     */
    getNextState: function( dt, numSteps, gravityEnabledProperty ) {
      var state = this;

      if ( gravityEnabledProperty.get() ) {
        for ( var i = 0; i < numSteps; i++ ) {
          state = state.getNextInteractingState( dt / numSteps );
        }
      }
      else {
        // gravity is not active, bodies are coasting;
        return this.getNextCoastingState( dt )
      }
      return state;
    },

    /**
     * Find the positions of the bodies after a time dt
     * @private
     * @param {dt} number
     */
    updatePositions: function( dt ) {
      this.workingCopyBodyStates.forEach( function( bodyState ) {
        bodyState.position.add( bodyState.velocity.timesScalar( dt ) );
      } );
    },

    /**
     * Find the velocities of the bodies after a time dt
     * @private
     * @param {number} dt
     */
    updateVelocities: function( dt ) {
      this.updateAccelerations();
      this.workingCopyBodyStates.forEach( function( bodyState ) {
        bodyState.velocity.add( bodyState.acceleration.multiplyScalar( dt ) );
      } );
    },

    /**
     * Find the current values of the accelerations
     * @private
     */
    updateAccelerations: function() {
      var self = this;
      this.workingCopyBodyStates.forEach( function( bodyState ) {
        bodyState.acceleration = self.getNetForce( bodyState ).divideScalar( bodyState.mass );
      } );
    },

    /**
     * set accelerations to zero
     * @private
     */
    setAccelerationToZero: function() {
      this.workingCopyBodyStates.forEach( function( bodyState ) {
        bodyState.acceleration = Vector2.ZERO;
      } );
    },

    /**
     * Get the net force on the bodyState due to the other bodies
     * @private
     * @param {BodyState} bodyState
     * @returns {Vector2}
     */
    getNetForce: function( bodyState ) {

      // use netForce to keep track of the net force, initialize to zero.
      var netForce = new Vector2();

      for ( var j = 0; j < this.workingCopyBodyStates.length; j++ ) {
        if ( bodyState != this.workingCopyBodyStates[ j ] ) // an object cannot act on itself
        {
          // netForce is a mutable vector
          netForce.add( this.getTwoBodyForce( bodyState, this.workingCopyBodyStates[ j ] ) );
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
        //TODO: limit distance so forces don't become too large, perhaps we could compare it to the radius of the bodies
        //If they are on top of each other, force should be infinite, but ignore it since we want to have semi-realistic behavior
        return Vector2.ZERO;
      }
      else if ( source.exploded ) {
        //ignore in the computation if that body has exploded
        return Vector2.ZERO;
      }
      else {
        var relativePosition = target.position.minus( source.position );
        var multiplicativeFactor = GRAVITATION_CONSTANT * source.mass * target.mass / Math.pow( source.position.distanceSquared( target.position ), 1.5 );
        return relativePosition.multiplyScalar( multiplicativeFactor );
      }
    },

    /**
     * Updates the model, producing the next ModelState when gravity is present
     * @param {number} dt
     * @return {ModelState}
     * @private
     */
    getNextCoastingState: function( dt ) {

      // update Positions
      this.updatePositions( dt );

      // update to Velocities are unnecessary since they stay constant

      // set the acceleration to zero.
      this.setAccelerationToZero();

      this.updateAccelerations();

      var newState = [];// {Array.<BodyState>}
      this.workingCopyBodyStates.forEach( function( bodyState ) {
        newState.push( new BodyState(
          bodyState.position,
          bodyState.velocity,
          bodyState.acceleration,
          bodyState.mass,
          bodyState.exploded
        ) );
      } );

      return new ModelState( newState );
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

      var newState = [];// {Array.<BodyState>}
      this.workingCopyBodyStates.forEach( function( bodyState ) {
        newState.push( new BodyState(
          new Vector2( bodyState.position.x, bodyState.position.y ),
          new Vector2( bodyState.velocity.x, bodyState.velocity.y ),
          new Vector2( bodyState.acceleration.x, bodyState.acceleration.y),
          bodyState.mass,
          bodyState.exploded
        ) );
      } );

      return new ModelState( newState );
    },

    //Get the BodyState for the specified index--future work could change this signature to getState(Body body) since it would be safer. See usage in GravityAndOrbitsModel constructor.
    getBodyState: function( index ) {
      return this.bodyStates[ index ];
    }
  } );
} );