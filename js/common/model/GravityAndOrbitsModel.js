// Copyright 2014-2015, University of Colorado Boulder

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
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ModelState = require( 'GRAVITY_AND_ORBITS/common/model/ModelState' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  /**
   * Return the smaller of two Body instances, for determining which survives a collision.
   * @param {Body} other
   * @param {Body} body
   * @return {Body} the smaller body
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

    // @public
    PropertySet.call( this, {} );

    // @private
    this.gravityEnabledProperty = gravityEnabledProperty;

    this.clock = clock; // @public
    this.bodies = []; // @public - contains the sun, moon, earth, satellite

    var self = this;
    this.clock.addEventTimer( function( dt ) {
      self.clock.setSimulationTime( self.clock.dt + self.clock.getSimulationTime() );
      self.step( self.clock.dt );
    }.bind( this ) );

    // Have to update force vectors when gravity gets toggled on and off, otherwise displayed value won't update
    this.gravityEnabledProperty.link( this.updateForceVectors.bind( this ) );
  }

  gravityAndOrbits.register( 'GravityAndOrbitsModel', GravityAndOrbitsModel );

  return inherit( PropertySet, GravityAndOrbitsModel, {

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
      var newState = new ModelState( bodyStates ).getNextState( dt, this.gravityEnabledProperty );

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
      PropertySet.prototype.reset.call( this ); // Resets the simulation time
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
     * @return {Array<Body>}
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
     * Unexplodes and returns objects to the stage
     *
     * @public
     */
    returnBodies: function() {

      for ( var i = 0; i < this.bodies.length; i++ ) {
        var body = this.bodies[ i ];
        body.returnBody( this );
      }

      // Fixes: "Return object" should recalculate the gravity force vectors and update them even when paused ... right
      // now it displays the force vectors of the prior situation before it moved the moon or planet.
      this.updateForceVectors();
    },

    /**
     * Get the body associated with the name.  The name must be one of GAOBodiesEnum.
     *
     * @param  {string} name
     * @return {Body|null}
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
