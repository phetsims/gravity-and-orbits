// Copyright 2002-2013, University of Colorado Boulder

/**
 * velocity arrows view
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  var Strings = require( 'Strings' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FONT = new PhetFont( 22 );

  function VelocityArrows( model ) {
    var self = this, prevPosition = {};
    Node.call( this );

    // find max velocity for all modes
    this.maxVelocity = [];
    for ( var i = 0; i < model.planetModes.length; i++ ) {
      this.maxVelocity[i] = getMaxVelocity( model, i );
    }

    var drawArrows = function() {
      self.removeAllChildren();
      if ( self.flag ) {
        self.addArrows( model );
      }
    };

    model.spaceObjects.forEach( function( el ) {
      prevPosition[el] = model[el + 'Position'];
      model[el + 'PositionProperty'].link( function( newPosition ) {
        if ( newPosition.minus( prevPosition[el] ).magnitude() > 1 ) {
          prevPosition[el] = newPosition;
          drawArrows();
        }
      } );
    } );

    model.velocityArrowProperty.link( function( flag ) {
      self.flag = flag;
      drawArrows();
    } );

    model.planetModeProperty.link( function() {
      drawArrows();
    } );
  }

  inherit( Node, VelocityArrows );

  VelocityArrows.prototype.addArrows = function( model ) {
    var self = this,
      num = model.planetMode,
      maxVelocity = self.maxVelocity[num],
      mode = model.planetModes[num],
      arrowSize = 0,
      arrowSizeMin = 10,
      arrowSizeNormal = 160,
      len = model.spaceObjects.length,
      velocity,
      obj, x, y,
      unitVector;

    for ( var i = 0; i < len; i++ ) {
      obj = model.spaceObjects[i];
      if ( !mode[obj] || mode[obj + 'Exploded'] ) {continue;}
      velocity = model[obj + 'Velocity'];
      if ( !velocity.magnitude() ) {continue;}

      arrowSize = arrowSizeNormal * velocity.magnitude() / maxVelocity;
      arrowSize = Math.max( arrowSize, arrowSizeMin );

      unitVector = velocity.normalized();

      x = model[obj + 'Position'].x + unitVector.x * arrowSize;
      y = model[obj + 'Position'].y + unitVector.y * arrowSize;
      self.addChild( new Circle( 18, {
        x: x, y: y - 6,
        fill: 'rgba(0,0,0,0)',
        stroke: '#C0C0C0',
        lineWidth: 3
      } ) );
      self.addChild( new Text( Strings["GAO.v"], { font: FONT, fontWeight: 'bold', fill: '#808080', pickable: false, x: x - 7, y: y + 2 } ) );
      self.addChild( new ArrowNode( model[obj + 'Position'].x, model[obj + 'Position'].y, x, y, {fill: '#ED1C24'} ) );
    }
  };

  var getMaxVelocity = function( model, num ) {
    var mode = model.planetModes[num], obj, len = model.spaceObjects.length, i, v, maxVelocity = 1;
    for ( i = 0; i < len; i++ ) {
      obj = model.spaceObjects[i];
      if ( !mode[obj] || !mode[obj].velocity ) {continue;}
      v = Math.sqrt( Math.pow( mode[obj].velocity.x, 2 ) + Math.pow( mode[obj].velocity.y, 2 ) );
      maxVelocity = Math.max( v, maxVelocity );
    }
    return maxVelocity;
  };

  return VelocityArrows;
} );