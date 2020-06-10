// Copyright 2020, University of Colorado Boulder

import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import Body from './Body.js';

/**
 * IO type for Body
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
   * @param {Object} stateObject
   * @returns {Object}
   * @public
   */
  static fromStateObject( stateObject ) {
    return stateObject;
  }

  /**
   * Used to set the value when loading a state
   * @param {Body} body
   * @param {Object} fromStateObject
   * @public
   */
  static setValue( body, fromStateObject ) {
    body.setStateObject( fromStateObject );
  }
}

BodyIO.documentation = 'Represents a physical body in the simulation';
BodyIO.validator = { isValidValue: b => b instanceof Body };
BodyIO.typeName = 'BodyIO';
ObjectIO.validateSubtype( BodyIO );

gravityAndOrbits.register( 'BodyIO', BodyIO );
export default BodyIO;