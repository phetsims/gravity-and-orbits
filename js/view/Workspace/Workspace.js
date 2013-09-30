// Copyright 2002-2013, University of Colorado Boulder

/**
 * main view
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  var SpaceObjects = require( 'view/Workspace/Components/SpaceObjects' );
  var ForceArrows = require( 'view/Workspace/Components/ForceArrows' );
  var VelocityArrows = require( 'view/Workspace/Components/VelocityArrows' );
  var Grid = require( 'view/Workspace/Components/Grid' );

  function Workspace( model ) {
    var self = this;
    Node.call( this );

    // add space objects
    self.spaceObjects = new SpaceObjects( model );
    self.addChild( self.spaceObjects );

    // add force arrows
    self.forceArrows = new ForceArrows( model );
    self.addChild( self.forceArrows );

    // add force arrows
    self.velocityArrows = new VelocityArrows( model );
    self.addChild( self.velocityArrows );

    // add grids
    self.grid = new Grid( model );
    self.addChild( self.grid );

    // redraw workspace when scale is changing
    model.scaleProperty.link( function( newScale, oldScale ) {
      self.scale( 1 / (oldScale || 1) );
      self.scale( newScale );
    } );

    // add scale center observer
    model.scaleCenterProperty.link( function( vect ) {
      self.x = vect.x;
      self.y = vect.y;
    } );

    // redraw workspace position of object is changing
    model.spaceObjects.forEach( function( el ) {
      model[el + 'PositionProperty'].link( function( vect ) {
        model[el + 'View'].x = vect.x;
        model[el + 'View'].y = vect.y;
      } );
    } );
  }

  inherit( Node, Workspace );

  return Workspace;
} );