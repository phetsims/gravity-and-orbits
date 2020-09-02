// Copyright 2020, University of Colorado Boulder

import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import Body from './Body.js';

/**
 * IO Type for Body
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
class BodyIO extends ObjectIO {

  /**
   * @param {Body} body
   * @returns {Object}
   * @public
   */
  static toStateObject( body ) {
    return body.toStateObject();
  }

  /**
   * Used to set the value when loading a state
   * @param {Body} body
   * @param {Object} stateObject
   * @public
   */
  static applyState( body, stateObject ) {
    body.setStateObject( stateObject );
  }
}

BodyIO.documentation = 'Represents a physical body in the simulation';
BodyIO.validator = { isValidValue: b => b instanceof Body };
BodyIO.typeName = 'BodyIO';
ObjectIO.validateSubtype( BodyIO );

gravityAndOrbits.register( 'BodyIO', BodyIO );
export default BodyIO;