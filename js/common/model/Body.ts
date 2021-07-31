// Copyright 2014-2021, University of Colorado Boulder
/**
 * Body is a single point mass in the Gravity and Orbits simulation, such as the Earth, Sun, Moon or Space Station.
 * This class also keeps track of body-related data such as the path.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import gravityAndOrbitsStrings from '../../gravityAndOrbitsStrings.js';
import BodyState from './BodyState.js';
import GravityAndOrbitsBodies from './GravityAndOrbitsBodies.js';
import RewindableProperty from './RewindableProperty.js';
import BodyConfiguration from './BodyConfiguration';
import Color from '../../../../scenery/js/util/Color';
import BodyRenderer from '../view/BodyRenderer';
import GravityAndOrbitsModel from './GravityAndOrbitsModel';
import Tandem from '../../../../tandem/js/Tandem';
import type {BodyType} from './GravityAndOrbitsBodies';

const moonString = gravityAndOrbitsStrings.moon;
const planetString = gravityAndOrbitsStrings.planet;
const satelliteString = gravityAndOrbitsStrings.satellite;
const starString = gravityAndOrbitsStrings.star;

// reduce Vector2 allocation by reusing this Vector2 in collidesWith computation
const tempVector = new Vector2( 0, 0 );

class Body extends PhetioObject {
  readonly touchDilation: number;
  readonly previousPosition: Vector2;
  private readonly tandemName: string;
  private bodyNodeTandemName: string;
  private accelerationProperty: Vector2Property;
  diameterProperty: NumberProperty;
  private clockTicksSinceExplosionProperty: NumberProperty;
  private boundsProperty: Property;
  private massSettable: boolean;
  private readonly maxPathLength: number;
  private readonly pathLengthBuffer: number;
  pathLength: number;
  private readonly pathLengthLimit: number;
  private modelPathLength: number;
  private massReadoutBelow: boolean;
  private tickValue: number;
  private tickLabel: string;
  private color: Color;
  private highlight: Color;
  private readonly type: BodyType;
  private readonly rotationPeriod: number;
  private readonly labelString: string;
  private readonly renderer: ( arg0: Body, arg1: number ) => BodyRenderer;
  freezeRewindChangeProperty: Property;
  private labelAngle: number;
  private speedProperty: DerivedProperty;
  userControlled: boolean;
  private readonly isPlayingProperty: BooleanProperty;
  positionProperty: RewindableProperty;
  private readonly velocityProperty: RewindableProperty;
  private readonly forceProperty: RewindableProperty;
  private forceMagnitudeProperty: DerivedProperty;
  readonly massProperty: RewindableProperty;
  isCollidedProperty: RewindableProperty;
  rotationProperty: RewindableProperty;
  private isMovableProperty: BooleanProperty;
  private density: number;
  private path: any[];
  private pointAddedEmitter: Emitter;
  private pointRemovedEmitter: Emitter;
  private clearedEmitter: Emitter;
  userModifiedPositionEmitter: Emitter;
  private userModifiedVelocityEmitter: Emitter;
  static BodyIO: IOType;

  /**
   * @param {GravityAndOrbitsBodies} type - one of GravityAndOrbitsBodies, used for object identification
   * @param {BodyConfiguration} bodyConfiguration - collection of properties that define the body state
   * @param {Color} color
   * @param {Color} highlight
   * @param {function(Body, number):BodyRenderer} renderer - way to associate the graphical representation directly
   *                                                          instead of later with conditional logic or map
   * @param {number} labelAngle
   * @param {number} tickValue - default value for mass setting
   * @param {string} tickLabel - translatable label for the mass slider labeling the default value
   * @param {GravityAndOrbitsModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( type: BodyType, bodyConfiguration: BodyConfiguration, color: Color, highlight: Color, renderer: ( arg0: Body, arg1: number ) => BodyRenderer, labelAngle: number, tickValue: number, tickLabel: string, model: GravityAndOrbitsModel,
               tandem: Tandem, options: any ) {

    options = merge( {
      pathLengthBuffer: 0, // a buffer to alter the path trace if necessary
      diameterScale: 1, // scale factor applied to the diameter
      massSettable: true, // can the mass of this body be set by the control panel?
      massReadoutBelow: true, // should the mass label appear below the body to prevent occlusion?
      orbitalCenter: new Vector2( 0, 0 ), // orbital center for the body
      maxPathLength: 1400000000, // max path length for the body in km (should only be used if the body is too close to the center)
      pathLengthLimit: 6000, // limit on the number of points in the path
      rotationPeriod: null, // period of body rotation, in seconds - null rotation period will prevent rotation
      phetioType: Body.BodyIO,
      touchDilation: 15,
      tandem: tandem
    }, options );

    super( options );

    // indicates how much the touch radius should be expanded in any views
    this.touchDilation = options.touchDilation;

    // Keep track of the time at the beginning of a time step, for interpolation
    this.previousPosition = new Vector2( 0, 0 );

    const diameter = ( bodyConfiguration.radius * 2 ) * options.diameterScale;

    this.tandemName = tandem.name;

    // @public (read-only) {string}
    this.bodyNodeTandemName = `${tandem.name}Node`;

    this.accelerationProperty = new Vector2Property( new Vector2( 0, 0 ) );
    this.diameterProperty = new NumberProperty( diameter, {
      tandem: tandem.createTandem( 'diameterProperty' ),
      units: 'm',
      phetioDocumentation: 'The distance across the body',
      phetioReadOnly: true
    } );

    this.clockTicksSinceExplosionProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'clockTicksSinceExplosionProperty' ),
      phetioDocumentation: 'for internal PhET use only',
      phetioReadOnly: true
    } );
    this.boundsProperty = new Property( new Bounds2( 0, 0, 0, 0 ) );

    options = merge( {
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

    this.color = color; // @public (read-only)
    this.highlight = highlight; // @public (read-only)
    this.type = type; // @public (read-only)

    // @public (read-only) - period of rotation for the body in seconds
    this.rotationPeriod = options.rotationPeriod;

    // @public (read-only) - passed to visual labels, must be translatable
    this.labelString = this.type === 'planet' ? planetString :
                       this.type === 'satellite' ? satelliteString :
                       this.type === 'star' ? starString :
                       this.type === 'moon' ? moonString :
                       null;
    assert && assert( this.labelString, `no label found for body with identifier ${this.type}` );

    assert && assert( renderer !== null );

    // Function that creates a Node for this Body. This is in the model so we can associate the graphical
    // representation directly instead of later with conditional logic or map
    this.renderer = renderer; // @private

    // @private
    this.isPlayingProperty = model.isPlayingProperty;
    const steppingProperty = model.steppingProperty;
    const rewindingProperty = model.rewindingProperty;

    // @public - force freeze all changes to the rewind values for rewindable Property
    this.freezeRewindChangeProperty = new Property( false );

    this.labelAngle = labelAngle; // @public
    const changeRewindValueProperty = new DerivedProperty( [
        this.isPlayingProperty,
        steppingProperty,
        rewindingProperty,
        this.freezeRewindChangeProperty
      ], ( playButtonPressed, stepping, rewinding, freezeRewind ) =>
        !playButtonPressed && !stepping && !rewinding && !freezeRewind
    );

    // rewindable properties - body states can be rewound, and these properties can have saved states to support this

    // @public
    this.positionProperty = new RewindableProperty( changeRewindValueProperty, new Vector2( bodyConfiguration.x, bodyConfiguration.y ), {
      phetioType: RewindableProperty.RewindablePropertyIO( Vector2.Vector2IO ),
      tandem: tandem.createTandem( 'positionProperty' ),
      units: 'm',
      phetioHighFrequency: true,
      phetioDocumentation: 'The position of the body'
    } );

    // @public
    this.velocityProperty = new RewindableProperty( changeRewindValueProperty, new Vector2( bodyConfiguration.vx, bodyConfiguration.vy ), {
      phetioType: RewindableProperty.RewindablePropertyIO( Vector2.Vector2IO ),
      tandem: tandem.createTandem( 'velocityProperty' ),
      units: 'm/s',
      phetioHighFrequency: true,
      phetioDocumentation: 'The absolute speed and direction of motion of the body'
    } );

    // @public
    this.speedProperty = new DerivedProperty( [ this.velocityProperty ], velocity => velocity.magnitude, {
      phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
      tandem: tandem.createTandem( 'speedProperty' ),
      units: 'm/s',
      phetioHighFrequency: true,
      phetioDocumentation: 'The absolute speed of the body'
    } );

    // @public
    this.forceProperty = new RewindableProperty( changeRewindValueProperty, new Vector2( 0, 0 ), {
      phetioDocumentation: 'The net force of gravity exerted on this body by other bodies',
      phetioType: RewindableProperty.RewindablePropertyIO( Vector2.Vector2IO ),
      tandem: tandem.createTandem( 'forceProperty' ),
      phetioHighFrequency: true,
      units: 'N',
      phetioReadOnly: true
    } );

    // @private (only used for PhET-iO)
    this.forceMagnitudeProperty = new DerivedProperty( [ this.forceProperty ], force => force.magnitude, {
      phetioDocumentation: 'The magnitude of the net force on this body by other bodies',
      phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
      tandem: tandem.createTandem( 'forceMagnitudeProperty' ),
      phetioHighFrequency: true,
      units: 'N'
    } );

    // @public
    this.massProperty = new RewindableProperty( changeRewindValueProperty, bodyConfiguration.mass, {
      tandem: tandem.createTandem( 'massProperty' ),
      phetioType: RewindableProperty.RewindablePropertyIO( NumberIO ),
      units: 'kg',
      phetioDocumentation: 'The mass of the body',
      phetioStudioControl: false
    } );

    // @public
    this.isCollidedProperty = new RewindableProperty( changeRewindValueProperty, false, {
      tandem: tandem.createTandem( 'isCollidedProperty' ),
      phetioType: RewindableProperty.RewindablePropertyIO( BooleanIO ),
      phetioReadOnly: true,
      phetioDocumentation: 'True if the body has collided with another body'
    } );

    // @public
    this.rotationProperty = new RewindableProperty( changeRewindValueProperty, 0, {
      tandem: tandem.createTandem( 'rotationProperty' ),
      phetioType: RewindableProperty.RewindablePropertyIO( NumberIO ),
      units: 'radians',
      phetioHighFrequency: true,
      phetioDocumentation: 'The rotation of the body about its own origin',
      phetioStudioControl: false
    } );

    // @public (read-only)
    this.isMovableProperty = new BooleanProperty( bodyConfiguration.isMovable, {
      tandem: tandem.createTandem( 'isMovableProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'If true, the body can move during the physics update.'
    } );

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

    this.isCollidedProperty.link( collided => {
      if ( collided && !phet.joist.sim.isSettingPhetioStateProperty.value ) {
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
   * @public (phet-io)
   */
  toStateObject() {
    return {
      pathLength: this.pathLength,
      modelPathLength: this.modelPathLength,
      path: ArrayIO( Vector2.Vector2IO ).toStateObject( this.path )
    };
  }

  /**
   * @param stateObject
   * @public (phet-io)
   */
  setStateObject( stateObject ) {
    this.pathLength = stateObject.pathLength;
    this.modelPathLength = stateObject.modelPathLength;
    this.path = ArrayIO( Vector2.Vector2IO ).fromStateObject( stateObject.path );
    this.clearedEmitter.emit( this.type );
    this.path.forEach( pathPoint => this.pointAddedEmitter.emit( pathPoint, this.type ) );
  }

  /**
   * Create an immutable representation of this body for use in the physics engine
   * use copy() for Vector2 so that the properties don't get mutated
   *
   * @public
   * @returns {BodyState}
   */
  toBodyState() {
    return new BodyState(
      this,
      this.positionProperty.get().copy(),
      this.velocityProperty.get().copy(),
      this.accelerationProperty.get().copy(),
      this.massProperty.get(),
      this.isCollidedProperty.get(),
      this.rotationProperty.get(),
      this.rotationPeriod
    );
  }

  /**
   * Save the current state of the body by storing the values of all rewindable properties.  This should only
   * be called when the clock is paused.
   * @public
   */
  saveBodyState() {
    this.positionProperty.storeRewindValueNoNotify();
    this.velocityProperty.storeRewindValueNoNotify();
    this.forceProperty.storeRewindValueNoNotify();
    this.massProperty.storeRewindValueNoNotify();
    this.isCollidedProperty.storeRewindValueNoNotify();
  }

  /**
   * Take the updated BodyState from the physics engine and update the state of this body based on it.
   *
   * @public
   * @param {BodyState} bodyState
   */
  updateBodyStateFromModel( bodyState ) {
    if ( !this.isCollidedProperty.value ) {
      if ( this.isMovableProperty.value && !this.userControlled ) {
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
  modelStepped() {

    // Only add to the path if the user isn't dragging it and if the body is not exploded and the body is movable
    if ( !this.userControlled && !this.isCollidedProperty.get() && this.isMovableProperty.value ) {
      this.addPathPoint();
    }
  }

  /**
   * Add a point to the collection of points that follow the trajectory of a moving body.
   * This also removes points when the path gets too long.
   *
   * @private
   */
  addPathPoint() {
    const pathPoint = this.positionProperty.get();
    this.path.push( pathPoint );
    this.pointAddedEmitter.emit( pathPoint, this.type );

    // add the length to the tracked path length
    if ( this.path.length > 2 ) {
      const difference = this.path[ this.path.length - 1 ].minus( this.path[ this.path.length - 2 ] );
      const addedMagnitude = difference.magnitude;

      this.modelPathLength += addedMagnitude;
    }

    // remove points from the path as the path gets too long
    // if the path grows more than ~6000 points, start removing points
    while ( this.modelPathLength > this.maxPathLength || this.path.length > this.pathLengthLimit ) {
      const loss = this.path[ 1 ].minus( this.path[ 0 ] );
      const lossMagnitude = loss.magnitude;

      this.path.shift();
      this.pointRemovedEmitter.emit( this.type );

      this.modelPathLength -= lossMagnitude;
    }
  }

  /**
   * Clear the whole path of points tracking the body's trajectory.
   * @public
   */
  clearPath() {
    this.path = [];
    this.pathLength = 0;
    this.modelPathLength = 0;
    this.clearedEmitter.emit( this.type );
  }

  // @public
  resetAll() {
    this.positionProperty.reset();
    this.velocityProperty.reset();
    this.accelerationProperty.reset();
    this.forceProperty.reset();
    this.massProperty.reset();
    this.diameterProperty.reset();
    this.isCollidedProperty.reset();
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
   * Keep track of the time at the beginning of a time step, for interpolation
   * @public
   */
  storePreviousPosition() {
    this.previousPosition.x = this.positionProperty.value.x;
    this.previousPosition.y = this.positionProperty.value.y;
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
    this.isCollidedProperty.rewind();
    this.rotationProperty.rewind();
    this.clearPath();
  }

  /**
   * Returns the Properties which, when changed, enable the rewind button.
   * @returns {Property[]}
   * @public
   */
  getRewindableProperties() {
    return [
      this.positionProperty,
      this.velocityProperty,
      this.massProperty,
      this.isCollidedProperty
    ];
  }

  // @public
  resetPositionAndVelocity() {
    this.positionProperty.reset();
    this.velocityProperty.reset();
  }

  /**
   * @public
   * @returns {string}
   */
  toString() {
    return `name = ${this.type}, mass = ${this.massProperty.get()}`;
  }
}

const BodyIO = new IOType( 'BodyIO', {
  valueType: Body,
  documentation: 'Represents a physical body in the simulation',
  toStateObject: body => body.toStateObject(),
  applyState: ( body, stateObject ) => body.setStateObject( stateObject ),
  stateSchema: {
    pathLength: NumberIO,
    modelPathLength: NumberIO,
    path: ArrayIO( Vector2.Vector2IO )
  }
} );

Body.BodyIO = BodyIO;

gravityAndOrbits.register( 'Body', Body );
export default Body;