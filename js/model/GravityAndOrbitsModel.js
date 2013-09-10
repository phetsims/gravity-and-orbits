// Copyright 2002-2013, University of Colorado Boulder

/**
 * main Model container.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );

  var G = 6.67384E-11; // gravitational constant

  var calculateForce = function( mass1, mass2, distance ) {
    return ( G * mass1 * mass2 ) / ( distance * distance );
  };

  function GravityAndOrbitsModel( width, height ) {

    var model = this;
    this.massRange = new Range( 0.5, 2 );

    // dimensions of the model's space
    this.width = width;
    this.height = height;

    PropertySet.call( this, {
      scale: 1
    } );

    this.reset();
  }

  inherit( PropertySet, GravityAndOrbitsModel, {
    step: function() {},
    reset: function() {}
  } );

  return GravityAndOrbitsModel;
} );
