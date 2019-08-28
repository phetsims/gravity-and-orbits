// Copyright 2014-2019, University of Colorado Boulder

/**
 * The GravityAndOrbitsModule has a set of "modes", one mode for each configuration of bodies (eg, Sun + Planet).
 * Each mode has its own model, canvas, clock, etc, which are used in place of this Module's data.
 * The module contains information that is shared across all modes, such as whether certain features are shown (such as
 * showing the gravitational force).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jonathan Olson (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 * @author John Blanco (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * @see GravityAndOrbitsModel
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );
  const ModeListParameterList = require( 'GRAVITY_AND_ORBITS/common/module/ModeListParameterList' );
  const Property = require( 'AXON/Property' );
  const PhysicalConstants = require( 'PHET_CORE/PhysicalConstants' );

  // constants
  const G = PhysicalConstants.GRAVITATIONAL_CONSTANT;

  class GravityAndOrbitsModule {

    /**
     * @param {boolean} showMeasuringTape
     * @param {function.<ModeListParameterList, Array.<GravityAndOrbitsMode>>} createModes
     * @param {number} initialModeIndex
     * @param {boolean} showMassCheckbox
     */
    constructor( showMeasuringTape, createModes, initialModeIndex, showMassCheckbox ) {

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
      this.showMassCheckbox = showMassCheckbox; // @public
      this.showMeasuringTape = showMeasuringTape; // @public

      // @private {ModeList}
      this.modeList = createModes( new ModeListParameterList(
        this.playButtonPressedProperty,
        this.gravityEnabledProperty,
        this.steppingProperty,
        this.rewindingProperty,
        this.timeSpeedScaleProperty ) );

      this.modeProperty = new Property( this.modeList.modes[ initialModeIndex ] );
      for ( let i = 0; i < this.modeList.modes.length; i++ ) {
        this.modeList.modes[ i ].init( this );
      }

      this.reset();
    }

    // @public
    step( dt ) {

      // limit dt to 1 so there are no large jumps
      dt = Math.min( 1, dt );

      // collision animations should proceed outside of the model step
      const bodies = this.modeProperty.get().model.bodies;
      for ( let i = 0; i < bodies.length; i++ ) {
        const body = bodies[ i ];
        if ( body.collidedProperty.get() ) {
          body.clockTicksSinceExplosionProperty.value += 1;
        }
      }

      if ( this.playButtonPressedProperty.value ) {
        this.modeProperty.get().getClock().step( dt );
      }
    }

    // @public
    getModes() {
      return this.modeList.modes.slice( 0 );
    }

    // @private
    updateActiveModule() {
      for ( let i = 0; i < this.modeList.modes.length; i++ ) {
        this.modeList.modes[ i ].activeProperty.set( this.modeList.modes[ i ] === this.modeProperty.get() );
      }
    }

    /**
     * @public
     * @override
     */
    reset() {
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
      for ( let i = 0; i < this.modeList.modes.length; i++ ) {
        this.modeList.modes[ i ].reset();
      }
    }
  }

  //statics
  GravityAndOrbitsModule.G = G;

  return gravityAndOrbits.register( 'GravityAndOrbitsModule', GravityAndOrbitsModule );
} );
