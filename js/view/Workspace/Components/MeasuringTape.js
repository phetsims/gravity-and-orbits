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

  var measuringTapeImg = require( 'image!GRAVITY_AND_ORBITS/../images/measuringTape.svg' );
  var Image = require( 'SCENERY/nodes/Image' );

  var Strings = require( 'Strings' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FONT = new PhetFont( 16 );

  function MeasuringTape( model ) {
    var self = this;
    Node.call( this );

    // options for planet modes
    var options = [
      {
        x: 0,
        y: 75,
        lengthDefault: 119.5,
        length: 119.5,
        valueDefault: 50000,
        value: 50000,
        precision: 0
      },
      {
        x: 0,
        y: 75,
        lengthDefault: 119.5,
        length: 119.5,
        valueDefault: 50000,
        value: 50000,
        precision: 0
      },
      {
        x: 0,
        y: 125,
        lengthDefault: 85,
        length: 85,
        valueDefault: 100,
        value: 100,
        precision: 0
      },
      {
        x: 150,
        y: -175,
        lengthDefault: 85,
        length: 85,
        valueDefault: 2,
        value: 2,
        precision: 1
      }
    ];

    this.options = options.slice( 0 );

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
        // TODO: call setState instead
        self.notBase.setY( self.globalToParentPoint( e.pointer.point ).y - clickYOffset );
        self.notBase.setX( self.globalToParentPoint( e.pointer.point ).x - clickXOffset );
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
    this.tip = new Node( {children: [new Circle( 5, {fill: 'rgba(0,0,0,0)'} ), new Path( new Shape().moveTo( -size, 0 ).lineTo( size, 0 ).moveTo( 0, -size ).lineTo( 0, size ), {stroke: '#E05F20', lineWidth: 2} )]} );
    this.tip.cursor = 'pointer';
    this.notBase.addChild( this.tip );

    // init drag and drop for tip
    this.tip.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        clickYOffset = self.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y;
        clickXOffset = self.globalToParentPoint( e.pointer.point ).x - e.currentTarget.x;
      },
      drag: function( e ) {
        // TODO: call setState instead
        var y = self.globalToParentPoint( e.pointer.point ).y - clickYOffset;
        var x = self.globalToParentPoint( e.pointer.point ).x - clickXOffset;
        var valueDefault = self.options[model.planetMode].valueDefault;
        var precision = self.options[model.planetMode].precision;
        var lengthDefault = self.options[model.planetMode].lengthDefault;
        var length = Math.sqrt( Math.pow( x, 2 ) + Math.pow( y, 2 ) );
        var y1 = self.notBase.y;
        var x1 = self.notBase.x;
        self.base.rotateAround( new Vector2( x1, y1 ), -angle );
        angle = Math.atan2( y, x );
        self.base.rotateAround( new Vector2( x1, y1 ), angle );
        self.line.setShape( new Shape().moveTo( 0, 0 ).lineTo( x, y ) );
        self.text.setText( (length / lengthDefault * valueDefault).toFixed( precision ).replace( '.', ',' ) + ' ' + Strings["GAO.thousandMiles"] );
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
      var option = self.options[mode];
      self.mode = mode;
      setState.call( self, option, angle );
      angle = 0;
    } );

    model.scaleProperty.link( function( newScale, oldScale ) {

    } );
  }

  inherit( Node, MeasuringTape );

  var setState = function( option, angle ) {
    var self = this, x1 = self.notBase.x, y1 = self.notBase.y;
    self.base.rotateAround( new Vector2( x1, y1 ), -angle );
    self.base.setX( -self.centerRotation.x + option.x );
    self.base.setY( -self.centerRotation.y + option.y );
    self.notBase.setX( option.x );
    self.notBase.setY( option.y );
    self.text.setText( (option.length / option.lengthDefault * option.valueDefault).toFixed( option.precision ).replace( '.', ',' ) + ' ' + Strings["GAO.thousandMiles"] );
    self.line.setShape( new Shape().moveTo( 0, 0 ).lineTo( option.lengthDefault, 0 ) );
    self.tip.setX( option.lengthDefault );
    self.tip.setY( 0 );
  };

  return MeasuringTape;
} );