// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of measuring tape.
 * Each planet mode use its scale.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // images
  var measuringTapeImg = require( 'image!GRAVITY_AND_ORBITS/measuringTape.png' );

  // strings
  var thousandMilesString = require( 'string!GRAVITY_AND_ORBITS/thousandMiles' );
  var thousandKilometersString = require( 'string!GRAVITY_AND_ORBITS/thousandKilometers' );

  // constants
  var FONT = new PhetFont( 16 );

  // options for planet modes
  var options = [
    {
      x: 0,
      y: 75,
      tipX: 119.5,
      tipY: 0,
      scale: 1,
      length: 119.5,
      value: 50000,
      precision: 0
    },
    {
      x: 0,
      y: 75,
      tipX: 119.5,
      tipY: 0,
      scale: 1,
      length: 119.5,
      value: 50000,
      precision: 0
    },
    {
      x: 0,
      y: 125,
      tipX: 85,
      tipY: 0,
      scale: 1,
      length: 85,
      value: 100,
      precision: 0
    },
    {
      x: 150,
      y: -175,
      tipX: 85,
      tipY: 0,
      scale: 1,
      length: 63.5,
      value: 2,
      precision: 1
    }
  ];

  /**
   * @param model {PropertySet} Contains set of properties. Instance of PropertySet class. General model for the whole application.
   */
  function MeasuringTape( model ) {
    var measuringTape = this;
    Node.call( this );

    this.mode = model.planetMode;
    this.prevScale = 1;

    options.forEach( function( planetModeOption ) {
      // NOTE: 'valueDefault' and 'lengthDefault' need for correct calculation of distance after scaling tape:
      // during scaling length of tape changing but appropriate value stay the same
      planetModeOption.valueDefault = planetModeOption.value / ( model.isTapeUnitsMiles ? 1 : model.CONSTANTS.METERS_PER_MILE * 1000);
      planetModeOption.lengthDefault = planetModeOption.length;
    } );

    this.string = model.isTapeUnitsMiles ? thousandMilesString : thousandKilometersString;

    // add base of tape and not base node
    this.base = new Node( {children: [new Image( measuringTapeImg )], scale: 0.8} );
    this.addChild( this.base );
    this.centerRotation = new Vector2( measuringTape.base.getWidth(), measuringTape.base.getHeight() );
    this.notBase = new Node();

    // init drag and drop for measuring tape
    var clickYOffset, clickXOffset, angle = 0, v, currentlyDragging = '';
    this.base.cursor = 'pointer';
    this.base.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        currentlyDragging = 'base';
        var h,
          y0 = measuringTape.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y,
          x0 = measuringTape.globalToParentPoint( e.pointer.point ).x - e.currentTarget.x;

        h = measuringTape.centerRotation.timesScalar( Math.cos( angle / 2 ) ).rotated( angle / 2 );
        v = measuringTape.centerRotation.plus( h.minus( measuringTape.centerRotation ).multiply( 2 ) );

        clickYOffset = y0 - v.y;
        clickXOffset = x0 - v.x;
      },
      drag: function( e ) {
        if ( currentlyDragging !== 'base' ) {return;}
        var x = measuringTape.globalToParentPoint( e.pointer.point ).x - clickXOffset;
        var y = measuringTape.globalToParentPoint( e.pointer.point ).y - clickYOffset;
        measuringTape.translate( x, y, v );
      }
    } ) );

    // add line
    this.line = new Line( 0, 0, 0, 0, {stroke: 'gray', lineWidth: 2} );
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
        currentlyDragging = 'tip';
        clickYOffset = measuringTape.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y;
        clickXOffset = measuringTape.globalToParentPoint( e.pointer.point ).x - e.currentTarget.x;
      },
      drag: function( e ) {
        if ( currentlyDragging !== 'tip' ) {return;}
        var y = measuringTape.globalToParentPoint( e.pointer.point ).y - clickYOffset;
        var x = measuringTape.globalToParentPoint( e.pointer.point ).x - clickXOffset;
        // return to previous angle
        measuringTape.rotate( -angle );

        // set new angle
        angle = Math.atan2( y, x );
        measuringTape.rotate( angle );
        measuringTape.setTip( x, y );
      }
    } ) );

    // add text
    this.text = new Text( '', { font: FONT, fontWeight: 'bold', fill: 'white', pickable: false, x: -75, y: 20} );
    this.notBase.addChild( this.text );

    this.addChild( this.notBase );


    if ( model.viewModes[0] === model.viewMode ) { // cartoon
      measuringTape.setVisible( false );
    }
    else if ( model.viewModes[1] === model.viewMode && model.tape ) { // scale
      measuringTape.setVisible( true );
    }

    // add observers
    model.tapeProperty.linkAttribute( this, 'visible' );

    model.planetModeProperty.link( function( mode ) {
      options[measuringTape.mode].lengthDefault *= 1 / measuringTape.prevScale;
      measuringTape.mode = mode;
      options[mode].lengthDefault = options[measuringTape.mode].lengthDefault * measuringTape.prevScale;
      measuringTape.resetTape( options[mode], angle );
      angle = 0;
    } );

    model.scaleProperty.link( function( newScale ) {
      measuringTape.scale( newScale );
    } );
  }

  return inherit( Node, MeasuringTape, {
    // init tape for new planet mode
    resetTape: function( option, angle ) {
      this.rotate( -angle );
      this.translate( option.x, option.y );
      this.setTip( option.lengthDefault, 0 );
      this.base.setTranslation( -this.centerRotation.x + option.x, -this.centerRotation.y + option.y );
    },
    // return text for current planet mode
    getText: function() {
      var option = options[this.mode];
      return (option.length / option.lengthDefault * option.valueDefault).toFixed( option.precision ) + ' ' + this.string;
    },
    rotate: function( angle ) {
      this.base.rotateAround( new Vector2( this.notBase.x, this.notBase.y ), angle );
    },
    scale: function( scale ) {
      options[this.mode].lengthDefault *= 1 / this.prevScale;
      options[this.mode].lengthDefault *= scale;
      this.setTip( options[this.mode].tipX / this.prevScale, options[this.mode].tipY / this.prevScale );
      this.setTip( options[this.mode].tipX * scale, options[this.mode].tipY * scale );
      this.prevScale = scale;
    },
    setTip: function( x, y ) {
      var option = options[this.mode];
      option.length = Math.sqrt( Math.pow( x, 2 ) + Math.pow( y, 2 ) );

      this.line.setPoint2( x, y );
      this.text.setText( this.getText() );
      this.tip.setTranslation( x, y );
      option.tipX = x;
      option.tipY = y;
    },
    translate: function( x, y, v ) {
      this.notBase.setTranslation( x, y );

      v = v || new Vector2( 0, 0 );
      this.base.setTranslation( x - v.x, y - v.y );
    }
  } );
} );