// Copyright 2014-2015, University of Colorado Boulder

/**
 * The GravityAndOrbitsModule has a set of "modes", one mode for each configuration of bodies (eg, Sun + Planet).
 * Each mode has its own model, canvas, clock, etc, which are used in place of this Module's data.
 * The module contains information that is shared across all modes, such as whether certain features are shown (such as
 * showing the gravitational force).
 *
 * @author Sam Reid
 * @author Jon Olson
 * @author Chris Malley
 * @author John Blanco
 * @author Aaron Davis
 * @see GravityAndOrbitsModel
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ModeListParameterList = require( 'GRAVITY_AND_ORBITS/common/module/ModeListParameterList' );

  // constants
  var G = 6.67428E-11;
  var STARTING_SPEED_SCALE = (0.1 + 2) / 4; // one quarter of the way up between 1/10 and 2 scale factors

  /**
   * @param {boolean} showMeasuringTape
   * @param {function<ModeListParameterList, Array<GravityAndOrbitsMode>>} createModes
   * @param {number} initialModeIndex
   * @param {boolean} showMassCheckBox
   * @constructor
   */
  function GravityAndOrbitsModule( showMeasuringTape, createModes, initialModeIndex, showMassCheckBox ) {

    // Properties that are common to all "modes" should live here.
    PropertySet.call( this, {
      showGravityForce: false,
      showPath: false,
      showGrid: false,
      showVelocity: false,
      showMass: false,
      playButtonPressed: false,
      timeSpeedScale: STARTING_SPEED_SCALE,
      measuringTapeVisible: false,
      gravityEnabled: true,
      stepping: false,
      rewinding: false,
      showMeasuringTape: false
    } );

    this.showMassCheckBox = showMassCheckBox;

    // @private {ModeList}
    this.modeList = createModes( new ModeListParameterList(
      this.playButtonPressedProperty,
      this.gravityEnabledProperty,
      this.steppingProperty,
      this.rewindingProperty,
      this.timeSpeedScaleProperty ) );

    this.modeProperty = new Property( this.modeList.modes[ initialModeIndex ] );
    this.showMeasuringTape = showMeasuringTape;

    for ( var i = 0; i < this.modeList.modes.length; i++ ) {
      this.modeList.modes[ i ].init( this );
    }

    this.reset();
  }

  return inherit( PropertySet, GravityAndOrbitsModule, {

    // @public
    step: function( dt ) {

      // limit dt to 1 so there are no large jumps
      dt = Math.min( 1, dt );

      if ( this.playButtonPressedProperty.value ) {
        this.modeProperty.get().getClock().step( dt );
      }
    },

    // @public
    getModes: function() {
      return this.modeList.modes.slice( 0 );
    },

    // @private
    updateActiveModule: function() {
      for ( var i = 0; i < this.modeList.modes.length; i++ ) {
        this.modeList.modes[ i ].activeProperty.set( this.modeList.modes[ i ] === this.modeProperty.get() );
      }
    },

    // @public
    reset: function() {
      for ( var i = 0; i < this.modeList.modes.length; i++ ) {
        this.modeList.modes[ i ].reset();
      }
      this.showGravityForceProperty.reset();
      this.showPathProperty.reset();
      this.showGridProperty.reset();
      this.showVelocityProperty.reset();
      this.showMassProperty.reset();
      this.playButtonPressedProperty.reset();
      this.timeSpeedScaleProperty.reset();
      this.measuringTapeVisibleProperty.reset();
      this.gravityEnabledProperty.reset();
      this.steppingProperty.reset();
      this.rewindingProperty.reset();
      this.modeProperty.reset();
    }

  }, {
    G: G,
    STARTING_SPEED_SCALE: STARTING_SPEED_SCALE
  } );
} );
