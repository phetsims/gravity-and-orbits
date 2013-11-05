// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for horizontal slider control
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
  var Text = require( 'SCENERY/nodes/Text' );

  function SliderHorizontalPark( x, y, w, targetProperty, img, value, rounding, tick, defaultValue ) {
    Node.call( this, {x: x, y: y} );

    var round = function( value, rounding ) {
      return (rounding ? Math.round( value * Math.pow( 10, rounding ) ) / Math.pow( 10, rounding ) : value );
    };

    var track = new Node( {children: [new Image( img, {centerX: 0, centerY: 0, scale: 0.5} )], cursor: "pointer"} ),
      xMin = 0,
      xMax = w - track.width,
      valueToPosition = new LinearFunction( value.min, value.max, xMin, xMax, true ),
      positionToValue = new LinearFunction( xMin, xMax, value.min, value.max, true ),
      nodeTick = new Node();

    this.addChild( new Path( Shape.lineSegment( 0, 0, w - track.width, 0 ), { stroke: 'white', lineWidth: 3 } ) );

    if ( tick && tick.step ) {
      var i = value.min, tickHeight = 14;

      for ( ; i <= value.max; i += tick.step ) {
        nodeTick.addChild( new Path( Shape.lineSegment( valueToPosition( i ), -5, valueToPosition( i ), -tickHeight ), { stroke: 'white', lineWidth: 1 } ) );
      }
    }
    this.addChild( nodeTick );
    this.addChild( track );
    var dx = 0.25 * track.width,
      dy = 0.5 * track.height,
      realX;
    track.touchArea = Shape.rectangle( ( -track.width / 2 ) - dx, ( -track.height / 2 ) - dy, track.width + dx + dx, track.height + dy + dy );
    track.addInputListener( new SimpleDragHandler(
      {
        allowTouchSnag: true,
        start: function() {
          realX = track.x;
        },
        translate: function( event ) {
          realX += event.delta.x;

          var value = positionToValue( Math.max( xMin, Math.min( realX, xMax ) ) );

          // snap to default value
          if ( Math.abs( value - defaultValue ) / defaultValue < 0.03 ) {
            value = defaultValue;
          }
          value = round( value, rounding );

          targetProperty.set( value );
        }
      } ) );
    targetProperty.link( function( value ) {
      track.x = valueToPosition( value );
    } );
    this.x += track.width / 2;
  }

  inherit( Node, SliderHorizontalPark );

  return SliderHorizontalPark;
} );