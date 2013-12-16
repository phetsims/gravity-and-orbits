// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for single space object, such as a moon, earth or satellite.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  var Vector2 = require( 'DOT/Vector2' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FONT = new PhetFont( 12 );

  function SpaceObjectModel() {
    this.label = new Node( {visible: true, cursor: 'pointer'} ); // node for label
    this.massText = new Text( "", { visible: true, font: FONT, fontWeight: 'bold', textAlign: 'center', fill: 'white', pickable: false} ); // node for mass text
    this.view = new Node(); // node for view of space object
    PropertySet.call( this, {
      mass: 1, // mass of space object
      massCoeff: 1, // mass coefficient
      radius: 0, // radius of space object
      radiusCoeff: 1, // radius coefficient
      exploded: false, // explode flag
      velocity: new Vector2( 0, 0 ), // velocity of space object
      velocityHalf: new Vector2( 0, 0 ), // intermediate velocity of space object for calculation
      acceleration: new Vector2( 0, 0 ), // acceleration of space object
      positionStart: new Vector2( 0, 0 ), // initial position of space object
      position: new Vector2( 0, 0 ), // position of space object
      initDrag: false // trigger for drag initialization
    } );
  }

  return inherit( PropertySet, SpaceObjectModel, {
    step: function() {},
    reset: function() {}
  } );
} );
