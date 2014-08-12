// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of button scale control.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Shape = require( 'KITE/Shape' );
  var Bounds2 = require( 'DOT/Bounds2' );

  /**
   * @param {Number} x x-coordinate
   * @param {Number} y y-coordinate
   * @param {Property} scaleProperty - Scale property for updating.
   * @param {Range} range - Working range of slider.
   * @param step {Number} step of scale changes
   * @param isIncrease {Boolean} flag for defining type of button
   * @constructor
   */
  function SliderButton( x, y, scaleProperty, range, step, isIncrease ) {
    var callback, sample, width = 25, height = 25;
    Node.call( this, {x: x - width / 2, y: y} );

    // create default view
    sample = new Node( {children: [new Rectangle( 0, 0, width, height, 2, 2, {fill: '#DBD485'} ), new Rectangle( 4, height / 2 - 1, width - 8, 2, {fill: 'black'} )]} );

    // increase or decrease view
    if ( isIncrease ) {
      sample.addChild( new Rectangle( width / 2 - 1, 4, 2, height - 8, {fill: 'black'} ) );
    }

    // callback (can be optimized by splitting to two functions)
    callback = function() {
      scaleProperty.value = Math.max( Math.min( scaleProperty.value + (isIncrease ? step : -step), range.max ), range.min );
    };

    // create button
    var button;
    this.addChild( button = new RectangularPushButton( {
      content: sample,
      xMargin: 0,
      yMargin: 0,
      listener: callback
    } ) );

    // add disabling effect for buttons
    if ( isIncrease ) {
      // plus button
      scaleProperty.link( function( scaleValue ) {
        button.enabled = (scaleValue !== range.max);
      } );
    }
    else {
      // minus button
      scaleProperty.link( function( scaleValue ) {
        button.enabled = (scaleValue !== range.min);
      } );
    }

    //Increase the touch area in all directions except toward the slider knob, so that they won't interfere too much on touch devices
    var dilationSize = 15,
      dilateLeft = dilationSize,
      dilateRight = dilationSize,
      dilateTop = isIncrease ? dilationSize : 0,
      dilateBottom = isIncrease ? 0 : dilationSize;
    this.touchArea = Shape.bounds( new Bounds2( this.localBounds.minX - dilateLeft, this.localBounds.minY - dilateTop, this.localBounds.maxX + dilateRight, this.localBounds.maxY + dilateBottom ) );
  }

  return inherit( Node, SliderButton );
} );