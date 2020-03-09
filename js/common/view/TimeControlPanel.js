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
import RewindButton from '../../../../scenery-phet/js/buttons/RewindButton.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
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

    const timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      playPauseStepXSpacing: 10 / 1.4,
      scale: 1.4,
      tandem: options.tandem.createTandem( 'timeControlNode' )
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
      children: [ rewindButton, timeControlNode ]
    }, options ) );
  }
}

gravityAndOrbits.register( 'TimeControlPanel', TimeControlPanel );
export default TimeControlPanel;