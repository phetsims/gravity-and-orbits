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
  var MassReadoutNode = require( 'GRAVITY_AND_ORBITS/view/MassReadoutNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var GAOStrings = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GAOStrings' );

  // constants
  var SPACE_STATION_MASS = 369914; // TODO: duplicate from ModeList

  function SpaceStationMassReadoutNode( bodyNode, visible ) {
    MassReadoutNode.call( this, bodyNode, visible );
  }

  return inherit( MassReadoutNode, SpaceStationMassReadoutNode, {
    createText: function() {
      var massKG = this.bodyNode.getBody().getMass();
      var spaceStationMasses = massKG / SPACE_STATION_MASS;
      //Show the readout in terms of space station masses (or billions of billions of space station masses)
      var value;
      var units = GAOStrings.SPACE_STATION_MASS;
      if ( spaceStationMasses > 1E18 ) {
//        value = new DecimalFormat( "0" ).format( spaceStationMasses / 1E18 );
        value = ( spaceStationMasses / 1E18 ).toFixed( 0 );
        units = GAOStrings.BILLION_BILLION_SPACE_STATION_MASSES;
      }
      else if ( Math.abs( spaceStationMasses - 1 ) < 1E-2 ) {
        value = "1";
      }
      else if ( spaceStationMasses < 1 ) {
//        value = new DecimalFormat( "0.000" ).format( spaceStationMasses );
        value = spaceStationMasses.toFixed( 3 );
      }
      else {
        //use one less decimal point here
//        value = new DecimalFormat( "0.00" ).format( spaceStationMasses );
        value = spaceStationMasses.toFixed( 2 );
      }
      return StringUtils.format( GAOStrings.PATTERN_VALUE_UNITS, value, units );
    }
  } );
} );
