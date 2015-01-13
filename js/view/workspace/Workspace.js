// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main view for workspace.
 * Contains space objects with related entities, arrows, grids and measuring tape.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var SpaceObjects = require( 'view/workspace/SpaceObjects' );
  var ForceArrows = require( 'view/workspace/ForceArrows' );
  var VelocityArrows = require( 'view/workspace/VelocityArrows' );
  var PlanetPath = require( 'view/workspace/PlanetPath' );
  var Grid = require( 'view/workspace/Grid' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTapeDeprecated' );
  var MassText = require( 'view/workspace/MassText' );
  var Labels = require( 'view/workspace/Labels' );

  // tape options for planet modes
  var TAPE_OPTIONS = [
    {
      x: 0,
      y: 75,
      tipX: 92.4,
      tipY: 0,
      scale: 1,
      length: 92.4,
      lengthDefault: 92.4,
      initialValue: 50000,
      precision: 0
    },
    {
      x: 0,
      y: 75,
      tipX: 92.4,
      tipY: 0,
      scale: 1,
      length: 92.4,
      lengthDefault: 92.4,
      initialValue: 50000,
      precision: 0
    },
    {
      x: 0,
      y: 125,
      tipX: 59.7,
      tipY: 0,
      scale: 1,
      length: 59.7,
      lengthDefault: 59.7,
      initialValue: 100,
      precision: 0
    },
    {
      x: 150,
      y: -175,
      tipX: 83.75,
      tipY: 0,
      scale: 1,
      length: 63.5,
      lengthDefault: 63.5,
      initialValue: 2,
      precision: 1
    }
  ];

  /**
   * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
   * @constructor
   */
  function Workspace( model, layoutBounds ) {
    var workspace = this;
    this.toScale = new Node();
    Node.call( this );

    // add space objects
    this.toScale.addChild( new SpaceObjects( model ) );

    // add force arrows
    this.toScale.addChild( new ForceArrows( model ) );

    // add velocity arrows
    this.toScale.addChild( new VelocityArrows( model ) );

    // add planet path
    this.toScale.addChild( new PlanetPath( model ) );

    // add grids
    this.toScale.addChild( new Grid( model.property( 'grid' ), model.property( 'planetMode' ) ) );

    // add labels
    this.toScale.addChild( new Labels( model ) );
    this.addChild( this.toScale );

    // add measuring tape
    var xBound = layoutBounds.maxX * 0.4;
    var yBound = layoutBounds.maxY * 0.4;
    var tapeBounds = new Bounds2( -xBound, -yBound, xBound, yBound );
    var measuringTape = new MeasuringTape( tapeBounds, model.scaleProperty, model.unitsProperty, TAPE_OPTIONS[ 0 ] );
    this.toScale.addChild( measuringTape );
    model.tapeProperty.linkAttribute( measuringTape, 'visible' );
    model.planetModeProperty.link( function( mode ) {
      for ( var option in TAPE_OPTIONS[ mode ] ) {
        measuringTape.options[ option ] = TAPE_OPTIONS[ mode ][ option ];
      }
      measuringTape.resetTape();
    } );

    // add mass text
    this.addChild( new MassText( model ) );

    // redraw workspace when scale is changing
    model.scaleProperty.link( function( newScale ) {
      workspace.toScale.resetTransform(); // return to initial proportions
      workspace.toScale.scale( newScale );
    } );

    // add scale center observer
    model.scaleCenterProperty.linkAttribute( workspace, 'translation' );
  }

  return inherit( Node, Workspace );
} );