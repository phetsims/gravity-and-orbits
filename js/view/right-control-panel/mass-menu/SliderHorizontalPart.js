// Copyright 2002-2013, University of Colorado Boulder

/**
 * Horizontal part of mass slider.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );

  // constants
  var TICK_HEIGHT = 14;
  var THUMB_SIZE = new Dimension2( 15, 20 );

  /**
   * @param x {Number} x-coordinate
   * @param y {Number} y-coordinate
   * @param w {Number} width of slider
   * @param targetProperty {Property} property to update
   * @param range {range} working range
   * @param rounding {Number} precision of rounding targetProperty
   * @param tickStep {Number} tick step
   * @constructor
   */

  function SliderHorizontalPart( x, y, w, targetProperty, range, rounding, tickStep ) {
    var defaultValue = targetProperty.get(),
      trackSize = new Dimension2( w, 2 ),
      nodeTick;
    Node.call( this, {x: x, y: y} );

    // add ticks
    if ( tickStep ) {
      nodeTick = new Node();
      for ( var i = range.min; i <= range.max; i += tickStep ) {
        nodeTick.addChild( new Path( Shape.lineSegment(
            w * (i - range.min) / (range.max - range.min), -5,
            w * (i - range.min) / (range.max - range.min), -TICK_HEIGHT
        ), { stroke: 'white', lineWidth: 1 } ) );
      }
      this.addChild( nodeTick );
    }

    // add slider
    this.addChild( new HSlider( targetProperty, range, {
      trackSize: trackSize,
      thumbSize: THUMB_SIZE,

      // custom thumb
      thumbFillEnabled: '#98BECF',
      thumbFillHighlighted: '#B3D3E2'
    } ) );

    // rounding function
    var round = function( value, rounding ) {
      return (rounding ? Math.round( value * Math.pow( 10, rounding ) ) / Math.pow( 10, rounding ) : value );
    };

    // add observer. But round the value and snap to the default if within a small range
    targetProperty.link( function( value ) {
      targetProperty.set( round( value, rounding ) );
      // snap to default value
      if ( Math.abs( value - defaultValue ) / defaultValue < 0.03 ) {
        targetProperty.set( defaultValue );
      }
    } );
  }

  return inherit( Node, SliderHorizontalPart );
} );