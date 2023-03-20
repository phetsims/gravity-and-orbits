// Copyright 2014-2023, University of Colorado Boulder
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
import Vector2, { Vector2StateObject } from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsStrings from '../../GravityAndOrbitsStrings.js';
import BodyState from './BodyState.js';
import BodyTypeEnum from './BodyTypeEnum.js';
import RewindableProperty from './RewindableProperty.js';
import BodyConfiguration from './BodyConfiguration.js';
import { Color } from '../../../../scenery/js/imports.js';

// Used as a type annotation only
// eslint-disable-next-line no-view-imported-from-model
import BodyRenderer from '../view/BodyRenderer.js';
import GravityAndOrbitsModel from './GravityAndOrbitsModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import TEmitter from '../../../../axon/js/TEmitter.js';

// reduce Vector2 allocation by reusing this Vector2 in collidesWith computation
const tempVector = new Vector2( 0, 0 );

type SelfOptions = {
  pathLengthBuffer?: number;
  diameterScale?: number;
  massSettable?: boolean;
  massReadoutBelow?: boolean;
  orbitalCenter?: Vector2;
  maxPathLength?: number;
  pathLengthLimit?: number;
  rotationPeriod?: null | number;
  touchDilation?: number;
};

type BodyOptions = SelfOptions & PhetioObjectOptions;

export default class Body extends PhetioObject {

  public pathLength: number;
  public path: Vector2[];
  public userControlled: boolean;
  public readonly clockTicksSinceExplosionProperty: NumberProperty;

  public readonly density: number;
  public readonly touchDilation: number;
  private readonly previousPosition: Vector2;
  public readonly type: BodyTypeEnum;
  public readonly labelStringProperty: TReadOnlyProperty<string> | null;
  public readonly massProperty: RewindableProperty<number>;
  public readonly velocityProperty: RewindableProperty<Vector2>;
  public readonly diameterProperty: NumberProperty;
  public readonly freezeRewindChangeProperty: Property<boolean>;
  public readonly positionProperty: RewindableProperty<Vector2>;
  public readonly isCollidedProperty: RewindableProperty<boolean>;
  public readonly rotationProperty: RewindableProperty<number>;
  public readonly pointAddedEmitter: TEmitter<[ Vector2, BodyTypeEnum ]>;
  public readonly pointRemovedEmitter: TEmitter<[ BodyTypeEnum ]>;
  public readonly clearedEmitter: TEmitter<[ BodyTypeEnum ]>;
  public readonly userModifiedPositionEmitter: TEmitter;
  public readonly userModifiedVelocityEmitter: TEmitter;
  public readonly tandemName: string;
  public readonly tickValue: number;
  public readonly tickLabelProperty: TReadOnlyProperty<string>;
  public readonly massReadoutBelow: boolean;
  public readonly bodyNodeTandemName: string;
  private readonly accelerationProperty: Vector2Property;
  public readonly boundsProperty: Property<Bounds2>;
  public readonly massSettable: boolean;
  public readonly maxPathLength: number;
  private readonly pathLengthBuffer: number;
  private readonly pathLengthLimit: number;
  private modelPathLength: number;
  public readonly color: Color;
  private readonly highlight: Color;
  private readonly rotationPeriod: number | null;
  private readonly renderer: ( arg0: Body, arg1: number ) => BodyRenderer;
  public readonly labelAngle: number;
  private readonly speedProperty: TReadOnlyProperty<number>;
  public readonly forceProperty: RewindableProperty<Vector2>;
  private readonly forceMagnitudeProperty: TReadOnlyProperty<number>;
  public readonly isMovableProperty: BooleanProperty;

  public static readonly BodyIO = new IOType<Body, BodyStateType>( 'BodyIO', {
    valueType: Body,
    documentation: 'Represents a physical body in the simulation',
    toStateObject: ( body: Body ) => body.toStateObject(),
    applyState: ( body: Body, stateObject: BodyStateType ) => body.setStateObject( stateObject ),
    stateSchema: {
      pathLength: NumberIO,
      modelPathLength: NumberIO,
      path: ArrayIO( Vector2.Vector2IO )
    }
  } );

  /**
   * @param type - used for object identification
   * @param bodyConfiguration - collection of properties that define the body state
   * @param color
   * @param highlight
   * @param renderer - way to associate the graphical representation directly
   *                                                          instead of later with conditional logic or map
   * @param labelAngle
   * @param tickValue - default value for mass setting
   * @param tickLabelProperty - translatable label for the mass slider labeling the default value
   * @param model
   * @param tandem
   * @param [providedOptions]
   */
  public constructor( type: BodyTypeEnum, bodyConfiguration: BodyConfiguration, color: Color, highlight: Color, renderer: ( arg0: Body, arg1: number ) => BodyRenderer, labelAngle: number, tickValue: number, tickLabelProperty: TReadOnlyProperty<string>, model: GravityAndOrbitsModel,
                      tandem: Tandem, providedOptions?: BodyOptions ) {

    const options = optionize<BodyOptions, SelfOptions, PhetioObjectOptions>()( {

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
    }, providedOptions );

    super( options );

    // indicates how much the touch radius should be expanded in any views
    this.touchDilation = options.touchDilation;

    // Keep track of the time at the beginning of a time step, for interpolation
    this.previousPosition = new Vector2( 0, 0 );

    const diameter = ( bodyConfiguration.radius * 2 ) * options.diameterScale;

    this.tandemName = tandem.name;

    // (read-only) {string}
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

    this.pathLengthBuffer = options.pathLengthBuffer; // (read-only)

    this.massSettable = options.massSettable; // (read-only)

    // number of samples in the path before it starts erasing (fading out from the back)
    this.maxPathLength = 0;

    // total length of the current path
    this.pathLength = 0;

    // limit on the number of segments in the path
    this.pathLengthLimit = options.pathLengthLimit;

    // total length of the current path in model coordinates
    this.modelPathLength = 0;

    // True if the mass readout should appear below the body (so that readouts don't overlap too much),
    // in the model for convenience since the body type determines where the mass readout should appear
    this.massReadoutBelow = options.massReadoutBelow; // (read-only)

    // value that this body's mass should be identified with, for 'planet' this will be the earth's mass
    this.tickValue = tickValue; // (read-only)

    // name associated with this body when it takes on the tickValue above, for 'planet' this will be "earth"
    this.tickLabelProperty = tickLabelProperty; // (read-only)

    this.color = color; // (read-only)
    this.highlight = highlight; // (read-only)
    this.type = type; // (read-only)

    // (read-only) - period of rotation for the body in seconds
    this.rotationPeriod = options.rotationPeriod;

    // (read-only) - passed to visual labels, must be translatable
    this.labelStringProperty = this.type === 'planet' ? GravityAndOrbitsStrings.planetStringProperty :
                               this.type === 'satellite' ? GravityAndOrbitsStrings.satelliteStringProperty :
                               this.type === 'star' ? GravityAndOrbitsStrings.starStringProperty :
                               this.type === 'moon' ? GravityAndOrbitsStrings.moonStringProperty :
                               null;
    assert && assert( this.labelStringProperty, `no label found for body with identifier ${this.type}` );

    assert && assert( renderer !== null );

    // Function that creates a Node for this Body. This is in the model so we can associate the graphical
    // representation directly instead of later with conditional logic or map
    this.renderer = renderer;

    // force freeze all changes to the rewind values for rewindable Property
    this.freezeRewindChangeProperty = new Property<boolean>( false );

    this.labelAngle = labelAngle;

    const changeRewindValueProperty = new DerivedProperty( [
        model.changeRewindValueProperty,
        this.freezeRewindChangeProperty
      ], ( modelChangeRewindProperty, freezeRewind ) =>
        modelChangeRewindProperty && !freezeRewind
    );

    // rewindable properties - body states can be rewound, and these properties can have saved states to support this

    this.positionProperty = new RewindableProperty<Vector2>( changeRewindValueProperty, new Vector2( bodyConfiguration.x, bodyConfiguration.y ), {
      phetioValueType: Vector2.Vector2IO,
      tandem: tandem.createTandem( 'positionProperty' ),
      units: 'm',
      phetioHighFrequency: true,
      phetioDocumentation: 'The position of the body'
    } );

    this.velocityProperty = new RewindableProperty( changeRewindValueProperty, new Vector2( bodyConfiguration.vx, bodyConfiguration.vy ), {
      phetioValueType: Vector2.Vector2IO,
      tandem: tandem.createTandem( 'velocityProperty' ),
      units: 'm/s',
      phetioHighFrequency: true,
      phetioDocumentation: 'The absolute speed and direction of motion of the body'
    } );

    this.speedProperty = new DerivedProperty( [ this.velocityProperty ], velocity => velocity.magnitude, {
      phetioValueType: NumberIO,
      tandem: tandem.createTandem( 'speedProperty' ),
      units: 'm/s',
      phetioHighFrequency: true,
      phetioDocumentation: 'The absolute speed of the body'
    } );

    this.forceProperty = new RewindableProperty( changeRewindValueProperty, new Vector2( 0, 0 ), {
      phetioDocumentation: 'The net force of gravity exerted on this body by other bodies',
      phetioValueType: Vector2.Vector2IO,
      tandem: tandem.createTandem( 'forceProperty' ),
      phetioHighFrequency: true,
      units: 'N',
      phetioReadOnly: true
    } );

    this.forceMagnitudeProperty = new DerivedProperty( [ this.forceProperty ], force => force.magnitude, {
      phetioDocumentation: 'The magnitude of the net force on this body by other bodies',
      phetioValueType: NumberIO,
      tandem: tandem.createTandem( 'forceMagnitudeProperty' ),
      phetioHighFrequency: true,
      units: 'N'
    } );

    this.massProperty = new RewindableProperty( changeRewindValueProperty, bodyConfiguration.mass, {
      tandem: tandem.createTandem( 'massProperty' ),
      phetioValueType: NumberIO,
      units: 'kg',
      phetioDocumentation: 'The mass of the body'
    } );

    this.isCollidedProperty = new RewindableProperty<boolean>( changeRewindValueProperty, false, {
      tandem: tandem.createTandem( 'isCollidedProperty' ),
      phetioValueType: BooleanIO,
      phetioReadOnly: true,
      phetioDocumentation: 'True if the body has collided with another body'
    } );

    this.rotationProperty = new RewindableProperty<number>( changeRewindValueProperty, 0, {
      tandem: tandem.createTandem( 'rotationProperty' ),
      phetioValueType: NumberIO,
      units: 'radians',
      phetioHighFrequency: true,
      phetioDocumentation: 'The rotation of the body about its own origin'
    } );

    // (read-only)
    this.isMovableProperty = new BooleanProperty( bodyConfiguration.isMovable, {
      tandem: tandem.createTandem( 'isMovableProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'If true, the body can move during the physics update.'
    } );

    this.density = bodyConfiguration.mass / this.getVolume();

    // true if the user is currently controlling the position of the body with the mouse
    this.userControlled = false;
    this.path = []; // {Vector2[]} array of the points in the body's trail

    // emitters for various events
    this.pointAddedEmitter = new Emitter<[ Vector2, BodyTypeEnum ]>( {
      parameters: [
        { valueType: Vector2 },
        { validValues: [ 'planet', 'satellite', 'star', 'moon' ] }
      ]
    } );
    this.pointRemovedEmitter = new Emitter( { parameters: [ { validValues: [ 'planet', 'satellite', 'star', 'moon' ] } ] } );
    this.clearedEmitter = new Emitter( { parameters: [ { validValues: [ 'planet', 'satellite', 'star', 'moon' ] } ] } );
    this.userModifiedPositionEmitter = new Emitter();
    this.userModifiedVelocityEmitter = new Emitter();

    this.isCollidedProperty.link( collided => {
      if ( collided ) {
        this.clockTicksSinceExplosionProperty.set( 0 );
      }
    } );

    assert && assert( this.positionProperty.initialValue, 'initial value should be truthy' );
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

  private getVolume(): number {
    return 4.0 / 3.0 * Math.PI * Math.pow( this.getRadius(), 3 );
  }

  private getRadius(): number {
    return this.diameterProperty.get() / 2;
  }

  /**
   * (phet-io)
   */
  public toStateObject(): BodyStateType {
    return {
      pathLength: this.pathLength,
      modelPathLength: this.modelPathLength,
      path: ArrayIO( Vector2.Vector2IO ).toStateObject( this.path )
    };
  }

  /**
   * (phet-io)
   */
  public setStateObject( stateObject: ReturnType<typeof Body.prototype.toStateObject> ): void {
    this.pathLength = stateObject.pathLength;
    this.modelPathLength = stateObject.modelPathLength;
    this.path = ArrayIO( Vector2.Vector2IO ).fromStateObject( stateObject.path );
    this.clearedEmitter.emit( this.type );
    this.path.forEach( pathPoint => this.pointAddedEmitter.emit( pathPoint, this.type ) );
  }

  /**
   * Create an immutable representation of this body for use in the physics engine
   * use copy() for Vector2 so that the properties don't get mutated
   */
  public toBodyState(): BodyState {
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
   */
  public saveBodyState(): void {
    this.positionProperty.storeRewindValueNoNotify();
    this.velocityProperty.storeRewindValueNoNotify();
    this.forceProperty.storeRewindValueNoNotify();
    this.massProperty.storeRewindValueNoNotify();
    this.isCollidedProperty.storeRewindValueNoNotify();
    this.rotationProperty.storeRewindValueNoNotify();
  }

  /**
   * Take the updated BodyState from the physics engine and update the state of this body based on it.
   */
  public updateBodyStateFromModel( bodyState: { position: Vector2; velocity: Vector2; acceleration: Vector2; mass: number; rotation: number } ): void {
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
   */
  public modelStepped(): void {

    // Only add to the path if the user isn't dragging it and if the body is not exploded and the body is movable
    if ( !this.userControlled && !this.isCollidedProperty.get() && this.isMovableProperty.value ) {
      this.addPathPoint();
    }
  }

  /**
   * Add a point to the collection of points that follow the trajectory of a moving body.
   * This also removes points when the path gets too long.
   */
  private addPathPoint(): void {
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
   */
  public clearPath(): void {
    this.path = [];
    this.pathLength = 0;
    this.modelPathLength = 0;
    this.clearedEmitter.emit( this.type );
  }

  public resetAll(): void {
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
   */
  public createRenderer( viewDiameter: number ): BodyRenderer {
    return this.renderer( this, viewDiameter );
  }

  /**
   * Keep track of the time at the beginning of a time step, for interpolation
   */
  public storePreviousPosition(): void {
    this.previousPosition.x = this.positionProperty.value.x;
    this.previousPosition.y = this.positionProperty.value.y;
  }

  /**
   * Check to see if this body collides with another.
   */
  public collidesWidth( body: Body ): boolean {
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
   */
  public rewind(): void {
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
   */
  public getRewindableProperties(): RewindableProperty<IntentionalAny>[] {
    return [
      this.positionProperty,
      this.velocityProperty,
      this.massProperty,
      this.isCollidedProperty
    ];
  }

  private resetPositionAndVelocity(): void {
    this.positionProperty.reset();
    this.velocityProperty.reset();
  }

  private override toString(): string {
    return `name = ${this.type}, mass = ${this.massProperty.get()}`;
  }
}

type BodyStateType = { pathLength: number; modelPathLength: number; path: Vector2StateObject[] };

gravityAndOrbits.register( 'Body', Body );
export type { BodyOptions };