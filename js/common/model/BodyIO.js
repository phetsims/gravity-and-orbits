// Copyright 2020, University of Colorado Boulder

import IOType from '../../../../tandem/js/types/IOType.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import Body from './Body.js';

const BodyIO = new IOType( 'BodyIO', {
  isValidValue: b => b instanceof Body,
  documentation: 'Represents a physical body in the simulation',
  toStateObject: body => body.toStateObject(),
  applyState: ( body, stateObject ) => body.setStateObject( stateObject )
} );

gravityAndOrbits.register( 'BodyIO', BodyIO );
export default BodyIO;