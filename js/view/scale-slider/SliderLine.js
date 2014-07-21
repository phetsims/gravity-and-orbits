// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for vertical scale slider control
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );

  // constants
  var TRACK_SIZE = new Dimension2( 140, 3 );
  var THUMB_SIZE = new Dimension2( 20, 28 );

  /**
   * @param targetProperty {Property} property for updating
   * @param range {range} range for targetProperty
   * @param x {Number} x-coordinate
   * @param y {Number} y-coordinate
   */
  function SliderLine( targetProperty, range, x, y ) {
    HSlider.call( this, targetProperty, range, {
      trackSize: TRACK_SIZE,
      thumbSize: THUMB_SIZE,
      // custom thumb
      thumbFillEnabled: '#98BECF',
      thumbFillHighlighted: '#B3D3E2'
    } );

    this.rotate( -Math.PI / 2 );
    this.translate( -TRACK_SIZE.width - THUMB_SIZE.width - x, -TRACK_SIZE.height / 2 - y );
  }

  return inherit( HSlider, SliderLine );
} );