// Copyright 2002-2013, University of Colorado Boulder

/**
 * Horizontal part of mass slider.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );

  /**
   * @param {Number} x x-coordinate
   * @param {Number} y y-coordinate
   * @param {Number} w width of slider
   * @param {Property} targetProperty property to update
   * @param {range} range working range
   * @param {Number} rounding precision
   * @param {Number} tickStep tick step
   * @constructor
   */
  function SliderHorizontalPark( x, y, w, targetProperty, range, rounding, tickStep ) {
    var defaultValue = targetProperty.get(), nodeTick = new Node(), i, tickHeight = 14;
    Node.call( this, {x: x, y: y} );

    var options = {
      line: {
        height: w,
        width: 2
      },
      track: {
        height: 15,
        width: 20
      }
    };

    // add slider
    this.addChild( new HSlider( targetProperty, range, {
      trackSize: new Dimension2( options.line.height, options.line.width ),
      thumbSize: new Dimension2( options.track.height, options.track.width )
    } ) );

    // add ticks
    if ( tickStep ) {
      for ( i = range.min; i <= range.max; i += tickStep ) {
        nodeTick.addChild( new Path( Shape.lineSegment( w * (i - range.min) / (range.max - range.min), -5, w * (i - range.min) / (range.max - range.min), -tickHeight ), { stroke: 'white', lineWidth: 1 } ) );
      }
      this.addChild( nodeTick );
    }

    // rounding function
    var round = function( value, rounding ) {
      return (rounding ? Math.round( value * Math.pow( 10, rounding ) ) / Math.pow( 10, rounding ) : value );
    };

    // add observer
    targetProperty.link( function( value ) {
      targetProperty.set( round( value, rounding ) );
      // snap to default value
      if ( Math.abs( value - defaultValue ) / defaultValue < 0.03 ) {
        targetProperty.set( defaultValue );
      }
    } );
  }

  inherit( Node, SliderHorizontalPark );

  return SliderHorizontalPark;
} );