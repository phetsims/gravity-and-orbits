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
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const ModeListParameterList = require( 'GRAVITY_AND_ORBITS/common/module/ModeListParameterList' );
  const PhysicalConstants = require( 'PHET_CORE/PhysicalConstants' );
  const Property = require( 'AXON/Property' );
  const SpeedType = require( 'GRAVITY_AND_ORBITS/common/model/SpeedType' );

  // constants
  const G = PhysicalConstants.GRAVITATIONAL_CONSTANT;

  // TODO: Rename to "Model"
  class GravityAndOrbitsModule {

    /**
     * @param {boolean} showMeasuringTape
     * @param {function.<ModeListParameterList, Array.<GravityAndOrbitsMode>>} createModes
     * @param {number} initialModeIndex
     * @param {boolean} showMassCheckbox
     * @param {Tandem} tandem
     * @param {Tandem} viewTandem
     */
    constructor( showMeasuringTape, createModes, initialModeIndex, showMassCheckbox, tandem, viewTandem ) {

      // Properties that are common to all "modes" should live here.
      this.showGravityForceProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showGravityForceProperty' ) } );
      this.showVelocityProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showVelocityProperty' ) } );
      this.showMassProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showMassProperty' ) } );
      this.showPathProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showPathProperty' ) } );
      this.showGridProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showGridProperty' ) } );
      this.showMeasuringTapeProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showMeasuringTapeProperty' ) } );

      this.playButtonPressedProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'isPlayingProperty' ) } ); // TODO: Rename isPlayingProperty
      this.speedTypeProperty = new EnumerationProperty( SpeedType, SpeedType.NORMAL, { tandem: tandem.createTandem( 'speedTypeProperty' ) } );

      this.gravityEnabledProperty = new BooleanProperty( true, { tandem: tandem.createTandem( 'gravityEnabledProperty' ) } );
      this.steppingProperty = new BooleanProperty( false );
      this.rewindingProperty = new BooleanProperty( false );

      // these two booleans indicate whether or not to show the checkbox for measuring tape and mass.
      // they are false for the cartoon screen and true for the toScale screen
      this.showMassCheckbox = showMassCheckbox; // @public
      this.showMeasuringTape = showMeasuringTape; // @public

      // @private {ModeListModel}
      this.modeList = createModes( new ModeListParameterList(
        this.playButtonPressedProperty,
        this.gravityEnabledProperty,
        this.steppingProperty,
        this.rewindingProperty,
        this.speedTypeProperty ) );

      this.modeProperty = new Property( this.modeList.modes[ initialModeIndex ] );
      for ( let i = 0; i < this.modeList.modes.length; i++ ) {
        this.modeList.modes[ i ].init( this, viewTandem.createTandem( this.modeList.modes[ i ].tandemName ) );
      }

      this.reset(); // TODO: is this necessary?  If so, why?
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
      this.speedTypeProperty.reset();
      this.showMeasuringTapeProperty.reset();
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
