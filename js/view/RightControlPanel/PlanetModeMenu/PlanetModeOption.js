/**
 * Copyright 2002-2013, University of Colorado
 * view for planet mode option button
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  var Image = require( 'SCENERY/nodes/Image' );
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RadioButton = require( 'SUN/RadioButton' );

  var Sun = require( 'view/SpaceObject/Sun' );
  var Earth = require( 'view/SpaceObject/Earth' );
  var Moon = require( 'view/SpaceObject/Moon' );
  var SpaceStation = require( 'view/SpaceObject/SpaceStation' );

  function PlanetModeOption( model, coords, opt ) {
    Node.call( this, coords );

    // create view
    var strokeSelected = new Rectangle( 0, 0, 150, 30, 5, 5, {fill: 'rgba(0,0,0,0)', stroke: '#fff', lineWidth: 2} );
    var strokeDeselected = new Rectangle( 0, 0, 150, 30, 5, 5, {fill: 'rgba(0,0,0,0)', cursor: 'pointer'} );
    var node = new Node();

    if ( opt.sun ) {
      node.addChild( new Sun( {x: 16, y: 15}, 11 ) );
    }

    if ( opt.earth ) {
      node.addChild( new Earth( {x: 52, y: 15}, 11 ) );
    }

    if ( opt.moon ) {
      node.addChild( new Moon( {x: 88, y: 15}, 11 ) );
    }

    if ( opt.spaceStation ) {
      node.addChild( new SpaceStation( {x: 124, y: 15}, 12 ) );
    }

    // button options
    var options = {
      selectedNode: new Node( {children: [node, strokeSelected]} ),
      deselectedNode: new Node( {children: [node, strokeDeselected]} )
    };

    // create button
    this.button = new RadioButton( model.planetModeProperty, opt.num, options.selectedNode, options.deselectedNode );
    this.addChild( this.button );
  }

  inherit( Node, PlanetModeOption );

  return PlanetModeOption;
} );