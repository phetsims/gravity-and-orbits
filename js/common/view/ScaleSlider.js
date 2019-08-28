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
  const inherit = require( 'PHET_CORE/inherit' );
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

  /**
   * @param {Property.<number>} scaleProperty - Scale property for observing and updating.
   * @param {Object} [options]
   * @constructor
   */
  function ScaleSlider( scaleProperty, options ) {

    options = _.extend( { scale: 0.8 }, options );

    Node.call( this );

    const verticalSlider = new VSlider( scaleProperty, RANGE, {
      trackSize: TRACK_SIZE,
      thumbSize: THUMB_SIZE,

      // custom thumb colors
      thumbFill: '#98BECF',
      thumbFillHighlighted: '#B3D3E2'
    } );

    verticalSlider.translate( -TRACK_SIZE.width - THUMB_SIZE.width - 17, -TRACK_SIZE.height / 2 );

    // add slide line
    this.addChild( verticalSlider );

    // Add buttons last so their hit areas will be in front for overlapping touch areas on touch devices

    // add plus button
    const plusButton = new SliderButton( scaleProperty, RANGE, STEP, true );
    plusButton.centerBottom = verticalSlider.centerTop;
    this.addChild( plusButton );

    // add minus button
    const minusButton = new SliderButton( scaleProperty, RANGE, STEP, false );
    minusButton.centerTop = verticalSlider.centerBottom;
    this.addChild( minusButton );

    this.mutate( options );
  }

  gravityAndOrbits.register( 'ScaleSlider', ScaleSlider );

  inherit( Node, ScaleSlider );

  /**
   * @param {Property.<number>} scaleProperty - Scale property for updating.
   * @param {Range} range - Working range of slider.
   * @param {number} step step of scale changes
   * @param {boolean} isIncrease flag for defining type of button
   * @constructor
   */
  function SliderButton( scaleProperty, range, step, isIncrease ) {

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

    RectangularPushButton.call( this, {
      content: sample,
      xMargin: 0,
      yMargin: 0,
      listener: () => {
        scaleProperty.value = Math.max(
          Math.min( scaleProperty.value + ( isIncrease ? step : -step ), range.max ),
          range.min );
      }
    } );

    const self = this;

    // add disabling effect for buttons
    if ( isIncrease ) {

      // plus button
      scaleProperty.link( scaleValue => self.setEnabled( scaleValue !== range.max ) );
    }
    else {

      // minus button
      scaleProperty.link( scaleValue => self.setEnabled( scaleValue !== range.min ) );
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

  inherit( RectangularPushButton, SliderButton );

  return ScaleSlider;
} );