// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of single mass slider.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );

  // constants
  var FONT = new PhetFont( 11 );
  var FONTICON = new PhetFont( 14 );
  var MARGIN = 5;
  var TICK_HEIGHT = 14;
  var THUMB_SIZE = new Dimension2( 15, 20 );

  /**
   * @param x {Number} x-coordinate
   * @param y {Number} y-coordinate
   * @param options {Object} options for slider
   * @constructor
   */
  function MassMenuSlider( x, y, options ) {
    var horizontalPartNode = new Node(),
      nodeTick,
      defaultValue;

    options = _.extend(
      {
        tickStep: 0.5,
        title: '',
        property: null,
        range: {min: 0.5, max: 2},
        rounding: 2,
        width: 200,
        height: 50
      }, options );

    Node.call( this, {x: x, y: y} );

    // add ticks
    if ( options.tickStep ) {
      nodeTick = new Node();
      for ( var i = options.range.min; i <= options.range.max; i += options.tickStep ) {
        nodeTick.addChild( new Line(
            (options.width - 2 * MARGIN) * (i - options.range.min) / (options.range.max - options.range.min), -5,
            (options.width - 2 * MARGIN) * (i - options.range.min) / (options.range.max - options.range.min), -TICK_HEIGHT,
          {stroke: 'white', lineWidth: 1} ) );
      }
      horizontalPartNode.addChild( nodeTick );
    }

    // add slider
    horizontalPartNode.addChild( new HSlider( options.property, options.range, {
      trackSize: new Dimension2( options.width - 2 * MARGIN, 2 ),
      thumbSize: THUMB_SIZE,

      // custom thumb
      thumbFillEnabled: '#98BECF',
      thumbFillHighlighted: '#B3D3E2'
    } ) );

    // add slider
    horizontalPartNode.setTranslation( MARGIN, options.height - 20 );
    var slider = new Node( {children: [
      new Rectangle( 0, 0, options.width, options.height, {} ),
      horizontalPartNode,
      new Text( options.title, {centerX: options.width / 2.875, top: 0, font: FONT, fill: '#fff', pickable: false} )
    ], y: 5} );
    this.addChild( slider );

    // add label
    var label = new HBox( {spacing: 7, x: 50, children: [
      new Text( options.icon.text, { font: FONTICON, fontWeight: 'bold', fill: '#fff', pickable: false} ),
      new options.icon.image( {x: options.width / 1.6, y: -7}, 7 )
    ]} );
    this.addChild( label );

    // add observer. But round the value and snap to the default if within a small range
    defaultValue = options.property.get();
    options.property.link( function( value ) {
      options.property.set( round( value, options.rounding ) );
      // snap to default value
      if ( Math.abs( value - defaultValue ) / defaultValue < 0.03 ) {
        options.property.set( defaultValue );
      }
    } );
  }

  // rounding function
  var round = function( value, rounding ) {
    return (rounding ? Math.round( value * Math.pow( 10, rounding ) ) / Math.pow( 10, rounding ) : value );
  };

  return inherit( Node, MassMenuSlider );
} );