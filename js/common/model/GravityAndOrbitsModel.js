// Copyright 2014-2020, University of Colorado Boulder

/**
 * The GravityAndOrbitsModel has an array of GravityAndOrbitsScenes, one scene for each configuration of bodies (e.g.,
 * Star + Planet). Each scene has its own model, canvas, clock, etc, which are used in place of this Module's data.
 * The model contains information that is shared across all modes, such as whether certain features are shown (such as
 * showing the gravitational force).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jonathan Olson (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 * @author John Blanco (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const PhysicalConstants = require( 'PHET_CORE/PhysicalConstants' );
  const Property = require( 'AXON/Property' );
  const PropertyIO = require( 'AXON/PropertyIO' );
  const ReferenceIO = require( 'TANDEM/types/ReferenceIO' );
  const SpeedType = require( 'GRAVITY_AND_ORBITS/common/model/SpeedType' );
  const Tandem = require( 'TANDEM/Tandem' );

  // constants
  const G = PhysicalConstants.GRAVITATIONAL_CONSTANT;

  class GravityAndOrbitsModel {

    /**
     * @param {boolean} showMeasuringTape
     * @param {function.<ModeListParameterList, Array.<GravityAndOrbitsScene>>} createModes
     * @param {number} initialSceneIndex
     * @param {boolean} showMassCheckbox
     * @param {Tandem} screenTandem
     * @param {Tandem} tandem
     */
    constructor( showMeasuringTape, createModes, initialSceneIndex, showMassCheckbox, screenTandem, tandem ) {

      // Properties that are common to all "modes" should live here.
      this.showGravityForceProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showGravityForceProperty' ) } );
      this.showVelocityProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showVelocityProperty' ) } );
      this.showPathProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showPathProperty' ) } );
      this.showGridProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'showGridProperty' ) } );

      // The following 2 tandems should not appear in the "Model" screen
      this.showMassProperty = new BooleanProperty( false, { tandem: showMassCheckbox ? tandem.createTandem( 'showMassProperty' ) : Tandem.OPTIONAL } );
      this.showMeasuringTapeProperty = new BooleanProperty( false, { tandem: showMeasuringTape ? tandem.createTandem( 'showMeasuringTapeProperty' ) : Tandem.OPTIONAL } );

      this.isPlayingProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'isPlayingProperty' ),
        phetioDocumentation: `This value is true if '${screenTandem.phetioID}' is the active screen AND the play/pause button is in play mode.`
      } );
      this.speedTypeProperty = new EnumerationProperty( SpeedType, SpeedType.NORMAL, { tandem: tandem.createTandem( 'speedTypeProperty' ) } );

      this.gravityEnabledProperty = new BooleanProperty( true, { tandem: tandem.createTandem( 'gravityEnabledProperty' ) } );
      this.steppingProperty = new BooleanProperty( false );
      this.rewindingProperty = new BooleanProperty( false );

      // these two booleans indicate whether or not to show the checkbox for measuring tape and mass.
      // they are false for the model screen and true for the toScale screen
      this.showMassCheckbox = showMassCheckbox; // @public
      this.showMeasuringTape = showMeasuringTape; // @public

      // @private {SceneFactory}
      this.sceneList = createModes( this );

      this.sceneProperty = new Property( this.sceneList.scenes[ 0 ], {
        tandem: tandem.createTandem( 'sceneProperty' ),
        validValues: this.sceneList.scenes,
        phetioType: PropertyIO( ReferenceIO )
      } );
    }

    // @public
    step( dt ) {

      // limit dt to 1 so there are no large jumps
      dt = Math.min( 1, dt );

      // collision animations should proceed outside of the model step
      const bodies = this.sceneProperty.get().physicsEngine.bodies;
      for ( let i = 0; i < bodies.length; i++ ) {
        const body = bodies[ i ];
        if ( body.isCollidedProperty.get() ) {
          body.clockTicksSinceExplosionProperty.value += 1;
        }
      }

      if ( this.isPlayingProperty.value ) {
        this.sceneProperty.value.getClock().step( dt );
      }
    }

    // @public
    getScenes() {
      return this.sceneList.scenes;
    }

    // @private
    updateActiveModule() {
      for ( let i = 0; i < this.sceneList.scenes.length; i++ ) {
        this.sceneList.scenes[ i ].activeProperty.set( this.sceneList.scenes[ i ] === this.sceneProperty.value );
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
      this.isPlayingProperty.reset();
      this.speedTypeProperty.reset();
      this.showMeasuringTapeProperty.reset();
      this.gravityEnabledProperty.reset();
      this.steppingProperty.reset();
      this.rewindingProperty.reset();
      this.sceneProperty.reset();
      for ( let i = 0; i < this.sceneList.scenes.length; i++ ) {
        this.sceneList.scenes[ i ].reset();
      }
    }
  }

  //statics
  GravityAndOrbitsModel.G = G;

  return gravityAndOrbits.register( 'GravityAndOrbitsModel', GravityAndOrbitsModel );
} );