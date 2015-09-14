// Copyright 2002-2015, University of Colorado

/**
 * Provides a textual readout of a Body's mass in "earth masses"
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
  var GAOStrings = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GAOStrings' );

  // constants
  var EARTH_MASS = 5.9736E24; // TODO: duplicated in ModeList

  function EarthMassReadoutNode( bodyNode, visible ) {
    MassReadoutNode.call( this, bodyNode, visible );
  }

  return inherit( MassReadoutNode, EarthMassReadoutNode, {
    createText: function() {
      var massKG = this.bodyNode.getBody().getMass();
      var earthMasses = massKG / EARTH_MASS;
      //Show the value in terms of earth masses (or thousands of earth masses)
      var value, units;
      if ( earthMasses > 1E3 ) {
        value = Util.roundSymmetric( earthMasses / 1E3 ).toFixed( 0 );
        units = GAOStrings.THOUSAND_EARTH_MASSES;
      }
      else if ( Math.abs( earthMasses - 1 ) < 1E-2 ) {
        value = '1';
        units = GAOStrings.EARTH_MASS;
      }
      else if ( earthMasses < 1 ) {
        value = earthMasses.toFixed( 2 );
        units = GAOStrings.EARTH_MASSES;
      }
      else {
        // Handle showing exactly "1 earth mass" instead of "1 earth masses"
        value = earthMasses.toFixed( 2 );
        units = (earthMasses === 1) ? GAOStrings.EARTH_MASS : GAOStrings.EARTH_MASSES;
      }
      return StringUtils.format( GAOStrings.PATTERN_VALUE_UNITS, value, units );
    }
  } );
} );
