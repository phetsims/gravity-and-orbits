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
  var MassReadoutNode = require( 'GRAVITY_AND_ORBITS/common/view/MassReadoutNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );
  var GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  // strings
  var billionBillionSpaceStationMassesString = require( 'string!GRAVITY_AND_ORBITS/billionBillionSpaceStationMasses' );
  var spaceStationMassString = require( 'string!GRAVITY_AND_ORBITS/spaceStationMass' );
  var pattern0Value1UnitsString = require( 'string!GRAVITY_AND_ORBITS/pattern.0value.1units' );

  function SpaceStationMassReadoutNode( bodyNode, visible ) {
    MassReadoutNode.call( this, bodyNode, visible );
  }

  gravityAndOrbits.register( 'SpaceStationMassReadoutNode', SpaceStationMassReadoutNode );

  return inherit( MassReadoutNode, SpaceStationMassReadoutNode, {

    /**
     * Create a text label for the space station, modified so that it will be quantitative
     * or qualitative depending on the mass of the station.  For instance, if larger than
     * a specific mass, the label will be in something like 'billions of station masses'.
     *
     * @returns {string} - formatted string
     */
    createText: function() {
      var massKG = this.bodyNode.body.massProperty.get();
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
      return StringUtils.format( pattern0Value1UnitsString, value, units );
    }
  } );
} );
