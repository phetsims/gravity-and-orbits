// Copyright 2013-2020, University of Colorado Boulder

/**
 * Visual representation of speed control buttons.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import PlayPauseButton from '../../../../scenery-phet/js/buttons/PlayPauseButton.js';
import RewindButton from '../../../../scenery-phet/js/buttons/RewindButton.js';
import StepForwardButton from '../../../../scenery-phet/js/buttons/StepForwardButton.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';

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

gravityAndOrbits.register( 'TimeControlPanel', TimeControlPanel );
export default TimeControlPanel;