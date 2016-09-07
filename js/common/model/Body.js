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

  // reduce Vector2 allocation by reusing this Vector2 in collidesWith computation
  var tempVector = new Vector2();

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
   * @param {function.<Body, number, BodyRenderer>} renderer - way to associate the graphical representation directly
   *                                                          instead of later with conditional logic or map
   * @param {number} labelAngle
   * @param {boolean} massSettable
   * @param {number} maxPathLength
   * @param {boolean} massReadoutBelow
   * @param {number} tickValue
   * @param {string} tickLabel
   * @param {Property.<boolean>} playButtonPressedProperty
   * @param {Property.<boolean>} steppingProperty
   * @param {Property.<boolean>} rewindingProperty
   * @param {boolean} fixed
   * @param {object} [options]
   * @constructor
   */
  function Body( name, x, y, diameter, vx, vy, mass, color, highlight, renderer,
                 labelAngle, massSettable, maxPathLength, massReadoutBelow, tickValue, tickLabel,
                 playButtonPressedProperty, steppingProperty, rewindingProperty, fixed, options ) {

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

    this.massSettable = massSettable; // @public (read-only)

    // @public number of samples in the path before it starts erasing (fading out from the back)
    this.maxPathLength = 0;

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
    var changeRewindValueProperty = new DerivedProperty(
      [ playButtonPressedProperty, steppingProperty, rewindingProperty ],
      function( playButtonPressed, stepping, rewinding ) {
        return !playButtonPressed && !stepping && !rewinding;
      }
    );
    this.positionProperty = new RewindableProperty( changeRewindValueProperty, new Vector2( x, y ) ); // @public
    this.velocityProperty = new RewindableProperty( changeRewindValueProperty, new Vector2( vx, vy ) ); // @public
    this.forceProperty = new RewindableProperty( changeRewindValueProperty, new Vector2() ); // @public
    this.massProperty = new RewindableProperty( changeRewindValueProperty, mass ); // @public
    this.collidedProperty = new RewindableProperty( changeRewindValueProperty, false ); // @public

    this.density = mass / this.getVolume(); // @public

    // true if the user is currently controlling the position of the body with the mouse
    this.userControlled = false; // @public
    this.path = []; // @public - {Vector2[]} array of the points in the body's trail

    // @public - emitters for various events
    this.pointAddedEmitter = new Emitter();
    this.pointRemovedEmitter = new Emitter();
    this.clearedEmitter = new Emitter();
    this.userModifiedPositionEmitter = new Emitter();
    this.userModifiedVelocityEmitter = new Emitter();

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
     * @public
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
     * @public
     * Take the updated BodyState from the physics engine and update the state of this body based on it.
     *
     * @param {BodyState} bodyState
     */
    updateBodyStateFromModel: function( bodyState ) {
      if ( this.collidedProperty.get() ) {
        this.clockTicksSinceExplosionProperty.value += 1;
      }
      else {
        if ( !this.fixed && !this.userControlled ) {
          this.positionProperty.set( bodyState.position );
          this.velocityProperty.set( bodyState.velocity );
        }
        this.accelerationProperty.set( bodyState.acceleration );
        this.forceProperty.set( bodyState.acceleration.multiplyScalar( bodyState.mass ) );
      }
    },

    /**
     * @public
     * This method is called after all bodies have been updated by the physics engine (must be done as a batch),
     * so that the path can be updated
     */
    allBodiesUpdated: function() {

      // Only add to the path if the user isn't dragging it and if the body is not exploded
      if ( !this.userControlled && !this.collidedProperty.get() ) {
        this.addPathPoint();
      }
    },

    // @public
    addPathPoint: function() {

      // start removing data after 2 orbits of the default system
      // account for the point that will be added
      while ( this.path.length > this.maxPathLength ) {
        this.path.shift();
        this.pointRemovedEmitter.emit();
      }
      var pathPoint = this.positionProperty.get();
      this.path.push( pathPoint );
      this.pointAddedEmitter.emit1( pathPoint );
      // this.trigger1( GravityAndOrbitsConstants.POINT_ADDED, pathPoint );
    },

    // @public
    clearPath: function() {
      this.path = [];
      this.clearedEmitter.emit();
      // this.trigger0( GravityAndOrbitsConstants.CLEARED );
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
     * @public
     * @return {BodyRenderer}
     */
    createRenderer: function( viewDiameter ) {
      return this.renderer( this, viewDiameter );
    },

    /**
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

    // @public
    rewind: function() {
      this.positionProperty.rewind();
      this.velocityProperty.rewind();
      this.forceProperty.rewind();
      this.massProperty.rewind();
      this.collidedProperty.rewind();
      this.clearPath();
    },

    /**
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
     * @public
     * Unexplodes and returns objects to the stage
     */
    doReturnBody: function() {
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
