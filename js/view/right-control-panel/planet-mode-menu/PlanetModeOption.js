// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of single planet mode option button.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RadioButton = require( 'SUN/RadioButton' );
  var Sun = require( 'view/space-object/Sun' );
  var Earth = require( 'view/space-object/Earth' );
  var Moon = require( 'view/space-object/Moon' );
  var SpaceStation = require( 'view/space-object/SpaceStation' );

  /**
   * @param model {Object} Contains set of properties. Instance of PropertySet class. General model for the whole application.
   * @param options {Object} options for buttons
   * @param num {Number} Number of planet mode
   */

  function PlanetModeOption( model, options, num ) {
    Node.call( this, options );
    var map = {
      sun: Sun,
      earth: Earth,
      moon: Moon,
      spaceStation: SpaceStation
    };

    // create view
    var strokeSelected = new Rectangle( 0, 0, 150, 30, 5, 5, {fill: 'rgba(0,0,0,0)', stroke: '#fff', lineWidth: 2} );
    var strokeDeselected = new Rectangle( 0, 0, 150, 30, 5, 5, {fill: 'rgba(0,0,0,0)', cursor: 'pointer'} );
    var node = new Node();

    for ( var i = model.spaceObjects.length, currentObj; i--; ) {
      currentObj = model.spaceObjects[i];
      if ( model.planetModes[num][currentObj] ) {
        node.addChild( new map[currentObj]( {x: 16 + i * 36, y: 15}, 11 ) );
      }
    }

    // set button options
    options = {
      selectedNode: new Node( {children: [node, strokeSelected]} ),
      deselectedNode: new Node( {children: [node, strokeDeselected]} )
    };

    // create button
    this.button = new RadioButton( model.planetModeProperty, num, options.selectedNode, options.deselectedNode );
    this.addChild( this.button );
  }

  return inherit( Node, PlanetModeOption );
} );