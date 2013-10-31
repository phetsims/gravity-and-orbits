// Copyright 2002-2013, University of Colorado Boulder

/**
 * view for slider control
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var HorizontalSlider = require( 'view/RightControlPanel/MassMenu/Slider/HorizontalSlider' );

  var sliderImg = require( 'image!GRAVITY_AND_ORBITS/slider.png' );

  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  var FONT = new PhetFont( 11 );
  var FONTICON = new PhetFont( 14 );

  function Slider( x, y, options ) {
    options = _.extend(
      {
        tick: {step: 0, minText: '', maxText: ''},
        title: '',
        property: null,
        scope: {min: 0.5, max: 2},
        default: 1,
        rounding: false,
        width: 200,
        height: 50
      }, options );

    Node.call( this, {x: x, y: y} );

    var tick = options.tick || false;

    // add slider
    var slider = new Node( {children: [
      new Rectangle( 0, 0, options.width, options.height, {} ),
      new HorizontalSlider( 5, options.height - 20, options.width - 10, options.property, sliderImg, options.scope, options.rounding, tick, options.default ),
      new Text( options.title, {centerX: options.width / 2.7, top: 0, font: FONT, fill: '#fff', pickable: false} )
    ], y: 5} );
    this.addChild( slider );

    // add label
    var label = new Node( {children: [
      new Text( options.icon.text, {centerX: options.width / 2.5, top: -16, font: FONTICON, fontWeight: 'bold', fill: '#fff', pickable: false} ),
      new options.icon.image( {x: options.width / 1.7, y: -7}, 7 )
    ]} );
    this.addChild( label );

    options.property.link( function updateMass( value ) {
    } );
  }

  inherit( Node, Slider );

  return Slider;
} );