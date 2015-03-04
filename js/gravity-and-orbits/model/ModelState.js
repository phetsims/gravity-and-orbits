// Copyright 2002-2012, University of Colorado

/**
 * ModelState represents an immutable representation of the entire physical state and code for performing the numerical integration which produces the next ModelState.
 * It is used by the GravityAndOrbitsModel to update the physics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var BodyState = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/BodyState' );
  var GravityAndOrbitsModule = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/GravityAndOrbitsModule' );

  /**
   * @param {Array<BodyState>} bodyStates
   * @constructor
   */
  function ModelState( bodyStates ) {
    this.bodyStates = bodyStates;
  }

  return inherit( Object, ModelState, {

    /**
     * Updates the model, producing the next ModelState
     * @param {number} dt
     * @param {number} numSteps
     * @param {Property<Boolean>} gravityEnabledProperty
     * @return {Object}
     */
    getNextState: function( dt, numSteps, gravityEnabledProperty ) {
      var state = this;
      for ( var i = 0; i < numSteps; i++ ) {
        state = state._getNextState( dt / numSteps, gravityEnabledProperty );
      }
      return state;
    },

    /**
     * Updates the model, producing the next ModelState
     * @param {number} dt
     * @param {Property<Boolean>} gravityEnabledProperty
     * @return {ModelState}
     * @private
     */
    _getNextState: function( dt, gravityEnabledProperty ) {

      //See http://www.fisica.uniud.it/~ercolessi/md/md/node21.html
      var newState = [];
      for ( var i = 0; i < this.bodyStates.length; i++ ) {
        var bodyState = this.bodyStates[i];

        //Velocity Verlet (see svn history for Euler)
        var newPosition = bodyState.position.plus( bodyState.velocity.times( dt ) ).plus( bodyState.acceleration.times( dt * dt / 2 ) );
        var newVelocityHalfStep = bodyState.velocity.plus( bodyState.acceleration.times( dt / 2 ) );
        var newAcceleration = this.getForce( bodyState, newPosition, gravityEnabledProperty ).times( -1.0 / bodyState.mass );
        var newVelocity = newVelocityHalfStep.plus( newAcceleration.times( dt / 2.0 ) );
        newState.push( new BodyState( newPosition, newVelocity, newAcceleration, bodyState.mass, bodyState.exploded ) );
      }
      return new ModelState( newState );
    },

    //TODO: limit distance so forces don't become infinite
    _getForce: function( source, target, newTargetPosition ) {
      if ( source.position.equals( newTargetPosition ) ) {

        //If they are on top of each other, force should be infinite, but ignore it since we want to have semi-realistic behavior
        return new Vector2();
      }
      else if ( source.exploded ) {

        //ignore in the computation if that body has exploded
        return new Vector2();
      }
      else {
        return this.getUnitVector( source, newTargetPosition ).times( GravityAndOrbitsModule.G * source.mass * target.mass / source.distanceSquared( newTargetPosition ) );
      }
    },

    getUnitVector: function( source, newPosition ) {
      return newPosition.minus( source.position ).normalized();
    },

    //Get the force on body at its proposed new position, unconventional but necessary for velocity verlet.
    getForce: function( target, newTargetPosition, gravityEnabledProperty ) {

      //zero vector, for no gravity
      var sum = new Vector2();
      if ( gravityEnabledProperty.get() ) {
        for ( var i = 0; i < this.bodyStates.length; i++ ) {
          var source = this.bodyStates[i];
          if ( source != target ) {
            sum = sum.plus( this._getForce( source, target, newTargetPosition ) );
          }
        }
      }
      return sum;
    },

    //Get the BodyState for the specified index--future work could change this signature to getState(Body body) since it would be safer. See usage in GravityAndOrbitsModel constructor.
    getBodyState: function( index ) {
      return this.bodyStates[index];
    }
  } );
} );