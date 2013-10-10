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

  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FONT = new PhetFont( 22 );

  function VelocityArrows( model ) {
    var self = this, prevPosition = {};
    Node.call( this );

    this.init( model );

    // find max velocity for all modes
    this.maxVelocity = [];
    for ( var i = 0; i < model.planetModes.length; i++ ) {
      this.maxVelocity[i] = getMaxVelocity( model, i );
    }

    var checkArrows = function() {
      self[(self.flag ? 'show' : 'hide') + 'Arrows']( model );
    };

    model.spaceObjects.forEach( function( el ) {
      prevPosition[el] = model[el + 'Position'];
      model[el + 'PositionProperty'].link( function( newPosition ) {
        if ( newPosition.minus( prevPosition[el] ).magnitude() > 1 ) {
          prevPosition[el] = newPosition;
          checkArrows();
        }
      } );
    } );

    model.velocityArrowProperty.link( function( flag ) {
      self.flag = flag;
      checkArrows();
    } );

    model.planetModeProperty.link( function() {
      checkArrows();
    } );
  }

  inherit( Node, VelocityArrows );

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

  VelocityArrows.prototype.init = function( model ) {
    var self = this;
    this.arrows = {};
    model.spaceObjects.forEach( function( el ) {
      self.arrows[el] = {
        view: new Node(),
        circle: new Circle( 18, {
          fill: 'rgba(0,0,0,0)',
          stroke: '#C0C0C0',
          lineWidth: 3
        } ),
        text: new Text( 'v', { font: FONT, fontWeight: 'bold', fill: '#808080', pickable: false } ),
        arrowNode: new Node()
      };

      self.arrows[el].view.addChild( self.arrows[el].circle );
      self.arrows[el].view.addChild( self.arrows[el].text );
      self.arrows[el].view.addChild( self.arrows[el].arrowNode );
      self.arrows[el].view.setVisible( false );
      self.addChild( self.arrows[el].view );
    } );
  };

  VelocityArrows.prototype.hideArrows = function( model ) {
    var self = this;
    model.spaceObjects.forEach( function( el ) {
      self.arrows[el].view.setVisible( false );
    } );
  };

  VelocityArrows.prototype.setArrow = function( model, obj, x, y ) {
    this.arrows[obj].circle.setX( x );
    this.arrows[obj].circle.setY( y );
    this.arrows[obj].text.x = x - 6;
    this.arrows[obj].text.y = y + 2;

    this.arrows[obj].arrowNode.removeAllChildren();
    this.arrows[obj].arrowNode.addChild( new ArrowNode( model[obj + 'Position'].x, model[obj + 'Position'].y, x, y, {fill: '#ED1C24'} ) );
  };

  VelocityArrows.prototype.showArrows = function( model ) {
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
      velocity = model[obj + 'Velocity'];
      if ( !mode[obj] || model[obj + 'Exploded'] || !velocity.magnitude() ) {
        self.arrows[obj].view.setVisible( false );
        continue;
      }

      arrowSize = arrowSizeNormal * velocity.magnitude() / maxVelocity;
      arrowSize = Math.max( arrowSize, arrowSizeMin );

      unitVector = velocity.normalized();

      x = model[obj + 'Position'].x + unitVector.x * arrowSize;
      y = model[obj + 'Position'].y + unitVector.y * arrowSize;

      self.setArrow( model, obj, x, y );
      self.arrows[obj].view.setVisible( true );
    }
  };

  return VelocityArrows;
} );