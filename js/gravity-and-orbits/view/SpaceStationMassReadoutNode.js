// Copyright 2002-2015, University of Colorado
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

  // strings
  var billionBillionSpaceStationMassesString = require( 'string!GRAVITY_AND_ORBITS/billionBillionSpaceStationMasses' );
  var spaceStationMassString = require( 'string!GRAVITY_AND_ORBITS/spaceStationMass' );
  var patternValueUnitsString = require( 'string!GRAVITY_AND_ORBITS/pattern.0value.1units' );

  // constants
  var SPACE_STATION_MASS = 369914; // TODO: duplicate from ModeList

  function SpaceStationMassReadoutNode( bodyNode, visible ) {
    MassReadoutNode.call( this, bodyNode, visible );
  }

  return inherit( MassReadoutNode, SpaceStationMassReadoutNode, {
    createText: function() {
      var massKG = this.bodyNode.getBody().getMass();
      var spaceStationMasses = massKG / SPACE_STATION_MASS;

      // Show the readout in terms of space station masses (or billions of billions of space station masses)
      var value;
      var units = spaceStationMassString;
      if ( spaceStationMasses > 1E18 ) {
        value = Util.toFixed( spaceStationMasses / 1E18 , 0 );
        units = billionBillionSpaceStationMassesString;
      }
      else if ( Math.abs( spaceStationMasses - 1 ) < 1E-2 ) {
        value = "1";
      }
      else if ( spaceStationMasses < 1 ) {
        value = Util.toFixed( spaceStationMasses, 3 );
      }
      else {
        // use one less decimal point here
        value = Util.toFixed( spaceStationMasses, 2 );
      }
      return StringUtils.format( patternValueUnitsString, value, units );
    }
  } );
} );
