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
        var bodyState = this.bodyStates[ i ];

        var dtSquaredOver2 = dt * dt / 2;
        var dtOver2 = dt / 2;

        //Velocity Verlet (see svn history for Euler)
        var newPosition = new Vector2(
          bodyState.position.x + ( bodyState.velocity.x * dt ) + ( bodyState.acceleration.x * dtSquaredOver2 ),
          bodyState.position.y + ( bodyState.velocity.y * dt ) + ( bodyState.acceleration.y * dtSquaredOver2 ) );

        var velocityHalfX = bodyState.velocity.x + bodyState.acceleration.x * dtOver2;
        var velocityHalfY = bodyState.velocity.y + bodyState.acceleration.y * dtOver2;

        var force = this.getForce( bodyState, bodyState.position, gravityEnabledProperty );
        var newAcceleration = new Vector2(
          force.x * ( -1 / bodyState.mass ),
          force.y * ( -1 / bodyState.mass ) );

        var newVelocity = new Vector2(
          velocityHalfX + bodyState.acceleration.x * dtOver2,
          velocityHalfY + bodyState.acceleration.y * dtOver2 );

        newState.push( new BodyState( newPosition, newVelocity, newAcceleration, bodyState.mass, bodyState.exploded ) );
      }
      return new ModelState( newState );
    },

    //TODO: limit distance so forces don't become infinite
    /**
     *
     * @param {BodyState} source
     * @param {BodyState} target
     * @param {Vector2} newTargetPosition
     * @returns {*}
     * @private
     */
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

    /**
     * Get the force on body at its proposed new position, unconventional but necessary for velocity verlet.
     * @param {BodyState} target
     * @param {Vector2} newTargetPosition
     * @param {Property<boolean>} gravityEnabledProperty
     * @returns {Vector2}
     */
    getForce: function( target, newTargetPosition, gravityEnabledProperty ) {

      //zero vector, for no gravity
      var sum = new Vector2();
      if ( gravityEnabledProperty.get() ) {
        for ( var i = 0; i < this.bodyStates.length; i++ ) {
          var source = this.bodyStates[ i ];
          if ( source != target ) {
            sum = sum.plus( this._getForce( source, target, newTargetPosition ) );
          }
        }
      }
      return sum;
    },

    //Get the BodyState for the specified index--future work could change this signature to getState(Body body) since it would be safer. See usage in GravityAndOrbitsModel constructor.
    getBodyState: function( index ) {
      return this.bodyStates[ index ];
    }
  } );
} );