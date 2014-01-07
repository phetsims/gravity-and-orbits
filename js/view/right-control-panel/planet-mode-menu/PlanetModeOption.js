// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of single planet mode option button.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  var Node = require( 'SCENERY/nodes/Node' ),
    inherit = require( 'PHET_CORE/inherit' ),
    Rectangle = require( 'SCENERY/nodes/Rectangle' ),
    RadioButton = require( 'SUN/RadioButton' ),
    Sun = require( 'view/space-object/Sun' ),
    Earth = require( 'view/space-object/Earth' ),
    Moon = require( 'view/space-object/Moon' ),
    SpaceStation = require( 'view/space-object/SpaceStation' );

  /**
   * @param {Object} model
   * @param {Object} options for buttons
   * @param {Number} num Number of planet mode
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