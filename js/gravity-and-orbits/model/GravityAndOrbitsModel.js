// Copyright 2002-2015, University of Colorado Boulder

/**
 * This is the model for Gravity and Orbits; there is one GravityAndOrbitsModel per each GravityAndOrbitsMode, and it uses ModelState to update the physics.
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
  var ModelState = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/ModelState' );

  //Subdivide DT intervals by this factor to improve smoothing, otherwise some orbits look too non-smooth (you can see their corners), see #3050
  var SMOOTHING_STEPS = 1; // TODO: this was 5 in the java version but kills performance in HTML5. Perhaps is it not needed.

  /**
   * Return the smaller of two Body instances, for determining which survives a collision.
   *
   * @param {Body} other
   * @param {Body} body
   * @return {Body} the smaller body
   */
  function getSmaller( other, body ) {
    if ( other.getMass() < body.getMass() ) {
      return other;
    }
    else {
      return body;
    }
  }

  /**
   * Main constructor for GravityAndOrbitsModel, which contains all of the model logic for the entire sim screen.
   * @param {GravityAndOrbitsClock} clock flag to indicate whether gravity is on or off.
   * @param {Property<Boolean>} gravityEnabledProperty flag to indicate whether gravity is on or off.
   * @constructor
   */
  function GravityAndOrbitsModel( clock, gravityEnabledProperty ) {
    PropertySet.call( this, {
      gravityEnabled: true, // this was originally an argument to the model
      paused: true
    } );

    this.clock = clock;
    this.bodies = [];//Contains the sun, moon, earth, satellite
    this.modelStepListeners = [];//SimpleObservers//TODO: Convert to trigger

    var thisModel = this;
    this.clock.addEventTimer( (function( dt ) {
      thisModel.clock.setSimulationTime( thisModel.clock.dt + thisModel.clock.getSimulationTime() );
      thisModel.step( thisModel.clock.dt );
    }).bind( this ) );

    //Have to update force vectors when gravity gets toggled on and off, otherwise displayed value won't update
    this.gravityEnabledProperty.link( this.updateForceVectors.bind( this ) );
  }

  return inherit( PropertySet, GravityAndOrbitsModel, {

      // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
      step: function( dt ) {
        var i;

        //Break up the update into discrete steps to make the orbits look smoother, see #3050
        for ( i = 0; i < SMOOTHING_STEPS; i++ ) {
          this.performSubStep( dt / SMOOTHING_STEPS );
        }

        //TODO: Change to a trigger
        for ( i = 0; i < this.modelStepListeners.length; i++ ) {
          var modelStepListener = this.modelStepListeners[ i ];
          modelStepListener.update();
        }
      },

      //Perform one of several steps and update body paths in each iteration to smooth out the orbits
      performSubStep: function( dt ) {

        var i;
        //Compute the next state for each body based on the current state of all bodies in the system.
        var bodyStates = this.bodies.map( function( body ) {return body.toBodyState();} );
        var newState = new ModelState( bodyStates ).getNextState(
          dt,
          1 / SMOOTHING_STEPS, // 1000 looks great, 50 starts to look awkward for sun+earth+moon, but 100 seems okay.
          // Update: 100 is poor for sun/earth/moon system in "to scale" because the orbit is gradually expanding.
          // Tests suggest 400 is a good performance/precision tradeoff
          this.gravityEnabledProperty
        );

        // Set each body to its computed next state.
        // assumes that ModelState.getBodyState returns states in the same order as the container (ArrayList) used for
        // bodies. A possible future improvement would be
        // to switch to use ModelState.getState(Body), which would be safer.
        for ( i = 0; i < this.bodies.length; i++ ) {
          this.bodies[ i ].updateBodyStateFromModel( newState.getBodyState( i ) );
        }
        //when two bodies collide, destroy the smaller
        for ( var j = 0; j < this.bodies.length; j++ ) {
          var body = this.bodies[ j ];
          for ( var k = 0; k < this.bodies.length; k++ ) {
            var other = this.bodies[ k ];
            if ( other !== body ) {
              if ( other.collidesWidth( body ) ) {
                getSmaller( other, body ).setCollided( true );
              }
            }
          }
        }

        //For debugging error in the integrator
//                System.out.println( clock.getSimulationTime() + "\t" + getSunEarthDistance() );

        //Signify that the model completed an entire step so that any batch operations may be invoked
        for ( i = 0; i < this.bodies.length; i++ ) {
          this.bodies[ i ].allBodiesUpdated();
        }
      },

      //For debugging the stability of the integration rule
      getSunEarthDistance: function() {
        var star = this.getBody( "star" );
        var planet = this.getBody( "planet" );
        if ( star === null || planet === null ) {
          return NaN;
        }
        return star.getPosition().distance( planet.getPosition() );
      },

      resetAll: function() {
        PropertySet.prototype.reset.call( this ); // Resets the simulation time
        this.resetBodies();
        this.clock.resetSimulationTime();
        this.updateForceVectors();
      },

      addModelSteppedListener: function( simpleObserver ) {
        this.modelStepListeners.push( simpleObserver );
      },

      //Adds a body and updates the body's force vectors
      addBody: function( body ) {
        var gravityAndOrbitsModel = this;
        this.bodies.push( body );

        // If the user modifies the position, and the sim is paused, we must update the force vectors manually since
        // the model will not update them for us.
        body.addUserModifiedPositionListener( function() {
          if ( gravityAndOrbitsModel.paused ) { gravityAndOrbitsModel.updateForceVectors(); }
        } );
        body.getMassProperty().link( function() {
          if ( gravityAndOrbitsModel.paused ) { gravityAndOrbitsModel.updateForceVectors(); }
        } );
        this.updateForceVectors();
      },

      /*
       * Since we haven't (yet?) rewritten the gravity forces to auto-update when dependencies change, we update when necessary
       * (1) when a new body is added or (2) when reset is pressed.
       * This update is done by running the physics engine for dt=0.0 then applying the computed forces to the bodies.
       * <p/>
       * Without this block of code, the force vectors would be zero on sim startup until the clock is started.
       */
      updateForceVectors: function() {
        this.step( 0.0 );//the effect of stepping the model is to update the force vectors
      },

      /**
       * Returns a defensive copy of the bodies.
       * @return {Array<Body>}
       */
      getBodies: function() {
        return this.bodies.slice( 0 ); // operate on a copy, firing could result in the listeners changing
      },

      getClock: function() {
        return this.clock;
      },

      resetBodies: function() {
        for ( var i = 0; i < this.bodies.length; i++ ) {
          this.bodies[ i ].resetAll();
        }
        this.updateForceVectors();//has to be done separately since physics is computed as a batch
      },

      // Unexplodes and returns objects to the stage
      returnBodies: function() {

        for ( var i = 0; i < this.bodies.length; i++ ) {
          var body = this.bodies[ i ];
          body.returnBody( this );
        }

        // Fixes: "Return object" should recalculate the gravity force vectors and update them even when paused ... right
        // now it displays the force vectors of the prior situation before it moved the moon or planet.
        this.updateForceVectors();
      },

      getBody: function( name ) {
        for ( var i = 0; i < this.bodies.length; i++ ) {
          var body = this.bodies[ i ];

          // TODO: is it important to do a case-insensitive compare?
          if ( body.getName().toLowerCase() === name.toLowerCase() ) {
            return body;
          }
        }
        return null;
      }
    },

    // Statics
    {
      SMOOTHING_STEPS: SMOOTHING_STEPS
    } );
} );