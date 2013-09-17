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

  var fps = 30, tick = 0;

  var G = 6.67384E-11; // gravitational constant

  var calculateForce = function( mass1, mass2, distance ) {
    return ( G * mass1 * mass2 ) / ( distance * distance );
  };

  function GravityAndOrbitsModel( width, height ) {
    var self = this;
    this.massRange = new Range( 0.5, 2 );

    this.viewModes = ['cartoon', 'scale'];

    this.spaseObjects = ['sun', 'earth', 'moon', 'spaceStation'];
    this.planetModes = [
      {sun: true, earth: true, moon: false, spaceStation: false},
      {sun: true, earth: true, moon: true, spaceStation: false},
      {sun: false, earth: true, moon: true, spaceStation: false},
      {sun: false, earth: true, moon: false, spaceStation: true}
    ];

    // dimensions of the model's space
    this.width = width;
    this.height = height;

    PropertySet.call( this, {
      viewMode: this.viewModes[0], // 'cartoon', 'scale'
      planetMode: 0, // which planet showing
      gravity: true, // switch gravity
      forceArrow: false, // visible force arrows
      velocityArrow: false, // visible velocity arrows
      path: false, // visible path
      grid: false, // visible grid
      tape: false, // visible tape
      mass: false, // visible mass
      play: false, // play/pause state
      rightPanelHeight: 0, // height of right control panel
      speed: 1, // 1.75, 1, 0.25
      day: 0,
      scale: 1
    } );

    this.reset();
  }

  inherit( PropertySet, GravityAndOrbitsModel, {
    step: function() {
      if ( this.play && (++tick % fps === 0) ) {
        this.stepManual();
        tick = 0;
      }
    },
    reset: function() {
      this.planetModeProperty.reset();
      this.gravityProperty.reset();
      this.forceArrowProperty.reset();
      this.velocityArrowProperty.reset();
      this.pathProperty.reset();
      this.gridProperty.reset();
      this.tapeProperty.reset();
      this.massProperty.reset();
      this.playProperty.reset();
      this.speedProperty.reset();
      this.dayProperty.reset();
      this.scaleProperty.reset();
    },
    clear: function() {
      this.dayProperty.reset();
    },
    stepManual: function() {
      this.day += this.speed;
    }
  } );

  return GravityAndOrbitsModel;
} );
