// Copyright 2002-2013, University of Colorado Boulder

/**
 * Container for scale slider.
 *
 * @author Andrey Zelenkov (Mlearner)
 */


define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SliderButton = require( 'view/scale-slider/SliderButton' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );

  // constants
  var TRACK_SIZE = new Dimension2( 140, 3 );
  var THUMB_SIZE = new Dimension2( 20, 28 );

  /**
   * @param scaleProperty {Property} scale property for observing and updating
   * @param x {Number} x-coordinate
   * @param y {Number} y-coordinate
   * @constructor
   */
  function ScaleSlider( scaleProperty, x, y ) {
    var options = {
      range: {max: 1.5, min: 0.5},
      step: 0.1
    };
    Node.call( this, {x: x, y: y, scale: 0.63} );

    var verticalSlider = new HSlider( scaleProperty, options.range, {
      trackSize: TRACK_SIZE,
      thumbSize: THUMB_SIZE,

      // custom thumb colors
      thumbFillEnabled: '#98BECF',
      thumbFillHighlighted: '#B3D3E2'
    } );

    verticalSlider.rotate( -Math.PI / 2 );
    verticalSlider.translate( -TRACK_SIZE.width - THUMB_SIZE.width - 17, -TRACK_SIZE.height / 2 - 0 );

    // add slide line
    this.addChild( verticalSlider );

    //Add buttons last so their hit areas will be in front for overlapping touch areas on touch devices

    // add plus button
    this.addChild( new SliderButton( 0, 0, scaleProperty, options.range, options.step, true ) );

    // add minus button
    this.addChild( new SliderButton( 0, 190, scaleProperty, options.range, options.step, false ) );
  }

  return inherit( Node, ScaleSlider );
} );