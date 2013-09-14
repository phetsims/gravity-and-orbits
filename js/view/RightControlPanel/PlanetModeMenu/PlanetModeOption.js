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

  function PlanetModeOption( model, coords, num ) {
    var self = this;
    Node.call( this, coords );

    // create view
    var stroke = new Rectangle( 0, 0, 125, 30, 5, 5, {fill: 'rgba(0,0,0,0)', stroke: '#fff', lineWidth: 2} );
    var strokeDisabled = new Rectangle( 0, 0, 125, 30, 5, 5, {fill: 'rgba(0,0,0,0)', cursor: 'pointer'} );
    var node = new Node( {children: []} );

    // button options
    var options = {
      upNode: new Node( {children: [node, stroke]} ),
      overNode: new Node( {children: [node, stroke]} ),
      downNode: new Node( {children: [node, stroke]} ),
      disabledNode: new Node( {children: [node, strokeDisabled]} ),
      callback: function() {
        model.planetMode = num;
      }
    };

    // create button
    this.button = new PushButton( options.upNode, options.overNode, options.downNode, options.disabledNode, options.callback );
    this.addChild( this.button );

    model.planetModeProperty.link( function( mode ) {
      self.button._enabled.set( mode === num );
    } );
  }

  inherit( Node, PlanetModeOption );

  return PlanetModeOption;
} );