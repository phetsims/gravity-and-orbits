// Copyright 2014-2020, University of Colorado Boulder

/**
 * Provides a textual readout of a Body's mass in "earth masses"
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import gravityAndOrbitsStrings from '../../gravity-and-orbits-strings.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsConstants from '../GravityAndOrbitsConstants.js';
import MassReadoutNode from './MassReadoutNode.js';

const earthMassesString = gravityAndOrbitsStrings.earthMasses;
const earthMassString = gravityAndOrbitsStrings.earthMass;
const pattern0Value1UnitsString = gravityAndOrbitsStrings.pattern[ '0value' ][ '1units' ];
const thousandEarthMassesString = gravityAndOrbitsStrings.thousandEarthMasses;

class EarthMassReadoutNode extends MassReadoutNode {

  /**
   * Create a label for the earth, but with rules to provide either exact or qualitive representations,
   * and limitations so that the label looks good in the view.
   *
   * @returns {type}  description
   * REVIEW private/public
   */
  createText() {
    const massKG = this.bodyNode.body.massProperty.get();
    const earthMasses = massKG / GravityAndOrbitsConstants.EARTH_MASS;

    // Show the value in terms of earth masses (or thousands of earth masses)
    let value;
    let units;
    if ( earthMasses > 1E3 ) {
      value = Utils.toFixed( Utils.roundSymmetric( earthMasses / 1E3 ), 0 );
      units = thousandEarthMassesString;
    }
    else if ( Math.abs( earthMasses - 1 ) < 1E-2 ) {
      value = '1';
      units = earthMassString;
    }
    else if ( earthMasses < 1 ) {
      value = Utils.toFixed( earthMasses, 2 );
      units = earthMassesString;
    }
    else {

      // Handle showing exactly "1 earth mass" instead of "1 earth masses"
      value = Utils.toFixed( earthMasses, 2 );
      units = ( earthMasses === 1 ) ? earthMassString : earthMassesString;
    }
    return StringUtils.format( pattern0Value1UnitsString, value, units );
  }
}

gravityAndOrbits.register( 'EarthMassReadoutNode', EarthMassReadoutNode );
export default EarthMassReadoutNode;