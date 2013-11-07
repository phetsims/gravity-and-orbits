// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of single planet mode option button.
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

  var Sun = require( 'view/space-object/Sun' );
  var Earth = require( 'view/space-object/Earth' );
  var Moon = require( 'view/space-object/Moon' );
  var SpaceStation = require( 'view/space-object/SpaceStation' );

  /**
   * @param {model} model
   * @param {Object} coords coordinates of buttons
   * @param {Number} num Number of option
   * @constructor
   */

  function PlanetModeOption( model, coords, num ) {
    Node.call( this, coords );
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
    var options = {
      selectedNode: new Node( {children: [node, strokeSelected]} ),
      deselectedNode: new Node( {children: [node, strokeDeselected]} )
    };

    // create button
    this.button = new RadioButton( model.planetModeProperty, num, options.selectedNode, options.deselectedNode );
    this.addChild( this.button );
  }

  inherit( Node, PlanetModeOption );

  return PlanetModeOption;
} );