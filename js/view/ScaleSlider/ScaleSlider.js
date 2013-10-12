/**
 * Copyright 2002-2013, University of Colorado
 * Container for scale slider
 *
 * @author Andrey Zelenkov (Mlearner)
 */


define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SliderLine = require( 'view/ScaleSlider/SliderLine' );
  var SliderButton = require( 'view/ScaleSlider/SliderButton' );

  function ScaleSlider( model, x, y, options ) {
    Node.call( this, {x: x, y: y, scale: 0.8} );

    // add plus button
    this.addChild( new SliderButton( 0, 0, model, options.range, options.step, true ) );

    // add slide line
    this.addChild( new SliderLine( 0, 34, 150, model.scaleProperty, options.range ) );

    // add minus button
    this.addChild( new SliderButton( 0, 190, model, options.range, options.step, false ) );
  }

  inherit( Node, ScaleSlider );

  return ScaleSlider;
} );