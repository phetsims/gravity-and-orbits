// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for measuring tape
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );

  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  var measuringTapeImg = require( 'image!GRAVITY_AND_ORBITS/measuringTape.svg' );
  var Image = require( 'SCENERY/nodes/Image' );

  var thousandMilesString = require( 'string!GRAVITY_AND_ORBITS/thousandMiles' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FONT = new PhetFont( 16 );

  // options for planet modes
  var options = [
    {
      x: 0,
      y: 75,
      tipX: 119.5,
      tipY: 0,
      scale: 1,
      lengthDefault: 119.5,
      length: 119.5,
      valueDefault: 50000,
      value: 50000,
      precision: 0
    },
    {
      x: 0,
      y: 75,
      tipX: 119.5,
      tipY: 0,
      scale: 1,
      lengthDefault: 119.5,
      length: 119.5,
      valueDefault: 50000,
      value: 50000,
      precision: 0
    },
    {
      x: 0,
      y: 125,
      tipX: 85,
      tipY: 0,
      scale: 1,
      lengthDefault: 85,
      length: 85,
      valueDefault: 100,
      value: 100,
      precision: 0
    },
    {
      x: 150,
      y: -175,
      tipX: 85,
      tipY: 0,
      scale: 1,
      lengthDefault: 85,
      length: 85,
      valueDefault: 2,
      value: 2,
      precision: 1
    }
  ];

  function MeasuringTape( model ) {
    var self = this;
    Node.call( this );

    this.mode = model.planetMode;
    this.prevScale = 1;

    this.options = options;

    // add base of tape and not base node
    this.base = new Node( {children: [new Image( measuringTapeImg )], scale: 0.8} );
    this.addChild( this.base );
    this.centerRotation = new Vector2( self.base.getWidth(), self.base.getHeight() );
    this.notBase = new Node();

    // init drag and drop for measuring tape
    var clickYOffset, clickXOffset, angle = 0;
    this.base.cursor = 'pointer';
    this.base.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        var v, h,
          y0 = self.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y,
          x0 = self.globalToParentPoint( e.pointer.point ).x - e.currentTarget.x;

        h = self.centerRotation.timesScalar( Math.cos( angle / 2 ) ).rotated( angle / 2 );
        v = self.centerRotation.plus( h.minus( self.centerRotation ).timesScalar( 2 ) );

        clickYOffset = y0 - v.y;
        clickXOffset = x0 - v.x;
      },
      drag: function( e ) {
        var x = self.globalToParentPoint( e.pointer.point ).x - clickXOffset;
        var y = self.globalToParentPoint( e.pointer.point ).y - clickYOffset;
        self.translate( x, y );
      }
    } ) );

    // add line
    this.line = new Path( new Shape().moveTo( 0, 0 ).lineTo( 0, 0 ), {stroke: 'gray', lineWidth: 2} );
    this.notBase.addChild( this.line );

    // add center point
    var size = 5;
    this.mediator = new Path( new Shape().moveTo( -size, 0 ).lineTo( size, 0 ).moveTo( 0, -size ).lineTo( 0, size ), {stroke: '#E05F20', lineWidth: 2} );
    this.notBase.addChild( this.mediator );

    // add tip
    this.tip = new Node( {children: [new Circle( 15, {fill: 'rgba(0,0,0,0)'} ), new Path( new Shape().moveTo( -size, 0 ).lineTo( size, 0 ).moveTo( 0, -size ).lineTo( 0, size ), {stroke: '#E05F20', lineWidth: 2} )]} );
    this.tip.cursor = 'pointer';
    this.notBase.addChild( this.tip );

    // init drag and drop for tip
    this.tip.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        clickYOffset = self.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y;
        clickXOffset = self.globalToParentPoint( e.pointer.point ).x - e.currentTarget.x;
      },
      drag: function( e ) {
        var y = self.globalToParentPoint( e.pointer.point ).y - clickYOffset;
        var x = self.globalToParentPoint( e.pointer.point ).x - clickXOffset;
        self.rotate( -angle );
        angle = Math.atan2( y, x );
        self.rotate( angle );
        self.setTip( x, y );
      }
    } ) );

    // add text
    this.text = new Text( '', { font: FONT, fontWeight: 'bold', fill: 'white', pickable: false, x: -75, y: 20} );
    this.notBase.addChild( this.text );

    this.addChild( this.notBase );


    // add observers
    model.tapeProperty.link( function( flag ) {
      self.flag = flag;
      self.setVisible( flag );
    } );

    model.viewModeProperty.link( function( mode ) {
      if ( model.viewModes[0] === mode ) { // cartoon
        self.setVisible( false );
      }
      else if ( model.viewModes[1] === mode && self.flag ) { // scale
        self.setVisible( true );
      }
    } );

    model.planetModeProperty.link( function( mode ) {
      self.options[self.mode].lengthDefault *= 1 / self.prevScale;
      self.mode = mode;
      self.options[mode].lengthDefault = options[self.mode].lengthDefault * self.prevScale;
      self.init( self.options[mode], angle );
      angle = 0;
    } );

    model.scaleProperty.link( function( newScale ) {
      self.scale( newScale );
    } );
  }

  return inherit( Node, MeasuringTape, {
    init: function( option, angle ) {
      this.rotate( -angle );
      this.translate( option.x, option.y );
      this.setTip( option.lengthDefault, 0 );
      this.base.setX( -this.centerRotation.x + option.x );
      this.base.setY( -this.centerRotation.y + option.y );
    },
    rotate: function( angle ) {
      this.base.rotateAround( new Vector2( this.notBase.x, this.notBase.y ), angle );
    },
    scale: function( scale ) {
      this.options[this.mode].lengthDefault *= 1 / this.prevScale;
      this.options[this.mode].lengthDefault *= scale;
      this.setTip( this.options[this.mode].tipX / this.prevScale, this.options[this.mode].tipY / this.prevScale );
      this.setTip( this.options[this.mode].tipX * scale, this.options[this.mode].tipY * scale );
      this.prevScale = scale;
    },
    setTip: function( x, y ) {
      var option = this.options[this.mode];
      option.length = Math.sqrt( Math.pow( x, 2 ) + Math.pow( y, 2 ) );

      this.line.setShape( new Shape().moveTo( 0, 0 ).lineTo( x, y ) );
      this.text.setText( (option.length / option.lengthDefault * option.valueDefault).toFixed( option.precision ).replace( '.', ',' ) + ' ' + thousandMilesString );
      this.tip.setX( x );
      this.tip.setY( y );
      option.tipX = x;
      option.tipY = y;
    },
    translate: function( x, y ) {
      this.notBase.setX( x );
      this.notBase.setY( y );
    }
  } );
} );