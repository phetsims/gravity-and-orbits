// Copyright 2002-2015, University of Colorado Boulder

/**
 * Body is a single point mass in the Gravity and Orbits simulation, such as the Earth, Sun, Moon or Space Station.
 * This class also keeps track of body-related data such as the path.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var PropertySet = require( 'AXON/PropertySet' );
  var RewindableProperty = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/RewindableProperty' );
  var BodyState = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/BodyState' );
  var GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsConstants' );

  /**
   * Constructor for Body
   * @param {string} name
   * @param {number} x
   * @param {number} y
   * @param {number} diameter
   * @param {number} vx
   * @param {number} vy
   * @param {number} mass
   * @param {Color} color
   * @param {Color} highlight
   * @param {function<Body, number, BodyRenderer>} renderer - way to associate the graphical representation directly
   *                                                          instead of later with conditional logic or map
   * @param {number} labelAngle
   * @param {boolean} massSettable
   * @param {number} maxPathLength
   * @param {boolean} massReadoutBelow
   * @param {number} tickValue
   * @param {string} tickLabel
   * @param {Property<boolean>} playButtonPressedProperty
   * @param {Property<boolean>} steppingProperty
   * @param {Property<boolean>} rewindingProperty
   * @param {boolean} fixed
   * @constructor
   */
  function Body( name, x, y, diameter, vx, vy, mass, color, highlight, renderer,
                 labelAngle, massSettable, maxPathLength, massReadoutBelow, tickValue, tickLabel,
                 playButtonPressedProperty, steppingProperty, rewindingProperty, fixed ) {

    // @public
    PropertySet.call( this, {
      acceleration: new Vector2(),
      diameter: diameter, // {number}
      clockTicksSinceExplosion: 0,

      // if the object leaves these model bounds, then it can be "returned" using a return button on the canvas
      bounds: new Bounds2( 0, 0, 0, 0 )
    } );

    this.massSettable = massSettable; // @public (read-only)

    // number of samples in the path before it starts erasing (fading out from the back)
    this.maxPathLength = maxPathLength; // @public (read-only)

    // True if the mass readout should appear below the body (so that readouts don't overlap too much),
    // in the model for convenience since the body type determines where the mass readout should appear
    this.massReadoutBelow = massReadoutBelow; // @public (read-only)

    // value that this body's mass should be identified with, for 'planet' this will be the earth's mass
    this.tickValue = tickValue; // @public (read-only)

    // name associated with this body when it takes on the tickValue above, for 'planet' this will be "earth"
    this.tickLabel = tickLabel; // @public (read-only)

    // true if the object doesn't move when the physics engine runs, (though still can be moved by the user's mouse)
    this.fixed = fixed; // @public (read-only)
    this.name = name; // @public (read-only)
    this.color = color; // @public (read-only)
    this.highlight = highlight; // @public (read-only)

    assert && assert( renderer !== null );

    // Function that creates a Node for this Body. This is in the model so we can associate the graphical
    // representation directly instead of later with conditional logic or map
    this.renderer = renderer; // @private

    this.labelAngle = labelAngle; // @public
    this.positionProperty = new RewindableProperty(
      playButtonPressedProperty, steppingProperty, rewindingProperty, new Vector2( x, y ) ); // @public
    this.velocityProperty = new RewindableProperty(
      playButtonPressedProperty, steppingProperty, rewindingProperty, new Vector2( vx, vy ) ); // @public
    this.forceProperty = new RewindableProperty(
      playButtonPressedProperty, steppingProperty, rewindingProperty, new Vector2() ); // @public
    this.massProperty = new RewindableProperty(
      playButtonPressedProperty, steppingProperty, rewindingProperty, mass ); // @public
    this.collidedProperty = new RewindableProperty(
      playButtonPressedProperty, steppingProperty, rewindingProperty, false ); // @public
    this.density = mass / this.getVolume(); // @public

    // true if the user is currently controlling the position of the body with the mouse
    this.userControlled = false; // @public
    this.path = []; // @public - {Vector2[]} array of the points in the body's trail

    var thisBody = this;
    this.collidedProperty.onValue( true, function() {
      thisBody.clockTicksSinceExplosionProperty.set( 0 );
    } );

    // If any of the rewind properties changes while the clock is paused, set a rewind point for all of them.
    var rewindValueChangeListener = function() {
      thisBody.positionProperty.storeRewindValueNoNotify();
      thisBody.velocityProperty.storeRewindValueNoNotify();
      thisBody.forceProperty.storeRewindValueNoNotify();
      thisBody.massProperty.storeRewindValueNoNotify();
      thisBody.collidedProperty.storeRewindValueNoNotify();
    };
    this.positionProperty.addRewindValueChangeListener( rewindValueChangeListener );
    this.velocityProperty.addRewindValueChangeListener( rewindValueChangeListener );
    this.forceProperty.addRewindValueChangeListener( rewindValueChangeListener );
    this.massProperty.addRewindValueChangeListener( rewindValueChangeListener );
    this.collidedProperty.addRewindValueChangeListener( rewindValueChangeListener );
  }

  return inherit( PropertySet, Body, {

    /**
     * @return {number}
     */
    getVolume: function() {
      return 4.0 / 3.0 * Math.PI * Math.pow( this.getRadius(), 3 );
    },

    /**
     * @return {number}
     */
    getRadius: function() {
      return this.diameterProperty.get() / 2;
    },

    /**
     * create an immutable representation of this body for use in the physics engine
     * use copy() for Vector2 so that the properties don't get mutated
     *
     * @return {BodyState}
     */
    toBodyState: function() {
      return new BodyState(
        this.positionProperty.get().copy(),
        this.velocityProperty.get().copy(),
        this.accelerationProperty.get().copy(),
        this.massProperty.get(),
        this.collidedProperty.get() );
    },

    /**
     * Take the updated BodyState from the physics engine and update the state of this body based on it.
     *
     * @param {BodyState} bodyState
     */
    updateBodyStateFromModel: function( bodyState ) {
      if ( this.collidedProperty.get() ) {
        this.clockTicksSinceExplosionProperty.value += 1;
      }
      else {
        if ( !this.userControlled ) {
          this.positionProperty.set( bodyState.position );
          this.velocityProperty.set( bodyState.velocity );
        }
        this.accelerationProperty.set( bodyState.acceleration );
        this.forceProperty.set( bodyState.acceleration.times( bodyState.mass ) );
      }
    },

    // This method is called after all bodies have been updated by the physics engine (must be done as a batch),
    // so that the path can be updated
    allBodiesUpdated: function() {

      // Only add to the path if the user isn't dragging it and if the body is not exploded
      if ( !this.userControlled && !this.collidedProperty.get() ) {
        this.addPathPoint();
      }
    },

    addPathPoint: function() {

      // start removing data after 2 orbits of the default system
      // account for the point that will be added
      while ( this.path.length + 1 > this.maxPathLength ) {
        this.path.shift();
        this.trigger0( GravityAndOrbitsConstants.POINT_REMOVED );
      }
      var pathPoint = this.positionProperty.get();
      this.path.push( pathPoint );
      this.trigger1( GravityAndOrbitsConstants.POINT_ADDED, pathPoint );
    },

    clearPath: function() {
      this.path = [];
      this.trigger0( GravityAndOrbitsConstants.CLEARED );
    },

    resetAll: function() {
      this.positionProperty.reset();
      this.velocityProperty.reset();
      this.accelerationProperty.reset();
      this.forceProperty.reset();
      this.massProperty.reset();
      this.diameterProperty.reset();
      this.collidedProperty.reset();
      this.clockTicksSinceExplosionProperty.reset();
      this.clearPath();
    },

    /**
     * @return {BodyRenderer}
     */
    createRenderer: function( viewDiameter ) {
      return this.renderer( this, viewDiameter );
    },

    /**
     * @param {Body} body
     * @return {boolean}
     */
    collidesWidth: function( body ) {
      var distance = this.positionProperty.get().minus( body.positionProperty.get() ).magnitude();
      var radiiSum = this.diameterProperty.get() / 2 + body.diameterProperty.get() / 2;
      return distance < radiiSum;
    },

    rewind: function() {
      this.positionProperty.rewind();
      this.velocityProperty.rewind();
      this.forceProperty.rewind();
      this.massProperty.rewind();
      this.collidedProperty.rewind();
      this.clearPath();
    },

    /**
     * @returns {DerivedProperty}
     */
    anyPropertyDifferent: function() {
      var properties = [ this.positionProperty.different(), this.velocityProperty.different(),
        this.massProperty.different(), this.collidedProperty.different() ];
      return new DerivedProperty( properties, function() {
        return _.any( arguments, _.identity );
      } );
    },

    /**
     * Unexplodes and returns objects to the stage
     *
     * @param {GravityAndOrbitsModel} model
     */
    returnBody: function( model ) {
      if ( this.collidedProperty.get() || !this.bounds.containsPoint( this.positionProperty.get() ) ) {
        this.collidedProperty.set( false );
        this.clearPath(); // so there is no sudden jump in path from old to new location
        this.doReturnBody( model );
      }
    },

    /**
     * Unexplodes and returns objects to the stage
     */
    doReturnBody: function() {
      this.positionProperty.reset();
      this.velocityProperty.reset();
    },

    /**
     * @return {string}
     */
    toString: function() {
      return 'name = ' + this.name + ', mass = ' + this.massProperty.get();
    }

  } );
} );