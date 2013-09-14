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
  var PushButton = require( 'SUN/PushButton' );

  var Sun = require( 'view/SpaceObject/Sun' );
  var Earth = require( 'view/SpaceObject/Earth' );
  var Moon = require( 'view/SpaceObject/Moon' );
  var SpaceStation = require( 'view/SpaceObject/SpaceStation' );

  function PlanetModeOption( model, coords, opt ) {
    var self = this;
    Node.call( this, coords );

    // create view
    var stroke = new Rectangle( 0, 0, 150, 30, 5, 5, {fill: 'rgba(0,0,0,0)', stroke: '#fff', lineWidth: 2} );
    var strokeDisabled = new Rectangle( 0, 0, 150, 30, 5, 5, {fill: 'rgba(0,0,0,0)', cursor: 'pointer'} );
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
      upNode: new Node( {children: [node, stroke]} ),
      overNode: new Node( {children: [node, stroke]} ),
      downNode: new Node( {children: [node, stroke]} ),
      disabledNode: new Node( {children: [node, strokeDisabled]} ),
      callback: function() {
        model.planetMode = opt.num;
      }
    };

    // create button
    this.button = new PushButton( options.upNode, options.overNode, options.downNode, options.disabledNode, options.callback );
    this.addChild( this.button );

    model.planetModeProperty.link( function( mode ) {
      self.button._enabled.set( mode === opt.num );
    } );
  }

  inherit( Node, PlanetModeOption );

  return PlanetModeOption;
} );