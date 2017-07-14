// Copyright 2014-2015, University of Colorado Boulder

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
  var Text = require( 'SCENERY/nodes/Text' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  // constants
  var SNAP_TOLERANCE = 0.03;
  var THUMB_SIZE = new Dimension2( 14, 24 );
  var NUM_TICKS = 4;
  var WIDTH = 180;
  var SPACING = ( WIDTH - NUM_TICKS ) / ( NUM_TICKS - 1 );

  /**
   *
   * @param {Body} body
   * @param {number} min
   * @param {number} max
   * @param {number} defaultLabelValue
   * @param {string} valueLabel
   * @constructor
   */
  function BodyMassControl( body, min, max, defaultLabelValue, valueLabel ) {

    HSlider.call( this, body.massProperty, { min: min, max: max }, {
      trackSize: new Dimension2( WIDTH, 1 ),
      thumbSize: THUMB_SIZE,
      thumbTouchAreaXDilation: THUMB_SIZE.width,
      thumbTouchAreaYDilation: THUMB_SIZE.height,
      trackStroke: GravityAndOrbitsColorProfile.panelTextProperty,

      // ticks
      tickLabelSpacing: 3,
      majorTickLength: 13,
      majorTickStroke: GravityAndOrbitsColorProfile.panelTextProperty,

      // custom thumb
      thumbFillEnabled: '#98BECF',
      thumbFillHighlighted: '#B3D3E2'
    } );

    // add ticks and labels
    var defaultLabel = new Text( valueLabel, {
      top: 10,
      centerX: SPACING,
      font: new PhetFont( 13 ),
      fill: GravityAndOrbitsColorProfile.panelTextProperty,
      maxWidth: 80
    } );

    // create a label for the default value
    // @param {string} - string for the label text
    var createNumberLabel = function( value ) {
      return new Text( value, {
        font: new PhetFont( 13 ),
        fill: GravityAndOrbitsColorProfile.panelTextProperty,
        maxWidth: 110
      } );
    };

    var labels = [ createNumberLabel( '0.5' ), defaultLabel, createNumberLabel( '1.5' ), createNumberLabel( '2.0' ) ];
    for ( var i = 0; i < labels.length; i++ ) {
      var tickValue = ( i + 1 ) / labels.length * max;
      this.addMajorTick( tickValue, labels[ i ] );
    }

    var massListener = function( mass ) {
      // setting the diameter property took place in Body.setMass() in the Java version, but doesn't work here since
      // the mass itself is set by the slider in this case.
      // derived from: density = mass/volume, and volume = 4/3 pi r r r
      var radius = Math.pow( 3 * mass / 4 / Math.PI / body.density, 1 / 3 );
      body.diameterProperty.set( radius * 2 );

      // snap to default value if close
      if ( Math.abs( mass - defaultLabelValue ) / defaultLabelValue < SNAP_TOLERANCE ) {
        body.massProperty.set( defaultLabelValue );
      }
    };
    body.massProperty.link( massListener );
  }

  gravityAndOrbits.register( 'BodyMassControl', BodyMassControl );

  return inherit( HSlider, BodyMassControl );
} );
