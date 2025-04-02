// Copyright 2014-2024, University of Colorado Boulder

/**
 * This is a property that can be rewound, and when rewound it goes back to the value that was last set by
 * storeRewindValueNoNotify. In this sim, the rewind value is stored at the initial configuration of a mode, or when a
 * user modifies the position of a body.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property, { PropertyOptions } from '../../../../axon/js/Property.js';
import { ReadOnlyPropertyState } from '../../../../axon/js/ReadOnlyProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { Units } from '../../../../axon/js/units.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import IOTypeCache from '../../../../tandem/js/IOTypeCache.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType, { AnyIOType } from '../../../../tandem/js/types/IOType.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';

type RewindablePropertyOptions<T> = {
  units?: Units;
} & StrictOmit<PhetioObjectOptions, 'phetioType'> &
  PickRequired<PropertyOptions<T>, 'tandem'> &
  Pick<PropertyOptions<T>, 'phetioOuterType' | 'phetioValueType'>;

class RewindableProperty<T extends { equals: ( value: IntentionalAny ) => boolean } | number | boolean | string> extends Property<T> {
  private rewindValue: T;
  private readonly changeRewindValueProperty: TReadOnlyProperty<boolean>;
  public readonly differentProperty: BooleanProperty;

  /**
   * An observable Property that triggers notifications when the value changes.
   * This caching implementation should be kept in sync with the other parametric IOType caching implementations.
   */
  public static readonly RewindablePropertyIO = ( parameterType: AnyIOType ): AnyIOType => {
    assert && assert( parameterType, 'RewindablePropertyIO needs parameterType' );

    const cacheKey = parameterType;

    if ( !cache.has( cacheKey ) ) {

      const PropertyIOImpl = Property.PropertyIO( parameterType );
      cache.set( cacheKey, new IOType<IntentionalAny, IntentionalAny>( `RewindablePropertyIO<${parameterType.typeName}>`, {
          valueType: RewindableProperty,
          parameterTypes: [ parameterType ],
          documentation: 'Observable values that send out notifications when the value changes. This differs from the ' +
                         'traditional listener pattern in that added listeners also receive a callback with the current value ' +
                         'when the listeners are registered. This is a widely-used pattern in PhET-iO simulations.',
          supertype: PropertyIOImpl,
          toStateObject: ( property: RewindableProperty<IntentionalAny> ) => {
            return {
              ...PropertyIOImpl.toStateObject( property ), // eslint-disable-line phet/no-object-spread-on-non-literals
              rewindValue: parameterType.toStateObject( property.rewindValue )
            };
          },
          applyState: ( property: RewindableProperty<IntentionalAny>, stateObject: { rewindValue: unknown } & ReadOnlyPropertyState<IntentionalAny> ) => {
            PropertyIOImpl.applyState( property, stateObject );
            property.rewindValue = parameterType.fromStateObject( stateObject.rewindValue );

            property.updateDifferentProperty();
          },
          stateSchema: {
            rewindValue: parameterType
          }
        } )
      );
    }

    return cache.get( cacheKey )!;
  };

  /**
   * @param changeRewindValueProperty - whether the newly set value should be captured as a rewindable point
   * @param value
   * @param [providedOptions]
   */
  public constructor( changeRewindValueProperty: TReadOnlyProperty<boolean>, value: T, providedOptions?: RewindablePropertyOptions<T> ) {

    const options = combineOptions<RewindablePropertyOptions<T>>( {
      phetioOuterType: RewindableProperty.RewindablePropertyIO
    }, providedOptions );

    super( value, options );

    // the "initial condition" the property can be rewound to, different than the overall "reset" value
    this.rewindValue = value;

    this.changeRewindValueProperty = changeRewindValueProperty;

    // (read-only) true when the rewind point value is different than the property's current value
    this.differentProperty = new BooleanProperty( !this.equalsRewindValue(), {
      tandem: options.tandem?.createTandem( 'differentProperty' ),
      phetioFeatured: false,
      phetioReadOnly: true,
      phetioDocumentation: 'for internal PhET use only'
    } );

    this.link( () => {
      this.updateDifferentProperty();
    } );
  }

  /**
   * Reset both the value and the rewind value.
   */
  public override reset(): void {
    super.reset();

    // reset the rewind value as well
    this.rewindValue = this.value;
    this.updateDifferentProperty();
  }

  // Whenever the primary value or rewindValue changes, update whether they differ
  public updateDifferentProperty(): void {
    this.differentProperty.set( !this.equalsRewindValue() );
  }

  public override set( value: T ): this {
    super.set( value );

    // If the user changed the initial conditions (as opposed to the state changing through model stepping),
    // then store the new initial conditions, which can be rewound to
    if ( this.changeRewindValueProperty.get() ) {
      this.storeRewindValueNoNotify();
    }
    this.updateDifferentProperty();

    return this;
  }

  /**
   * Store the new value as the initial condition which can be rewound to. We have to skip notifications sometimes
   * or the wrong initial conditions get stored.
   */
  public storeRewindValueNoNotify(): void {
    this.rewindValue = this.get();
    this.updateDifferentProperty();
  }

  /**
   * Check for equality between current and rewind values.  Supported types are number, boolean
   * and Vector2.
   */
  public equalsRewindValue(): boolean {

    const rewindValue = this.rewindValue;

    // if an object, must call unique function to check for equality
    if ( typeof rewindValue !== 'number' && typeof rewindValue !== 'boolean' && typeof rewindValue !== 'string' ) {
      return rewindValue.equals( this.get() );
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
const cache = new IOTypeCache();

gravityAndOrbits.register( 'RewindableProperty', RewindableProperty );
export default RewindableProperty;