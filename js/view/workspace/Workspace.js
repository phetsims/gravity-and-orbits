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
  var SpaceObjects = require( 'view/workspace/SpaceObjects' );
  var ForceArrows = require( 'view/workspace/ForceArrows' );
  var VelocityArrows = require( 'view/workspace/VelocityArrows' );
  var PlanetPath = require( 'view/workspace/PlanetPath' );
  var Grid = require( 'view/workspace/Grid' );
  var MeasuringTape = require( 'view/workspace/MeasuringTape' );
  var MassText = require( 'view/workspace/MassText' );
  var Labels = require( 'view/workspace/Labels' );

  /**
   * @param {PropertySet} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
   * @constructor
   */
  function Workspace( model ) {
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
    this.addChild( new MeasuringTape( model ) );

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