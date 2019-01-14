// Copyright 2014-2017, University of Colorado Boulder

/**
 * This is the model for Gravity and Orbits; there is one GravityAndOrbitsModel per each GravityAndOrbitsMode, and it
 * uses ModelState to update the physics.
 *
 * Ported from the Java version
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelState = require( 'GRAVITY_AND_ORBITS/common/model/ModelState' );

  /**
   * Return the smaller of two Body instances, for determining which survives a collision.
   * @param {Body} other
   * @param {Body} body
   * @returns {Body} the smaller body
   */
  function getSmaller( other, body ) {
    if ( other.massProperty.get() < body.massProperty.get() ) {
      return other;
    }
    else {
      return body;
    }
  }

  /**
   * For use inside a map call, factored out here for performance
   * @param body
   * @returns {BodyState}
   */
  function getBodyState( body ) {
    return body.toBodyState();
  }


  /**
   * Main constructor for GravityAndOrbitsModel, which contains all of the model logic for the entire sim screen.
   * @param {GravityAndOrbitsClock} clock
   * @param {Property.<boolean>} gravityEnabledProperty flag to indicate whether gravity is on or off.
   * @constructor
   */
  function GravityAndOrbitsModel( clock, gravityEnabledProperty ) {

    // @private
    this.gravityEnabledProperty = gravityEnabledProperty;

    this.clock = clock; // @public
    this.bodies = []; // @public - contains the sun, moon, earth, satellite

    var self = this;
    this.clock.addEventTimer( function( dt ) {
      self.clock.setSimulationTime( self.clock.dt + self.clock.getSimulationTime() );

      // NOTE: replacing step with stepModel fixes https://github.com/phetsims/gravity-and-orbits/issues/253
      // but introduces performance issues
      // self.stepModel( self.clock.dt );
      self.step( self.clock.dt );
    }.bind( this ) );

    // Have to update force vectors when gravity gets toggled on and off, otherwise displayed value won't update
    this.gravityEnabledProperty.link( this.updateForceVectors.bind( this ) );
  }

  gravityAndOrbits.register( 'GravityAndOrbitsModel', GravityAndOrbitsModel );

  return inherit( Object, GravityAndOrbitsModel, {


    /**
     * Standardize the time step so that the play speed has no impact on the model.
     * For a large time step, we break apart the change in time into a series of time
     * steps.  This ensures that this.step and the next model state is calculated
     * with consistent changes in time.
     *
     * NOTE: This function is currently not used, but it fixes https://github.com/phetsims/gravity-and-orbits/issues/253
     * However, it introduces performance issues because it increase the model computations by ~8x.
     * If work continues in #253, this is a good place to start
     * 
     * @param {number} dt
     */
    stepModel: function( dt ) {

      // standardized time step - based on the slowest time step for the given orbital mode
      var smallestTimeStep = this.clock.getSmallestTimeStep();

      // get the number of times we will need to step the model based on the dt passed in
      var numberOfSteps = dt / smallestTimeStep;

      // get the remainder - we must step the model by this at the end so full dt is captured
      var remainder = dt % smallestTimeStep;

      // step the model by the smallest standard time step for the orbital mode
      for ( var i = 0; i < numberOfSteps; i++ ) {
        this.step( smallestTimeStep );
      }

      // if there is a remainder, step by that
      if ( remainder > 0 ) {
        this.step( remainder );
      }
    },

    /**
     * Step function for the model.  This function creates state objects and calculates state values for this step
     * based on the current state of the entire model.  Once doen, it applies the updated values to the body
     * objects.  Finally, it checks for collisions between bodies.
     *
     * @param  {number} dt
     */

    step: function( dt ) {
      var i;

      // Compute the next state for each body based on the current state of all bodies in the system.
      var bodyStates = this.bodies.map( getBodyState );
      var newState = new ModelState( bodyStates, this.clock ).getNextState( dt, this.gravityEnabledProperty );

      // Set each body to its computed next state.
      // assumes that ModelState.getBodyState returns states in the same order as the container (ArrayList) used for
      // bodies. A possible future improvement would be
      // to switch to use ModelState.getState(Body), which would be safer.
      for ( i = 0; i < this.bodies.length; i++ ) {
        this.bodies[ i ].updateBodyStateFromModel( newState.getBodyState( i ) );
      }
      // when two bodies collide, destroy the smaller
      for ( var j = 0; j < this.bodies.length; j++ ) {
        var body = this.bodies[ j ];
        for ( var k = 0; k < this.bodies.length; k++ ) {
          var other = this.bodies[ k ];
          if ( other !== body ) {
            if ( other.collidesWidth( body ) ) {
              getSmaller( other, body ).collidedProperty.set( true );
            }
          }
        }
      }

      // Signify that the model completed an entire step so that any batch operations may be invoked
      for ( i = 0; i < this.bodies.length; i++ ) {
        this.bodies[ i ].allBodiesUpdated();
      }
    },

    // @public
    resetAll: function() {
      this.resetBodies();
      this.clock.resetSimulationTime();
      this.updateForceVectors();
    },

    /**
     * Adds a body and updates the body's force vectors
     *
     * @public
     * @param body
     */
    addBody: function( body ) {
      var self = this;
      this.bodies.push( body );

      // update the force vectors when the position or mass changes
      body.userModifiedPositionEmitter.addListener( function() {
        self.updateForceVectors();
      } );
      body.massProperty.link( self.updateForceVectors.bind( this ) );
      this.updateForceVectors();
    },

    /**
     * Since we haven't (yet?) rewritten the gravity forces to auto-update when dependencies change, we update when
     * necessary:
     * (1) when a new body is added or
     * (2) when reset is pressed
     * This update is done by running the physics engine for dt=0.0 then applying the computed forces to the bodies.
     * Without this block of code, the force vectors would be zero on sim startup until the clock is started.
     *
     * @private
     */
    updateForceVectors: function() {
      this.step( 0 );
    },

    /**
     * Returns a defensive copy of the bodies.
     *
     * @returns {Array<Body>}
     * @public
     */
    getBodies: function() {
      return this.bodies.slice( 0 ); // operate on a copy, firing could result in the listeners changing
    },

    // @public
    resetBodies: function() {
      for ( var i = 0; i < this.bodies.length; i++ ) {
        this.bodies[ i ].resetAll();
      }
      this.updateForceVectors(); // has to be done separately since physics is computed as a batch
    },

    /**
     * Get the body associated with the name.  The name must be one of GravityAndOrbitsBodies.
     *
     * @param  {string} name
     * @returns {Body|null}
     */
    getBody: function( name ) {
      for ( var i = 0; i < this.bodies.length; i++ ) {
        var body = this.bodies[ i ];

        if ( body.name === name ) {
          return body;
        }
      }
      return null;
    }
  } );
} );
