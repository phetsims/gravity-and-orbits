// Copyright 2014-2022, University of Colorado Boulder

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
import merge from '../../../../phet-core/js/merge.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

type RewindablePropertyOptions = {
  units?: string;
  tandem: Tandem;
} & PhetioObjectOptions;

class RewindableProperty<T> extends Property<T> {
  private rewindValue: T;
  private changeRewindValueProperty: IReadOnlyProperty<boolean>;
  public readonly differentProperty: BooleanProperty;

  public static RewindablePropertyIO: ( parameterType: IOType ) => IOType;

  /**
   * @param changeRewindValueProperty - whether the newly set value should be captured as a rewindable point
   * @param value
   * @param [providedOptions]
   */
  public constructor( changeRewindValueProperty: IReadOnlyProperty<boolean>, value: T, providedOptions?: RewindablePropertyOptions ) {

    const options = merge( {
      tandem: Tandem.OPTIONAL
    }, providedOptions ) as Pick<RewindablePropertyOptions, 'tandem'>;

    super( value, options );

    // the "initial condition" the property can be rewound to, different than the overall "reset" value
    this.rewindValue = value;

    this.changeRewindValueProperty = changeRewindValueProperty;

    // (read-only) true when the rewind point value is different than the property's current value
    this.differentProperty = new BooleanProperty( !this.equalsRewindValue(), {
      tandem: options.tandem.createTandem( 'differentProperty' ),
      phetioFeatured: false,
      phetioReadOnly: true,
      phetioDocumentation: 'for internal PhET use only'
    } );
  }

  /**
   * Reset both the value and the rewind value.
   */
  public override reset(): void {
    super.reset();

    // reset the rewind value as well
    this.rewindValue = this.value;
  }

  public override set( value: T ): this {
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
   */
  public storeRewindValueNoNotify(): void {
    this.rewindValue = this.get();
    this.differentProperty.set( !this.equalsRewindValue() );
  }

  /**
   * Check for equality between current and rewind values.  Supported types are number, boolean
   * and Vector2.
   */
  public equalsRewindValue(): boolean {

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
   */
  public rewind(): void {
    this.set( this.rewindValue );
  }
}


// {Map.<IOType, IOType>} - Cache each parameterized RewindablePropertyIO so that it is only created once
const cache = new Map();

/**
 * An observable Property that triggers notifications when the value changes.
 * This caching implementation should be kept in sync with the other parametric IO Type caching implementations.
 */
RewindableProperty.RewindablePropertyIO = ( parameterType: IOType ) => {
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
        applyState: ( property: RewindableProperty, stateObject: { rewindValue: unknown } ) => {
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
};

gravityAndOrbits.register( 'RewindableProperty', RewindableProperty );
export default RewindableProperty;