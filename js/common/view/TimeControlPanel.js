// Copyright 2013-2019, University of Colorado Boulder

/**
 * Visual representation of speed control buttons.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  const RewindButton = require( 'SCENERY_PHET/buttons/RewindButton' );
  const StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );

  class TimeControlPanel extends HBox {

    /**
     * @param {GravityAndOrbitsModel} model
     * @param {Array.<Body>} bodies
     * @param {Tandem} tandem
     * @param {Object} [options]
     */
    constructor( model, bodies, tandem, options ) {

      const playPauseButton = new PlayPauseButton( model.isPlayingProperty, {
        tandem: tandem.createTandem( 'playPauseButton' )
      } );

      const stepButton = new StepForwardButton( {
        isPlayingProperty: model.isPlayingProperty,
        listener: () => model.sceneProperty.value.getClock().stepClockWhilePaused(),
        tandem: tandem.createTandem( 'stepButton' )
      } );

      const rewindButton = new RewindButton( {
        enabled: false,
        listener: () => model.sceneProperty.value.rewind(),
        tandem: tandem.createTandem( 'rewindButton' )
      } );

      const anyPropertyDifferentProperties = [];
      for ( let i = 0; i < bodies.length; i++ ) {
        anyPropertyDifferentProperties.push( bodies[ i ].anyPropertyDifferent() );
      }

      super( merge( {
        spacing: 10,
        children: [ rewindButton, playPauseButton, stepButton ]
      }, options ) );

      // REVIEW this seems duplicated elsewhere.  Also, what is happening here?
      const anyPropertyChanged = DerivedProperty.or( anyPropertyDifferentProperties );

      // @private
      this.propertyChangedListener = changed => rewindButton.setEnabled( changed );
      anyPropertyChanged.link( this.propertyChangedListener );
    }
  }

  return gravityAndOrbits.register( 'TimeControlPanel', TimeControlPanel );
} );