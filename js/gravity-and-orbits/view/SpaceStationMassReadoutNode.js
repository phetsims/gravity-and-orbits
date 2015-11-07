// Copyright 2014-2015, University of Colorado Boulder

/**
 * Shows the mass of a Body in terms of space station masses.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MassReadoutNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/MassReadoutNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );
  var GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsConstants' );

  // strings
  var billionBillionSpaceStationMassesString = require( 'string!GRAVITY_AND_ORBITS/billionBillionSpaceStationMasses' );
  var spaceStationMassString = require( 'string!GRAVITY_AND_ORBITS/spaceStationMass' );
  var patternValueUnitsString = require( 'string!GRAVITY_AND_ORBITS/pattern.0value.1units' );

  function SpaceStationMassReadoutNode( bodyNode, visible ) {
    MassReadoutNode.call( this, bodyNode, visible );
  }

  return inherit( MassReadoutNode, SpaceStationMassReadoutNode, {
    createText: function() {
      var massKG = this.bodyNode.getBody().massProperty.get();
      var spaceStationMasses = massKG / GravityAndOrbitsConstants.SPACE_STATION_MASS;

      // Show the readout in terms of space station masses (or billions of billions of space station masses)
      var value;
      var units = spaceStationMassString;
      if ( spaceStationMasses > 1E18 ) {
        value = Util.toFixed( spaceStationMasses / 1E18, 0 );
        units = billionBillionSpaceStationMassesString;
      }
      else if ( Math.abs( spaceStationMasses - 1 ) < 1E-2 ) {
        value = '1';
      }
      else if ( spaceStationMasses < 1 ) {
        value = Util.toFixed( spaceStationMasses, 3 );
      }
      else {
        value = Util.toFixed( spaceStationMasses, 2 ); // use one less decimal point here
      }
      return StringUtils.format( patternValueUnitsString, value, units );
    }
  } );
} );
