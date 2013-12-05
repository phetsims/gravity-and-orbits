// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of single mass slider.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var HorizontalSlider = require( 'view/right-control-panel/mass-menu/SliderHorizontalPart' );

  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var HBox = require( 'SCENERY/nodes/HBox' );

  var FONT = new PhetFont( 11 );
  var FONTICON = new PhetFont( 14 );

  function Slider( x, y, options ) {
    options = _.extend(
      {
        tickStep: 0.5,
        title: '',
        property: null,
        scope: {min: 0.5, max: 2},
        rounding: 2,
        width: 200,
        height: 50
      }, options );

    Node.call( this, {x: x, y: y} );

    // add slider
    var slider = new Node( {children: [
      new Rectangle( 0, 0, options.width, options.height, {} ),
      new HorizontalSlider( 5, options.height - 20, options.width - 10, options.property, options.scope, options.rounding, options.tickStep ),
      new Text( options.title, {centerX: options.width / 2.7, top: 0, font: FONT, fill: '#fff', pickable: false} )
    ], y: 5} );
    this.addChild( slider );

    // add label
    var label = new HBox( {spacing: 7, x: 50, children: [
      new Text( options.icon.text, { font: FONTICON, fontWeight: 'bold', fill: '#fff', pickable: false} ),
      new options.icon.image( {x: options.width / 1.6, y: -7}, 7 )
    ]} );
    this.addChild( label );
  }

  return inherit( Node, Slider );
} );