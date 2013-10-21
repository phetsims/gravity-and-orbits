/**
 * Copyright 2002-2013, University of Colorado
 * view for vertical scale slider control
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var LinearFunction = require( 'DOT/LinearFunction' );

  function Slider( x, y, h, targetProperty, value ) {
    Node.call( this, {x: x, y: y} );
    var options = {
        line: {
          width: 3,
          height: h,
          color: 'white'
        },
        track: {
          width: 30,
          height: 20,
          arcSize: 3,
          options: {fill: 'gray', stroke: "#000", lineWidth: 3 }
        }
      };

    // add line
    this.addChild( new Rectangle( -options.line.width / 2, -( options.track.options.lineWidth ? options.track.options.lineWidth / 2 : 0), options.line.width, options.line.height, {fill: options.line.color } ) );

    var track = new Node( {children: [new Rectangle( -options.track.width / 2, 0, options.track.width, options.track.height, options.track.arcSize, options.track.arcSize, options.track.options ), new Rectangle( -(options.track.width - 8) / 2, options.track.height / 2, options.track.width - 8, 1, {fill: 'black' } )], cursor: 'pointer'} );

    var realY,
      yMin = 0,
      yMax = h - track.height;

    var valueToPosition = new LinearFunction( value.min, value.max, yMax, yMin, true ),
      positionToValue = new LinearFunction( yMax, yMin, value.min, value.max, true );
    this.addChild( track );
    track.addInputListener( new SimpleDragHandler(
      {
        start: function() {
          realY = track.y;
        },
        translate: function( event ) {
          realY += event.delta.y;
          var value = positionToValue( Math.max( yMin, Math.min( realY, yMax ) ) );
          targetProperty.set( value );
        }
      } ) );
    targetProperty.link( function( value ) {
      track.y = valueToPosition( value );
    } );
  }

  inherit( Node, Slider );

  return Slider;
} );