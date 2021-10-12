// Copyright 2014-2021, University of Colorado Boulder

/**
 * Shows the mass of a Body in terms of space station masses.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import gravityAndOrbitsStrings from '../../gravityAndOrbitsStrings.js';
import GravityAndOrbitsConstants from '../GravityAndOrbitsConstants.js';
import BodyNode from './BodyNode.js';
import MassReadoutNode from './MassReadoutNode.js';

// @ts-ignore
const billionBillionSpaceStationMassesString = gravityAndOrbitsStrings.billionBillionSpaceStationMasses;
// @ts-ignore
const pattern0Value1UnitsString = gravityAndOrbitsStrings.pattern[ '0value' ][ '1units' ];
// @ts-ignore
const spaceStationMassString = gravityAndOrbitsStrings.spaceStationMass;

class SpaceStationMassReadoutNode extends MassReadoutNode {

  /**
   * @param {BodyNode} bodyNode
   * @param {Property.<boolean>} visibleProperty
   */
  constructor( bodyNode: BodyNode, visibleProperty: Property<boolean> ) {
    super( bodyNode, visibleProperty, bodyNode.body.type === 'planet' ? {
      textMaxWidth: 400
    } : {} );
  }

  /**
   * Create a text label for the space station, modified so that it will be quantitative
   * or qualitative depending on the mass of the station.  For instance, if larger than
   * a specific mass, the label will be in something like 'billions of station masses'.
   *
   * @returns {string} - formatted string
   * @public
   */
  createText() {
    const massKG = this.bodyNode.body.massProperty.get();
    const spaceStationMasses = massKG / GravityAndOrbitsConstants.SPACE_STATION_MASS;

    // Show the readout in terms of space station masses (or billions of billions of space station masses)
    let value;
    let units = spaceStationMassString;
    if ( spaceStationMasses > 1E18 ) {
      value = Utils.toFixed( spaceStationMasses / 1E18, 0 );
      units = billionBillionSpaceStationMassesString;
    }
    else if ( Math.abs( spaceStationMasses - 1 ) < 1E-2 ) {
      value = '1';
    }
    else if ( spaceStationMasses < 1 ) {
      value = Utils.toFixed( spaceStationMasses, 3 );
    }
    else {
      value = Utils.toFixed( spaceStationMasses, 2 ); // use one less decimal point here
    }
    return StringUtils.format( pattern0Value1UnitsString, value, units );
  }
}

gravityAndOrbits.register( 'SpaceStationMassReadoutNode', SpaceStationMassReadoutNode );
export default SpaceStationMassReadoutNode;