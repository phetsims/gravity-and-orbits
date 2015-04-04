// Copyright 2002-2013, University of Colorado Boulder

/**
 * Container for mass sliders.
 * There should be two sliders.
 * Sliders can selected through variable showModes.
 *
 * @author Andrey Zelenkov (Mlearner)
 */


define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var BodyMassControl = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/controlpanel/BodyMassControl' );

  // strings
  var ourSunString = require( 'string!GRAVITY_AND_ORBITS/ourSun' );
  var earthString = require( 'string!GRAVITY_AND_ORBITS/earth' );
  var ourMoonString = require( 'string!GRAVITY_AND_ORBITS/ourMoon' );
  var spaceStationString = require( 'string!GRAVITY_AND_ORBITS/spaceStation' );
  var starString = require( 'string!GRAVITY_AND_ORBITS/star' );
  var planetString = require( 'string!GRAVITY_AND_ORBITS/planet' );
  var moonString = require( 'string!GRAVITY_AND_ORBITS/moon' );
  var satelliteString = require( 'string!GRAVITY_AND_ORBITS/satellite' );

  /**
   * @param {GravityAndOrbitsModule} module
   * @constructor
   */
  function MassMenu( module, options ) {

    var children = [];
    var bodies = module.getMode().getModel().getBodies();
    for ( var i = 0; i < bodies.length; i++ ) {
      var body = bodies[ i ];
      if ( body.isMassSettable() ) {
        children.push( new BodyMassControl( body, body.getMassProperty().getInitialValue() / 2, body.getMassProperty().getInitialValue() * 2, body.getTickValue(), body.getTickLabel(), module.whiteBackgroundProperty ) );
      }
    }

    options = _.extend( { children: children, resize: false }, options );
    VBox.call( this, options );
  }

  return inherit( VBox, MassMenu );
} );