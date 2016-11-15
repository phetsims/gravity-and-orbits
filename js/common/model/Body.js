// Copyright 2014-2015, University of Colorado Boulder

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
  var RewindableProperty = require( 'GRAVITY_AND_ORBITS/common/model/RewindableProperty' );
  var BodyState = require( 'GRAVITY_AND_ORBITS/common/model/BodyState' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  var Emitter = require( 'AXON/Emitter' );

  // strings
  var satelliteString = require( 'string!GRAVITY_AND_ORBITS/satellite' );
  var moonString = require( 'string!GRAVITY_AND_ORBITS/moon' );
  var planetString = require( 'string!GRAVITY_AND_ORBITS/planet' );
  var starString = require( 'string!GRAVITY_AND_ORBITS/star' );

  // constants
  // map the body identifier to the translatable label for the body
  // must be one of GAOBodiesEnum
  var LABEL_MAP = {
    PLANET: planetString,
    SATELLITE: satelliteString,
    STAR: starString,
    MOON: moonString
  };

  // reduce Vector2 allocation by reusing this Vector2 in collidesWith computation
  var tempVector = new Vector2();

  /**
   * Constructor for Body
   * @param {string} name - unqique name for the body, one of GAOBodiesEnum, used for object identification
   * @param {BodyConfiguration} bodyConfiguration - collection of properties that define the body state
   * @param {Color} color
   * @param {Color} highlight
   * @param {function.<Body, number, BodyRenderer>} BodyRenderer - way to associate the graphical representation directly
   *                                                          instead of later with conditional logic or map
   * @param {number} labelAngle
   * @param {number} tickValue - default value for mass setting 
   * @param {string} tickLabel - translatable label for the mass slider labeling the default value
   * @param {ModeListParameterList} parameterList - composition of Properties that determine body state
   * @param {Object} [options]
   * @constructor
   */
  function Body( name, bodyConfiguration, color, highlight, renderer, labelAngle, tickValue, tickLabel, parameterList, options ) {

    options = _.extend( {
      pathLengthBuffer: 0, // a buffer to alter the path trace if necessary
      diameterScale: 1, // scale factor applied to the diameter
      massSettable: true, // can the mass of this body be set by the control panel?
      massReadoutBelow: true // should the mass label appear below the body to prevent occlusion?
    }, options );

    var diameter = ( bodyConfiguration.radius * 2 ) * options.diameterScale;

    // @public
    PropertySet.call( this, {
      acceleration: new Vector2(),
      diameter: diameter, // {number}
      clockTicksSinceExplosion: 0,

      // if the object leaves these model bounds, then it can be "returned" using a return button on the canvas
      bounds: new Bounds2( 0, 0, 0, 0 )

    } );

    options = _.extend( {
      pathLengthBuffer: 0 // a buffer to alter the path trace if necessary
    }, options );
    this.pathLengthBuffer = options.pathLengthBuffer; // @public (read-only)

    this.massSettable = options.massSettable; // @public (read-only)

    // @public number of samples in the path before it starts erasing (fading out from the back)
    this.maxPathLength = 0;

    // @public - total length of the current path
    this.pathLength = 0;

    // True if the mass readout should appear below the body (so that readouts don't overlap too much),
    // in the model for convenience since the body type determines where the mass readout should appear
    this.massReadoutBelow = options.massReadoutBelow; // @public (read-only)

    // value that this body's mass should be identified with, for 'planet' this will be the earth's mass
    this.tickValue = tickValue; // @public (read-only)

    // name associated with this body when it takes on the tickValue above, for 'planet' this will be "earth"
    this.tickLabel = tickLabel; // @public (read-only)

    // true if the object doesn't move when the physics engine runs, (though still can be moved by the user's mouse)
    this.fixed = bodyConfiguration.fixed; // @public (read-only)
    this.color = color; // @public (read-only)
    this.highlight = highlight; // @public (read-only)
    this.name = name; // @public (read-only)

    // @public (read-only) - passed to visual labels, must be translatable
    this.labelString = LABEL_MAP[ this.name ];
    assert && assert( this.labelString, 'no label found for body with identifier ' + this.name );

    assert && assert( renderer !== null );

    // Function that creates a Node for this Body. This is in the model so we can associate the graphical
    // representation directly instead of later with conditional logic or map
    this.renderer = renderer; // @private

    // @private
    this.playButtonPressedProperty = parameterList.playButtonPressedProperty;
    var steppingProperty = parameterList.steppingProperty;
    var rewindingProperty = parameterList.rewindingProperty;

    this.labelAngle = labelAngle; // @public
    var changeRewindValueProperty = new DerivedProperty(
      [ this.playButtonPressedProperty, steppingProperty, rewindingProperty ],
      function( playButtonPressed, stepping, rewinding ) {
        return !playButtonPressed && !stepping && !rewinding;
      }
    );
    this.positionProperty = new RewindableProperty( changeRewindValueProperty, new Vector2( bodyConfiguration.x, bodyConfiguration.y ) ); // @public
    this.velocityProperty = new RewindableProperty( changeRewindValueProperty, new Vector2( bodyConfiguration.vx, bodyConfiguration.vy ) ); // @public
    this.forceProperty = new RewindableProperty( changeRewindValueProperty, new Vector2() ); // @public
    this.massProperty = new RewindableProperty( changeRewindValueProperty, bodyConfiguration.mass ); // @public
    this.collidedProperty = new RewindableProperty( changeRewindValueProperty, false ); // @public

    this.density = bodyConfiguration.mass / this.getVolume(); // @public

    // true if the user is currently controlling the position of the body with the mouse
    this.userControlled = false; // @public
    this.path = []; // @public - {Vector2[]} array of the points in the body's trail

    // @public - emitters for various events
    this.pointAddedEmitter = new Emitter();
    this.pointRemovedEmitter = new Emitter();
    this.clearedEmitter = new Emitter();
    this.userModifiedPositionEmitter = new Emitter();
    this.userModifiedVelocityEmitter = new Emitter();

    var self = this;
    this.collidedProperty.onValue( true, function() {
      self.clockTicksSinceExplosionProperty.set( 0 );
    } );
  }

  gravityAndOrbits.register( 'Body', Body );

  return inherit( PropertySet, Body, {

    /**
     * @public
     * @return {number}
     */
    getVolume: function() {
      return 4.0 / 3.0 * Math.PI * Math.pow( this.getRadius(), 3 );
    },

    /**
     * @public
     * @return {number}
     */
    getRadius: function() {
      return this.diameterProperty.get() / 2;
    },

    /**
     * Create an immutable representation of this body for use in the physics engine
     * use copy() for Vector2 so that the properties don't get mutated
     *
     * @public
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
     * Save the current state of the body by storing the values of all rewindable properties.  This should only
     * be called when the clock is paused.
     */
    saveBodyState: function() {
      assert && assert( !this.playButtonPressedProperty.get(), 'saveBodyState should only be called when sim is paused' );

      this.positionProperty.storeRewindValueNoNotify();
      this.velocityProperty.storeRewindValueNoNotify();
      this.forceProperty.storeRewindValueNoNotify();
      this.massProperty.storeRewindValueNoNotify();
      this.collidedProperty.storeRewindValueNoNotify();
    },

    /**
     * Take the updated BodyState from the physics engine and update the state of this body based on it.
     *
     * @public
     * @param {BodyState} bodyState
     */
    updateBodyStateFromModel: function( bodyState ) {
      if ( !this.collidedProperty.get() ) {
        if ( !this.fixed && !this.userControlled ) {
          this.positionProperty.set( bodyState.position );
          this.velocityProperty.set( bodyState.velocity );
        }
        this.accelerationProperty.set( bodyState.acceleration );
        this.forceProperty.set( bodyState.acceleration.multiplyScalar( bodyState.mass ) );
      }
    },

    /**
     * This method is called after all bodies have been updated by the physics engine (must be done as a batch),
     * so that the path can be updated
     *
     * @public
     */
    allBodiesUpdated: function() {

      // Only add to the path if the user isn't dragging it and if the body is not exploded
      // and the body is not fixed
      if ( !this.userControlled && !this.collidedProperty.get() && !this.fixed ) {
        this.addPathPoint();
      }
    },

    /**
     * Add a point to the collection of points that follow the trajectory of a moving body.
     * This also removes points when the path gets too long.
     *
     * @public
     */
    addPathPoint: function() {
      var pathPoint = this.positionProperty.get();
      this.path.push( pathPoint );
      this.pointAddedEmitter.emit2( pathPoint, this.name );
    },

    /**
     * Clear the whole path of points tracking the body's trajectory.
     *
     * @return {type}  description
     */
    clearPath: function() {
      this.path = [];
      this.pathLength = 0;
      this.clearedEmitter.emit1( this.name );
    },

    // @public
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
     * Create an image renderer for this body.
     *
     * @public
     * @return {BodyRenderer}
     */
    createRenderer: function( viewDiameter ) {
      return this.renderer( this, viewDiameter );
    },

    /**
     * Check to see if this body collides with another.
     *
     * @public
     * @param {Body} body
     * @return {boolean}
     */
    collidesWidth: function( body ) {
      var position1 = this.positionProperty.get();
      var position2 = body.positionProperty.get();

      // reuse tempVector to reduce Vector2 allocations
      tempVector.x = position1.x - position2.x;
      tempVector.y = position1.y - position2.y;

      var distance = tempVector.magnitude();
      var radiiSum = this.diameterProperty.get() / 2 + body.diameterProperty.get() / 2;
      return distance < radiiSum;
    },

    /**
     * Rewind all rewindable properties to their values in the last time step.
     *
     * @public
     */
    rewind: function() {
      this.positionProperty.rewind();
      this.velocityProperty.rewind();
      this.forceProperty.rewind();
      this.massProperty.rewind();
      this.collidedProperty.rewind();
      this.clearPath();
    },

    /**
     * Create a derived property to see if position, velocity, mass, or collided properties have changed.
     *
     * @public
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
     * @public
     * Unexplodes and returns objects to the stage
     */
    resetPositionAndVelocity: function() {
      this.positionProperty.reset();
      this.velocityProperty.reset();
    },

    /**
     * @public
     * @return {string}
     */
    toString: function() {
      return 'name = ' + this.name + ', mass = ' + this.massProperty.get();
    }

  } );
} );
