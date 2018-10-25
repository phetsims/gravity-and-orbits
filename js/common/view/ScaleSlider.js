// Copyright 2018, University of Colorado Boulder

/**
 * Container for scale slider. This file is not a direct port from the Java version.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis
 */


define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Range = require( 'DOT/Range' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Shape = require( 'KITE/Shape' );
  var VSlider = require( 'SUN/VSlider' );

  // constants
  var TRACK_SIZE = new Dimension2( 140, 3 );
  var THUMB_SIZE = new Dimension2( 20, 28 );
  var RANGE = new Range( 0.5, 1.5 );
  var STEP = 0.1;
  var BUTTON_SIZE = 25;

  /**
   * @param {Property.<number>} scaleProperty - Scale property for observing and updating.
   * @param {Object} [options]
   * @constructor
   */
  function ScaleSlider( scaleProperty, options ) {

    options = _.extend( { scale: 0.8 }, options );

    Node.call( this );

    var verticalSlider = new VSlider( scaleProperty, RANGE, {
      trackSize: TRACK_SIZE,
      thumbSize: THUMB_SIZE,

      // custom thumb colors
      thumbFillEnabled: '#98BECF',
      thumbFillHighlighted: '#B3D3E2'
    } );

    verticalSlider.translate( -TRACK_SIZE.width - THUMB_SIZE.width - 17, -TRACK_SIZE.height / 2 );

    // add slide line
    this.addChild( verticalSlider );

    //Add buttons last so their hit areas will be in front for overlapping touch areas on touch devices

    // add plus button
    var plusButton = new SliderButton( scaleProperty, RANGE, STEP, true );
    plusButton.x = -BUTTON_SIZE / 2;
    this.addChild( plusButton );

    // add minus button
    var minusButton = new SliderButton( scaleProperty, RANGE, STEP, false );
    minusButton.x = -BUTTON_SIZE / 2;
    minusButton.y = 190;
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
    var sample = new Node( {
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
      listener: function() {
        scaleProperty.value = Math.max(
          Math.min( scaleProperty.value + (isIncrease ? step : -step), range.max ),
          range.min );
      }
    } );

    var self = this;

    // add disabling effect for buttons
    if ( isIncrease ) {
      // plus button
      scaleProperty.link( function( scaleValue ) {
        self.enabled = (scaleValue !== range.max);
      } );
    }
    else {
      // minus button
      scaleProperty.link( function( scaleValue ) {
        self.enabled = (scaleValue !== range.min);
      } );
    }

    // Increase the touch area in all directions except toward the slider knob,
    // so that they won't interfere too much on touch devices
    var dilationSize = 15;
    var dilateTop = ( isIncrease ) ? dilationSize : 0;
    var dilateBottom = ( isIncrease ) ? 0 : dilationSize;
    this.touchArea = Shape.bounds( new Bounds2(
      this.localBounds.minX - dilationSize,
      this.localBounds.minY - dilateTop,
      this.localBounds.maxX + dilationSize,
      this.localBounds.maxY + dilateBottom ) );
  }

  gravityAndOrbits.register( 'ScaleSlider.Sliderbutton', SliderButton );

  inherit( RectangularPushButton, SliderButton );

  return ScaleSlider;
} );