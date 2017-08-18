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
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var ModeListParameterList = require( 'GRAVITY_AND_ORBITS/common/module/ModeListParameterList' );
  var GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  // constants
  var G = 6.67428E-11;

  /**
   * @param {boolean} showMeasuringTape
   * @param {function.<ModeListParameterList, Array.<GravityAndOrbitsMode>>} createModes
   * @param {number} initialModeIndex
   * @param {boolean} showMassCheckBox
   * @constructor
   */
  function GravityAndOrbitsModule( showMeasuringTape, createModes, initialModeIndex, showMassCheckBox ) {

    // Properties that are common to all "modes" should live here.
    this.showGravityForceProperty = new BooleanProperty( false );
    this.showPathProperty = new BooleanProperty( false );
    this.showGridProperty = new BooleanProperty( false );
    this.showVelocityProperty = new BooleanProperty( false );
    this.showMassProperty = new BooleanProperty( false );
    this.playButtonPressedProperty = new BooleanProperty( false );
    this.timeSpeedScaleProperty = new Property( GravityAndOrbitsConstants.STARTING_SPEED_SCALE );
    this.measuringTapeVisibleProperty = new BooleanProperty( false );
    this.gravityEnabledProperty = new BooleanProperty( true );
    this.steppingProperty = new BooleanProperty( false );
    this.rewindingProperty = new BooleanProperty( false );

    // these two booleans indicate whether or not to show the checkbox for measuring tape and mass.
    // they are false for the cartoon screen and true for the toScale screen
    this.showMassCheckBox = showMassCheckBox; // @public
    this.showMeasuringTape = showMeasuringTape; // @public

    // @private {ModeList}
    this.modeList = createModes( new ModeListParameterList(
      this.playButtonPressedProperty,
      this.gravityEnabledProperty,
      this.steppingProperty,
      this.rewindingProperty,
      this.timeSpeedScaleProperty ) );

    this.modeProperty = new Property( this.modeList.modes[ initialModeIndex ] );
    for ( var i = 0; i < this.modeList.modes.length; i++ ) {
      this.modeList.modes[ i ].init( this );
    }

    this.reset();
  }

  gravityAndOrbits.register( 'GravityAndOrbitsModule', GravityAndOrbitsModule );

  return inherit( Object, GravityAndOrbitsModule, {

    // @public
    step: function( dt ) {

      // limit dt to 1 so there are no large jumps
      dt = Math.min( 1, dt );

      // collision animations should proceed outside of the model step
      var bodies = this.modeProperty.get().model.bodies;
      for ( var i = 0; i < bodies.length; i++ ) {
        var body = bodies[ i ];
        if ( body.collidedProperty.get() ) {
          body.clockTicksSinceExplosionProperty.value += 1;
        }
      }

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

    /**
     * @public
     * @override
     */
    reset: function() {
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
      for ( var i = 0; i < this.modeList.modes.length; i++ ) {
        this.modeList.modes[ i ].reset();
      }
    }

  }, {
    G: G
  } );
} );
