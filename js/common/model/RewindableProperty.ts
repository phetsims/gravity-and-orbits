// Copyright 2014-2021, University of Colorado Boulder

/**
 * This is a property that can be rewound, and when rewound it goes back to the value that was last set by
 * storeRewindValueNoNotify. In this sim, the rewind value is stored at the initial configuration of a mode, or when a
 * user modifies the position of a body.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';

type RewindablePropertyOptions = {

  // TODO: Move these to PhetioObjectOptions, see https://github.com/phetsims/gravity-and-orbits/issues/405
  tandem: Tandem,
  phetioType?: IOType;
  units?: string;
  phetioHighFrequency?: boolean;
  phetioDocumentation?: string;
  phetioStudioControl?: boolean;
  phetioReadOnly?: boolean;
};

class RewindableProperty<T> extends Property<T> {
  rewindValue: T;
  private changeRewindValueProperty: Property<T>;
  readonly differentProperty: BooleanProperty;
  static RewindablePropertyIO: ( parameterType: any ) => IOType;

  /**
   * @param {Property} changeRewindValueProperty - whether the newly set value should be captured as a rewindable point
   * @param {T} value
   * @param {Object} [options]
   * @constructor
   */
  constructor( changeRewindValueProperty: Property<T>, value: T, options: RewindablePropertyOptions = {
    tandem: Tandem.OPTIONAL
  } ) {
    super( value, options );

    // @public - the "initial condition" the property can be rewound to, different than the overall "reset" value
    this.rewindValue = value;

    // @private - see above
    this.changeRewindValueProperty = changeRewindValueProperty;

    // @public (read-only) true when the rewind point value is different than the property's current value
    this.differentProperty = new BooleanProperty( !this.equalsRewindValue(), {
      tandem: options.tandem.createTandem( 'differentProperty' ),
      phetioFeatured: false,
      phetioReadOnly: true,
      phetioDocumentation: 'for internal PhET use only'
    } );
  }

  /**
   * Reset both the value and the rewind value.
   *
   * @public
   * @override
   */
  reset() {
    super.reset();

    // reset the rewind value as well
    this.rewindValue = this.value;
  }

  /**
   * @public
   * @override
   */
  set( value: T ) {
    super.set( value );

    // If the user changed the initial conditions (as opposed to the state changing through model stepping),
    // then store the new initial conditions, which can be rewound to
    if ( this.changeRewindValueProperty.get() ) {
      this.storeRewindValueNoNotify();
    }
    this.differentProperty.set( !this.equalsRewindValue() );

    return this;
  }

  /**
   * Store the new value as the initial condition which can be rewound to. We have to skip notifications sometimes
   * or the wrong initial conditions get stored.
   * @public
   */
  storeRewindValueNoNotify() {
    this.rewindValue = this.get();
    this.differentProperty.set( !this.equalsRewindValue() );
  }

  /**
   * Check for equality between current and rewind values.  Supported types are number, boolean
   * and Vector2.
   *
   * @public
   * @returns {boolean}
   */
  equalsRewindValue() {

    // if an object, must call unique function to check for equality
    // @ts-ignore
    if ( this.rewindValue.equals ) {
      // @ts-ignore
      return this.rewindValue.equals( this.get() );
    }
    else {
      return this.rewindValue === this.get();
    }
  }

  /**
   * Set the value to match the last recorded rewindValue
   * @public
   */
  rewind() {
    this.set( this.rewindValue );
  }
}


// {Map.<IOType, IOType>} - Cache each parameterized RewindablePropertyIO so that it is only created once
const cache = new Map();

/**
 * An observable Property that triggers notifications when the value changes.
 * This caching implementation should be kept in sync with the other parametric IO Type caching implementations.
 * @param {IOType} parameterType
 * @returns {IOType}
 */
RewindableProperty.RewindablePropertyIO = ( parameterType ) => {
  assert && assert( parameterType, 'RewindablePropertyIO needs parameterType' );

  const cacheKey = parameterType;

  if ( !cache.has( cacheKey ) ) {

    const PropertyIOImpl = Property.PropertyIO( parameterType );
    cache.set( cacheKey, new IOType( `RewindablePropertyIO<${parameterType.typeName}>`, {
        valueType: RewindableProperty,
        parameterTypes: [ parameterType ],
        documentation: 'Observable values that send out notifications when the value changes. This differs from the ' +
                       'traditional listener pattern in that added listeners also receive a callback with the current value ' +
                       'when the listeners are registered. This is a widely-used pattern in PhET-iO simulations.',
        supertype: PropertyIOImpl,
      // @ts-ignore
        toStateObject: ( property: RewindableProperty ) => {
          const stateObject = PropertyIOImpl.toStateObject( property );
          stateObject.rewindValue = parameterType.toStateObject( property.rewindValue );
          return stateObject;
        },
      // @ts-ignore
        applyState: ( property: RewindableProperty, stateObject: { rewindValue: any; } ) => {
          PropertyIOImpl.applyState( property, stateObject );
          property.rewindValue = parameterType.fromStateObject( stateObject.rewindValue );
        },
        stateSchema: {
          rewindValue: parameterType
        }
      } )
    );
  }

  return cache.get( cacheKey );
}

gravityAndOrbits.register( 'RewindableProperty', RewindableProperty );
export default RewindableProperty;