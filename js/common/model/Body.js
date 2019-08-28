// Copyright 2014-2019, University of Colorado Boulder

/**
 * Body is a single point mass in the Gravity and Orbits simulation, such as the Earth, Sun, Moon or Space Station.
 * This class also keeps track of body-related data such as the path.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BodyState = require( 'GRAVITY_AND_ORBITS/common/model/BodyState' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Emitter = require( 'AXON/Emitter' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsBodies = require( 'GRAVITY_AND_ORBITS/common/model/GravityAndOrbitsBodies' );
  const Property = require( 'AXON/Property' );
  const RewindableProperty = require( 'GRAVITY_AND_ORBITS/common/model/RewindableProperty' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  // strings
  const moonString = require( 'string!GRAVITY_AND_ORBITS/moon' );
  const planetString = require( 'string!GRAVITY_AND_ORBITS/planet' );
  const satelliteString = require( 'string!GRAVITY_AND_ORBITS/satellite' );
  const starString = require( 'string!GRAVITY_AND_ORBITS/star' );

  // constants
  // map the body identifier to the translatable label for the body
  // must be one of GravityAndOrbitsBodies
  const LABEL_MAP = {
    PLANET: planetString,
    SATELLITE: satelliteString,
    STAR: starString,
    MOON: moonString
  };

  // reduce Vector2 allocation by reusing this Vector2 in collidesWith computation
  const tempVector = new Vector2( 0, 0 );

  class Body {
    /**
     * Constructor for Body
     * @param {string} name - unqique name for the body, one of GravityAndOrbitsBodies, used for object identification
     * @param {BodyConfiguration} bodyConfiguration - collection of properties that define the body state
     * @param {Color} color
     * @param {Color} highlight
     * @param {function.<Body, number, BodyRenderer>} renderer - way to associate the graphical representation directly
     *                                                          instead of later with conditional logic or map
     * @param {number} labelAngle
     * @param {number} tickValue - default value for mass setting
     * @param {string} tickLabel - translatable label for the mass slider labeling the default value
     * @param {ModeListParameterList} parameterList - composition of Properties that determine body state
     * @param {Property.<ModelViewTransform2>} transformProperty
     * @param {Object} [options]
     */
    constructor( name, bodyConfiguration, color, highlight, renderer, labelAngle, tickValue, tickLabel, parameterList, transformProperty, options ) {

      options = _.extend( {
        pathLengthBuffer: 0, // a buffer to alter the path trace if necessary
        diameterScale: 1, // scale factor applied to the diameter
        massSettable: true, // can the mass of this body be set by the control panel?
        massReadoutBelow: true, // should the mass label appear below the body to prevent occlusion?
        orbitalCenter: new Vector2( 0, 0 ), // orbital center for the body
        maxPathLength: 1400000000, // max path length for the body in km (should only be used if the body is too close to the center)
        pathLengthLimit: 6000, // limit on the number of points in the path
        rotationPeriod: null // period of body rotation, in seconds - null rotation period will prevent rotation
      }, options );

      const diameter = ( bodyConfiguration.radius * 2 ) * options.diameterScale;

      this.accelerationProperty = new Vector2Property( new Vector2( 0, 0 ) );
      this.diameterProperty = new Property( diameter );
      this.clockTicksSinceExplosionProperty = new Property( 0 );
      this.boundsProperty = new Property( new Bounds2( 0, 0, 0, 0 ) );

      options = _.extend( {
        pathLengthBuffer: 0 // a buffer to alter the path trace if necessary
      }, options );
      this.pathLengthBuffer = options.pathLengthBuffer; // @public (read-only)

      this.massSettable = options.massSettable; // @public (read-only)

      // @public number of samples in the path before it starts erasing (fading out from the back)
      this.maxPathLength = 0;

      // @public - total length of the current path
      this.pathLength = 0;

      // @private - limit on the number of segments in the path
      this.pathLengthLimit = options.pathLengthLimit;

      // @public - total length of the current path in model coordinates
      this.modelPathLength = 0;

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

      // @public (read-only) - period of rotation for the body in seconds
      this.rotationPeriod = options.rotationPeriod;

      // @public (read-only) - passed to visual labels, must be translatable
      this.labelString = LABEL_MAP[ this.name ];
      assert && assert( this.labelString, 'no label found for body with identifier ' + this.name );

      assert && assert( renderer !== null );

      // Function that creates a Node for this Body. This is in the model so we can associate the graphical
      // representation directly instead of later with conditional logic or map
      this.renderer = renderer; // @private

      // @private
      this.playButtonPressedProperty = parameterList.playButtonPressedProperty;
      const steppingProperty = parameterList.steppingProperty;
      const rewindingProperty = parameterList.rewindingProperty;

      // @public - force freeze all changes to the rewind values for rewindable Property
      this.freezeRewindChangeProperty = new Property( false );

      this.labelAngle = labelAngle; // @public
      const changeRewindValueProperty = new DerivedProperty(
        [ this.playButtonPressedProperty, steppingProperty, rewindingProperty, this.freezeRewindChangeProperty ],
        ( playButtonPressed, stepping, rewinding, freezeRewind ) =>
          !playButtonPressed && !stepping && !rewinding && !freezeRewind
      );

      // rewindable properties - body states can be rewound, and these properties can have saved states to support this
      this.positionProperty = new RewindableProperty( changeRewindValueProperty, new Vector2( bodyConfiguration.x, bodyConfiguration.y ) ); // @public
      this.velocityProperty = new RewindableProperty( changeRewindValueProperty, new Vector2( bodyConfiguration.vx, bodyConfiguration.vy ) ); // @public
      this.forceProperty = new RewindableProperty( changeRewindValueProperty, new Vector2( 0, 0 ) ); // @public
      this.massProperty = new RewindableProperty( changeRewindValueProperty, bodyConfiguration.mass, { reentrant: true } ); // @public
      this.collidedProperty = new RewindableProperty( changeRewindValueProperty, false ); // @public
      this.rotationProperty = new RewindableProperty( changeRewindValueProperty, 0 ); // @public

      this.density = bodyConfiguration.mass / this.getVolume(); // @public

      // true if the user is currently controlling the position of the body with the mouse
      this.userControlled = false; // @public
      this.path = []; // @public - {Vector2[]} array of the points in the body's trail

      // @public - emitters for various events
      this.pointAddedEmitter = new Emitter( {
        parameters: [
          { valueType: Vector2 },
          { validValues: GravityAndOrbitsBodies.VALUES }
        ]
      } );
      this.pointRemovedEmitter = new Emitter( { parameters: [ { validValues: GravityAndOrbitsBodies.VALUES } ] } );
      this.clearedEmitter = new Emitter( { parameters: [ { validValues: GravityAndOrbitsBodies.VALUES } ] } );
      this.userModifiedPositionEmitter = new Emitter();
      this.userModifiedVelocityEmitter = new Emitter();

      this.collidedProperty.link( collided => {
        if ( collided ) {
          this.clockTicksSinceExplosionProperty.set( 0 );
        }
      } );

      const initialPosition = this.positionProperty.initialValue.minus( options.orbitalCenter );
      const distToCenter = initialPosition.magnitude;

      // determine the max path length for the body in model coordinates
      if ( distToCenter < 1000 ) {
        // if too close to the center, use this optional length
        this.maxPathLength = options.maxPathLength;
      }
      else {
        // max path length is ~0.85 of a full orbit
        this.maxPathLength = 0.85 * 2 * Math.PI * distToCenter + this.pathLengthBuffer;
      }
    }


    /**
     * @public
     * @returns {number}
     */
    getVolume() {
      return 4.0 / 3.0 * Math.PI * Math.pow( this.getRadius(), 3 );
    }

    /**
     * @public
     * @returns {number}
     */
    getRadius() {
      return this.diameterProperty.get() / 2;
    }

    /**
     * Create an immutable representation of this body for use in the physics engine
     * use copy() for Vector2 so that the properties don't get mutated
     *
     * @public
     * @returns {BodyState}
     */
    toBodyState() {
      // const a = this.accelerationProperty;
      return new BodyState(
        this.positionProperty.get().copy(),
        this.velocityProperty.get().copy(),
        this.accelerationProperty.get().copy(),
        this.massProperty.get(),
        this.collidedProperty.get(),
        this.rotationProperty.get(),
        this.rotationPeriod
      );
    }

    /**
     * Save the current state of the body by storing the values of all rewindable properties.  This should only
     * be called when the clock is paused.
     */
    saveBodyState() {
      assert && assert( !this.playButtonPressedProperty.get(), 'saveBodyState should only be called when sim is paused' );

      this.positionProperty.storeRewindValueNoNotify();
      this.velocityProperty.storeRewindValueNoNotify();
      this.forceProperty.storeRewindValueNoNotify();
      this.massProperty.storeRewindValueNoNotify();
      this.collidedProperty.storeRewindValueNoNotify();
    }

    /**
     * Take the updated BodyState from the physics engine and update the state of this body based on it.
     *
     * @public
     * @param {BodyState} bodyState
     */
    updateBodyStateFromModel( bodyState ) {
      if ( !this.collidedProperty.get() ) {
        if ( !this.fixed && !this.userControlled ) {
          this.positionProperty.set( bodyState.position );
          this.velocityProperty.set( bodyState.velocity );
        }
        this.accelerationProperty.value = bodyState.acceleration;
        this.forceProperty.set( bodyState.acceleration.multiplyScalar( bodyState.mass ) );
        this.rotationProperty.set( bodyState.rotation );
      }
    }

    /**
     * This method is called after all bodies have been updated by the physics engine (must be done as a batch),
     * so that the path can be updated
     *
     * @public
     */
    allBodiesUpdated() {

      // Only add to the path if the user isn't dragging it and if the body is not exploded
      // and the body is not fixed
      if ( !this.userControlled && !this.collidedProperty.get() && !this.fixed ) {
        this.addPathPoint();
      }
    }

    /**
     * Add a point to the collection of points that follow the trajectory of a moving body.
     * This also removes points when the path gets too long.
     *
     * @public
     */
    addPathPoint() {
      const pathPoint = this.positionProperty.get();
      this.path.push( pathPoint );
      this.pointAddedEmitter.emit( pathPoint, this.name );

      // add the length to the tracked path length
      if ( this.path.length > 2 ) {
        const difference = this.path[ this.path.length - 1 ].minus( this.path[ this.path.length - 2 ] );
        const addedMagnitude = difference.magnitude;

        this.modelPathLength += addedMagnitude;
      }

      // remvove points from the path as the path gets too long
      // if the path grows more than ~6000 points, start removing points
      while ( this.modelPathLength > this.maxPathLength || this.path.length > this.pathLengthLimit ) {
        const loss = this.path[ 1 ].minus( this.path[ 0 ] );
        const lossMagnitude = loss.magnitude;

        this.path.shift();
        this.pointRemovedEmitter.emit( this.name );

        this.modelPathLength -= lossMagnitude;
      }
    }

    /**
     * Clear the whole path of points tracking the body's trajectory.
     *
     * @returns {type}  description
     */
    clearPath() {
      this.path = [];
      this.pathLength = 0;
      this.modelPathLength = 0;
      this.clearedEmitter.emit( this.name );
    }

    // @public
    resetAll() {
      this.positionProperty.reset();
      this.velocityProperty.reset();
      this.accelerationProperty.reset();
      this.forceProperty.reset();
      this.massProperty.reset();
      this.diameterProperty.reset();
      this.collidedProperty.reset();
      this.clockTicksSinceExplosionProperty.reset();
      this.rotationProperty.reset();
      this.clearPath();
    }

    /**
     * Create an image renderer for this body.
     *
     * @public
     * @returns {BodyRenderer}
     */
    createRenderer( viewDiameter ) {
      return this.renderer( this, viewDiameter );
    }

    /**
     * Check to see if this body collides with another.
     *
     * @public
     * @param {Body} body
     * @returns {boolean}
     */
    collidesWidth( body ) {
      const position1 = this.positionProperty.get();
      const position2 = body.positionProperty.get();

      // reuse tempVector to reduce Vector2 allocations
      tempVector.x = position1.x - position2.x;
      tempVector.y = position1.y - position2.y;

      const distance = tempVector.magnitude;
      const radiiSum = this.diameterProperty.get() / 2 + body.diameterProperty.get() / 2;
      return distance < radiiSum;
    }

    /**
     * Rewind all rewindable properties to their values in the last time step.
     *
     * @public
     */
    rewind() {
      this.positionProperty.rewind();
      this.velocityProperty.rewind();
      this.forceProperty.rewind();
      this.massProperty.rewind();
      this.collidedProperty.rewind();
      this.rotationProperty.rewind();
      this.clearPath();
    }

    /**
     * Create a derived property to see if position, velocity, mass, or collided properties have changed.
     *
     * @public
     * @returns {DerivedProperty}
     */
    // REVIEW: what is this for, could it be optimized away?
    anyPropertyDifferent() {
      const properties = [ this.positionProperty.different(), this.velocityProperty.different(),
        this.massProperty.different(), this.collidedProperty.different() ];
      return new DerivedProperty( properties, function() {
        return _.some( arguments, _.identity );
      } );
    }

    /**
     * @public
     * Unexplodes and returns objects to the stage
     */
    resetPositionAndVelocity() {
      this.positionProperty.reset();
      this.velocityProperty.reset();
    }

    /**
     * @public
     * @returns {string}
     */
    toString() {
      return 'name = ' + this.name + ', mass = ' + this.massProperty.get();
    }
  }

  return gravityAndOrbits.register( 'Body', Body );
} );