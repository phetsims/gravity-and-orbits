// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of button scale control.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectanglePushButton = require( 'SUN/RectanglePushButton' );

  /**
   * @param {Number} x x-coordinate
   * @param {Number} y y-coordinate
   * @param {model} model
   * @param {range} range working range
   * @param {Number} step step of scale changes
   * @param {Boolean} isIncrease type of button
   * @constructor
   */
  function SliderButton( x, y, model, range, step, isIncrease ) {
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
      model.scale = Math.max( Math.min( model.scale + (isIncrease ? step : -step), range.max ), range.min );
    };

    // create button
    this.addChild( new RectanglePushButton( sample,
      {
        rectangleXMargin: 0,
        rectangleYMargin: 0,
        listener: callback
      } ) );
  }

  return inherit( Node, SliderButton );
} );