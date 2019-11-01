// Copyright 2013-2019, University of Colorado Boulder

/**
 * Container for scale slider. This file is not a direct port from the Java version.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Range = require( 'DOT/Range' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const Shape = require( 'KITE/Shape' );
  const VSlider = require( 'SUN/VSlider' );

  // constants
  const TRACK_SIZE = new Dimension2( 140, 3 );
  const THUMB_SIZE = new Dimension2( 20, 28 );
  const RANGE = new Range( 0.5, 1.5 );
  const STEP = 0.1;
  const BUTTON_SIZE = 25;

  class ScaleSlider extends Node {

    /**
     * @param {Property.<number>} scaleProperty - Scale property for observing and updating.
     * @param {Tandem} tandem
     * @param {Object} [options]
     */
    constructor( scaleProperty, tandem, options ) {

      options = merge( {
        scale: 0.8,
        tandem: tandem
      }, options );

      super();

      const slider = new VSlider( scaleProperty, RANGE, {
        trackSize: TRACK_SIZE,
        thumbSize: THUMB_SIZE,

        // custom thumb colors
        thumbFill: '#98BECF',
        thumbFillHighlighted: '#B3D3E2',
        tandem: tandem.createTandem( 'slider' )
      } );

      slider.translate( -TRACK_SIZE.width - THUMB_SIZE.width - 17, -TRACK_SIZE.height / 2 );

      // add slide line
      this.addChild( slider );

      // Add buttons last so their hit areas will be in front for overlapping touch areas on touch devices

      // add plus button
      const plusButton = new SliderButton( scaleProperty, RANGE, STEP, true, {
        tandem: tandem.createTandem( 'plusButton' )
      } );
      plusButton.centerBottom = slider.centerTop;
      this.addChild( plusButton );

      // add minus button
      const minusButton = new SliderButton( scaleProperty, RANGE, STEP, false, {
        tandem: tandem.createTandem( 'minusButton' )
      } );
      minusButton.centerTop = slider.centerBottom;
      this.addChild( minusButton );

      this.mutate( options );
    }
  }

  gravityAndOrbits.register( 'ScaleSlider', ScaleSlider );

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

  return ScaleSlider;
} );