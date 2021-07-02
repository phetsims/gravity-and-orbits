// Copyright 2013-2020, University of Colorado Boulder

/**
 * Container for scale slider. This file is not a direct port from the Java version.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import SceneryConstants from '../../../../scenery/js/SceneryConstants.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import VSlider from '../../../../sun/js/VSlider.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsConstants from '../GravityAndOrbitsConstants.js';

// constants
const TRACK_SIZE = new Dimension2( 3, 140 );
const THUMB_SIZE = new Dimension2( 28, 20 );
const STEP = 0.1;
const BUTTON_SIZE = 25;

class ZoomControl extends Node {

  /**
   * @param {Property.<number>} scaleProperty - Scale property for observing and updating.
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( scaleProperty, tandem, options ) {

    options = merge( {
      scale: 0.8,
      tandem: tandem,
      phetioEnabledPropertyInstrumented: true,
      disabledOpacity: SceneryConstants.DISABLED_OPACITY
    }, options );

    super();

    const slider = new VSlider( scaleProperty, GravityAndOrbitsConstants.ZOOM_RANGE, {
      trackSize: TRACK_SIZE,
      thumbSize: THUMB_SIZE,

      // custom thumb colors
      thumbFill: '#98BECF',
      thumbFillHighlighted: '#B3D3E2',
      tandem: tandem.createTandem( 'slider' ),

      phetioReadOnly: true
    } );

    slider.translate( -TRACK_SIZE.height - THUMB_SIZE.height - 17, -TRACK_SIZE.width / 2 );

    // add slide line
    this.addChild( slider );

    // Add buttons last so their hit areas will be in front for overlapping touch areas on touch devices

    // add plus button
    const plusButton = new SliderButton( scaleProperty, GravityAndOrbitsConstants.ZOOM_RANGE, STEP, true, {
      tandem: tandem.createTandem( 'plusButton' )
    } );
    plusButton.centerBottom = slider.centerTop;
    this.addChild( plusButton );

    // add minus button
    const minusButton = new SliderButton( scaleProperty, GravityAndOrbitsConstants.ZOOM_RANGE, STEP, false, {
      tandem: tandem.createTandem( 'minusButton' )
    } );
    minusButton.centerTop = slider.centerBottom;
    this.addChild( minusButton );

    this.mutate( options );
  }
}

gravityAndOrbits.register( 'ZoomControl', ZoomControl );

class SliderButton extends RectangularPushButton {
  /**
   * @param {Property.<number>} scaleProperty - Scale property for updating.
   * @param {Range} range - Working range of slider.
   * @param {number} step step of scale changes
   * @param {boolean} isIncrease flag for defining type of button
   * @param {Object} [options]
   */
  constructor( scaleProperty, range, step, isIncrease, options ) {

    // create default view
    const sample = new Node( {
      children: [
        new Rectangle( 0, 0, BUTTON_SIZE, BUTTON_SIZE, 2, 2, { fill: '#DBD485' } ),
        new Rectangle( 4, BUTTON_SIZE / 2 - 1, BUTTON_SIZE - 8, 2, { fill: 'black' } )
      ]
    } );

    // increase or decrease view
    if ( isIncrease ) {
      sample.addChild( new Rectangle( BUTTON_SIZE / 2 - 1, 4, 2, BUTTON_SIZE - 8, { fill: 'black' } ) );
    }

    super( merge( {
      content: sample,
      xMargin: 0,
      yMargin: 0,
      phetioReadOnly: true,
      listener: () => {
        scaleProperty.value = Math.max(
          Math.min( scaleProperty.value + ( isIncrease ? step : -step ), range.max ),
          range.min );
      }
    }, options ) );

    // add disabling effect for buttons
    if ( isIncrease ) {

      // plus button
      scaleProperty.link( scaleValue => this.setEnabled( scaleValue !== range.max ) );
    }
    else {

      // minus button
      scaleProperty.link( scaleValue => this.setEnabled( scaleValue !== range.min ) );
    }

    // Increase the touch area in all directions except toward the slider knob,
    // so that they won't interfere too much on touch devices
    const dilationSize = 15;
    const dilateTop = ( isIncrease ) ? dilationSize : 0;
    const dilateBottom = ( isIncrease ) ? 0 : dilationSize;
    this.touchArea = Shape.bounds( new Bounds2(
      this.localBounds.minX - dilationSize,
      this.localBounds.minY - dilateTop,
      this.localBounds.maxX + dilationSize,
      this.localBounds.maxY + dilateBottom ) );
  }
}

export default ZoomControl;