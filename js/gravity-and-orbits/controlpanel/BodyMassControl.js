// Copyright 2002-2015, University of Colorado

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
  var Image = require( 'SCENERY/nodes/Image' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Line = require( 'SCENERY/nodes/Line' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Panel = require( 'SUN/Panel' );
  var HSlider = require( 'SUN/HSlider' );
  var Vector2 = require( 'DOT/Vector2' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Property = require( 'AXON/Property' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Body = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/Body' );
  var BodyNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/BodyNode' );
  var MassMenuSlider = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/controlpanel/right-control-panel/mass-menu/MassMenuSlider' );
  var GravityAndOrbitsCanvas = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/GravityAndOrbitsCanvas' );

  var BACKGROUND = new Color( 3, 0, 133 );
  var FOREGROUND = Color.WHITE;
  var CONTROL_FONT = new PhetFont( 16 );
  var STAGE_SIZE = GravityAndOrbitsCanvas.STAGE_SIZE;

  var VIEW_MIN = 0;
  //max value that the slider can take internally (i.e. the resolution of the slider)
  var VIEW_MAX = 100000;
  //Percentage of the range the slider must be in to snap to a named label tick

  //private
  var SNAP_TOLERANCE = 0.08;

  var THUMB_SIZE = new Dimension2( 15, 20 );
  var MARGIN = 5;
  var TICK_HEIGHT = 14;
  var NUM_TICKS = 4;

  /**
   *
   * @param {Body} body
   * @param {number} min
   * @param {number} max
   * @param {number} labelValue
   * @param {string} valueLabel
   * @param whiteBackgroundProperty
   * @constructor
   */
  function BodyMassControl( body, min, max, labelValue, valueLabel, whiteBackgroundProperty ) {

    var updatingSlider = false;

    //for showing a label for a specific body such as "earth"
    var modelToView = new LinearFunction( min, max, VIEW_MIN, VIEW_MAX );

    var label = new Text( body.getName(), {
      font: CONTROL_FONT,
      fill: FOREGROUND
    } );

    var bodyNode = new BodyNode(
      body,
      new Property( ModelViewTransform2.createSinglePointScaleInvertedYMapping(
        new Vector2( 0, 0 ),
        new Vector2( STAGE_SIZE.width * 0.30, STAGE_SIZE.height * 0.5 ),
        1E-9 ) ),
      null,
      -Math.PI / 4,
      whiteBackgroundProperty
    );
    //var image = bodyNode.renderImage( 25 );
    var image = body.createRenderer( 16 );

    //Top component that shows the body's name and icon
    var content = new HBox( { children: [ label, image ], spacing: 10, left: 20 } );

    body.getMassProperty().link( function( mass ) {
      updatingSlider = true;

      // setting the diameter property took place in Body.setMass() in the Java version, but doesn't work here since
      // the mass itself is set by the slider in this case.
      var radius = Math.pow( 3 * mass / 4 / Math.PI / body.density, 1.0 / 3.0 ); //derived from: density = mass/volume, and volume = 4/3 pi r r r
      body.diameterProperty.set( radius * 2 );
      updatingSlider = false;
    } );

    var WIDTH = 100;

    var ticks = [];

    for( var i = 0; i < NUM_TICKS; i++ ) {
      ticks.push( new Line( 0, 0, 0, 10, { stroke: 'white', lineWidth: 1 } ) );
    }
    var tickBox = new HBox( { children: ticks, spacing: ( WIDTH - NUM_TICKS ) / ( NUM_TICKS - 1 ) } );

    var slider = new HSlider( body.getMassProperty(), { min: min, max: max }, {
      trackSize: new Dimension2( WIDTH, 2 ),
      thumbSize: THUMB_SIZE,

      // custom thumb
      thumbFillEnabled: '#98BECF',
      thumbFillHighlighted: '#B3D3E2'
    } );

    var sliderWithTicksNode = new VBox( { children: [ tickBox, slider ], spacing: -5, resize: false } );

    VBox.call( this, { children: [ content, sliderWithTicksNode ], spacing: 10, resize: false } );
  }

  return inherit( VBox, BodyMassControl, {},
//statics
    {
      VIEW_MIN: VIEW_MIN,
      VIEW_MAX: VIEW_MAX
    } );
} );
