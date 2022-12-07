// Copyright 2014-2022, University of Colorado Boulder

/**
 * Shows the mass of a Body in terms of space station masses.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsStrings from '../../GravityAndOrbitsStrings.js';
import GravityAndOrbitsConstants from '../GravityAndOrbitsConstants.js';
import BodyNode from './BodyNode.js';
import MassReadoutNode from './MassReadoutNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

const billionBillionSpaceStationMassesStringProperty = GravityAndOrbitsStrings.billionBillionSpaceStationMassesStringProperty;

const pattern0Value1UnitsStringProperty = GravityAndOrbitsStrings.pattern[ '0value' ][ '1unitsStringProperty' ];
const spaceStationMassStringProperty = GravityAndOrbitsStrings.spaceStationMassStringProperty;

class SpaceStationMassReadoutNode extends MassReadoutNode {

  public constructor( bodyNode: BodyNode, visibleProperty: TReadOnlyProperty<boolean> ) {
    super( bodyNode, visibleProperty, bodyNode.body.type === 'planet' ? {
      textMaxWidth: 400
    } : {} );

    /**
     * Create a text label for the space station, modified so that it will be quantitative
     * or qualitative depending on the mass of the station.  For instance, if larger than
     * a specific mass, the label will be in something like 'billions of station masses'.
     */
    const updateText = () => {
      const massKG = this.bodyNode.body.massProperty.get();
      const spaceStationMasses = massKG / GravityAndOrbitsConstants.SPACE_STATION_MASS;

      // Show the readout in terms of space station masses (or billions of billions of space station masses)
      let value;
      let units = spaceStationMassStringProperty.value;
      if ( spaceStationMasses > 1E18 ) {
        value = Utils.toFixed( spaceStationMasses / 1E18, 0 );
        units = billionBillionSpaceStationMassesStringProperty.value;
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
      this.stringProperty.value = StringUtils.format( pattern0Value1UnitsStringProperty.value, value, units );
    };
    this.bodyNode.body.massProperty.lazyLink( updateText );
    billionBillionSpaceStationMassesStringProperty.lazyLink( updateText );
    spaceStationMassStringProperty.lazyLink( updateText );
    pattern0Value1UnitsStringProperty.lazyLink( updateText );
    updateText();
  }
}

gravityAndOrbits.register( 'SpaceStationMassReadoutNode', SpaceStationMassReadoutNode );
export default SpaceStationMassReadoutNode;