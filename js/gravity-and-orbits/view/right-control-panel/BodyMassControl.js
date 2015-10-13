// Copyright 2002-2015, University of Colorado Boulder

/**
 * This control allows the user to view and change the mass of certain Body instances, which also changes the radius.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Line = require( 'SCENERY/nodes/Line' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsColorProfile' );

  // constants
  var CONTROL_FONT = new PhetFont( 14 );
  var VIEW_MIN = 0;
  var VIEW_MAX = 100000; // max value that the slider can take internally (i.e. the resolution of the slider)
  var SNAP_TOLERANCE = 0.03;
  var THUMB_SIZE = new Dimension2( 15, 20 );
  var NUM_TICKS = 4;
  var WIDTH = 180;
  var SPACING = ( WIDTH - NUM_TICKS ) / ( NUM_TICKS - 1 );

  /**
   *
   * @param {Body} body
   * @param {number} min
   * @param {number} max
   * @param {number} labelValue
   * @param {string} valueLabel
   * @constructor
   */
  function BodyMassControl( body, min, max, labelValue, valueLabel ) {

    var label = new Text( body.name, {
      font: CONTROL_FONT,
      fontWeight: 'bold',
      fill: GravityAndOrbitsColorProfile.panelTextProperty
    } );

    var image = body.createRenderer( 14 );

    // Top component that shows the body's name and icon
    var content = new HBox( { centerX: SPACING, children: [ label, image ], spacing: 10 } );

    var smallLabel = new Text( valueLabel, {
      top: content.bottom,
      centerX: SPACING,
      font: new PhetFont( 11 ),
      fill: GravityAndOrbitsColorProfile.panelTextProperty
    } );

    var ticks = [];
    for ( var i = 0; i < NUM_TICKS; i++ ) {
      ticks.push( new Line( 0, 0, 0, 10, { lineWidth: 1, stroke: GravityAndOrbitsColorProfile.panelTextProperty } ) );
    }
    var tickBox = new HBox( { children: ticks, spacing: SPACING } );

    var slider = new HSlider( body.massProperty, { min: min, max: max }, {
      trackSize: new Dimension2( WIDTH, 2 ),
      thumbSize: THUMB_SIZE,

      // custom thumb
      thumbFillEnabled: '#98BECF',
      thumbFillHighlighted: '#B3D3E2'
    } );

    var sliderWithTicksNode = new VBox( {
      children: [ tickBox, slider ],
      spacing: -5,
      resize: false,
      top: smallLabel.bottom + 5
    } );

    Node.call( this, { children: [ content, smallLabel, sliderWithTicksNode ] } );

    body.massProperty.link( function( mass ) {

      // setting the diameter property took place in Body.setMass() in the Java version, but doesn't work here since
      // the mass itself is set by the slider in this case.
      // derived from: density = mass/volume, and volume = 4/3 pi r r r
      var radius = Math.pow( 3 * mass / 4 / Math.PI / body.density, 1 / 3 );
      body.diameterProperty.set( radius * 2 );

      // snap to default value if close
      if ( Math.abs( mass - labelValue ) / labelValue < SNAP_TOLERANCE ) {
        body.massProperty.set( labelValue );
      }
    } );
  }

  return inherit( Node, BodyMassControl, {},

    // statics
    {
      VIEW_MIN: VIEW_MIN,
      VIEW_MAX: VIEW_MAX
    } );
} );
