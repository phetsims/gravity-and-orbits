// Copyright 2020, University of Colorado Boulder

import PropertyIO from '../../../../axon/js/PropertyIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import RewindableProperty from './RewindableProperty.js';

/**
 * IO Type for RewindableProperty
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

// {Map.<cacheKey:function(new:ObjectIO), function(new:ObjectIO)>} - Cache each parameterized RewindablePropertyIO so that it is only created once
const cache = new Map();

/**
 * An observable Property that triggers notifications when the value changes.
 * This caching implementation should be kept in sync with the other parametric IO Type caching implementations.
 * @param {function(new:ObjectIO)} parameterType
 * @returns {function(new:ObjectIO)}
 */
function RewindablePropertyIO( parameterType ) {
  assert && assert( parameterType, 'RewindablePropertyIO needs parameterType' );

  const cacheKey = parameterType;

  if ( !cache.has( cacheKey ) ) {

    const PropertyIOImpl = PropertyIO( parameterType );
    cache.set( cacheKey, new IOType( `RewindablePropertyIO<${parameterType.typeName}>`, {
        valueType: RewindableProperty,
        parameterTypes: [ parameterType ],
        documentation: 'Observable values that send out notifications when the value changes. This differs from the ' +
                       'traditional listener pattern in that added listeners also receive a callback with the current value ' +
                       'when the listeners are registered. This is a widely-used pattern in PhET-iO simulations.',
        supertype: PropertyIOImpl,
        toStateObject: property => {
          const stateObject = PropertyIOImpl.toStateObject( property );
          stateObject.rewindValue = parameterType.toStateObject( property.rewindValue );
          return stateObject;
        },
        applyState: ( property, stateObject ) => {
          PropertyIOImpl.applyState( property, stateObject );
          property.rewindValue = parameterType.fromStateObject( stateObject.rewindValue );
        }
      } )
    );
  }

  return cache.get( cacheKey );
}

gravityAndOrbits.register( 'RewindablePropertyIO', RewindablePropertyIO );
export default RewindablePropertyIO;