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
import Tandem from '../../../../tandem/js/Tandem.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';

class TimeControlPanel extends HBox {

  /**
   * @param {GravityAndOrbitsModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    options = merge( {
      spacing: 10,
      tandem: Tandem.REQUIRED
    }, options );

    const playPauseButton = new PlayPauseButton( model.isPlayingProperty, {
      tandem: options.tandem.createTandem( 'playPauseButton' )
    } );

    const stepButton = new StepForwardButton( {
      isPlayingProperty: model.isPlayingProperty,
      listener: () => model.sceneProperty.value.getClock().stepClockWhilePaused(),
      tandem: options.tandem.createTandem( 'stepButton' )
    } );

    const rewindButton = new RewindButton( {
      enabled: false,
      listener: () => model.sceneProperty.value.rewind(),
      tandem: options.tandem.createTandem( 'rewindButton' )
    } );

    // Enable/disable the rewind button based on whether any Property in that scene has changed.
    let dependencies = [ model.sceneProperty ];
    model.getScenes().forEach( scene => {
      dependencies = dependencies.concat( scene.getBodies().map( b => b.anyPropertyDifferent() ) );
    } );
    const anyPropertyDifferentProperty = new DerivedProperty( dependencies, () => {
      const changedArray = model.sceneProperty.value.getBodies().map( body => body.anyPropertyDifferent().value );
      return _.some( changedArray );
    } );
    anyPropertyDifferentProperty.link( changed => rewindButton.setEnabled( changed ) );

    super( merge( {
      children: [ rewindButton, playPauseButton, stepButton ]
    }, options ) );
  }
}

gravityAndOrbits.register( 'TimeControlPanel', TimeControlPanel );
export default TimeControlPanel;