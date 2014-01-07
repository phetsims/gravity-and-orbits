// Copyright 2002-2013, University of Colorado Boulder

/**
 * main view for workspace.
 * Contains space objects with related entities, arrows, grids and measuring tape.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' ),
    Node = require( 'SCENERY/nodes/Node' ),
    SpaceObjects = require( 'view/workspace/SpaceObjects' ),
    ForceArrows = require( 'view/workspace/ForceArrows' ),
    VelocityArrows = require( 'view/workspace/VelocityArrows' ),
    PlanetPath = require( 'view/workspace/PlanetPath' ),
    Grid = require( 'view/workspace/Grid' ),
    MeasuringTape = require( 'view/workspace/MeasuringTape' ),
    MassText = require( 'view/workspace/MassText' ),
    Labels = require( 'view/workspace/Labels' );

  function Workspace( model ) {
    var self = this;
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
    this.toScale.addChild( new Grid( model ) );

    // add labels
    this.toScale.addChild( new Labels( model ) );
    this.addChild( this.toScale );

    // add measuring tape
    this.addChild( new MeasuringTape( model ) );

    // add mass text
    this.addChild( new MassText( model ) );

    // redraw workspace when scale is changing
    model.scaleProperty.link( function( newScale ) {
      self.toScale.resetTransform(); // return to initial proportions
      self.toScale.scale( newScale );
    } );

    // add scale center observer
    model.scaleCenterProperty.linkAttribute( self, 'translation' );
  }

  return inherit( Node, Workspace );
} );