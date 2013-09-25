/**
 * Copyright 2002-2013, University of Colorado
 * view for planet mode reset button
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  var resetArrowImg = require( 'image!GRAVITY_AND_ORBITS/../images/reset_arrow.png' );

  var Image = require( 'SCENERY/nodes/Image' );
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PushButton = require( 'SUN/PushButton' );

  function PlanetModeResetButton( model, coords ) {
    Node.call( this, coords );

    // create default view
    var node = new Node( {children: [
      new Rectangle( 0, 0, 25, 25, 5, 5, {fill: '#fff'} ),
      new Image( resetArrowImg, {x: 2, y: 1} )
    ]} );

    // button options
    var options = {
      upNode: new Node( {children: [node]} ),
      overNode: new Node( {children: [node]} ),
      downNode: new Node( {children: [node]} ),
      disabledNode: new Node( {children: [node]} ),
      callback: function() {
        model.planetModeProperty.reset();
      }
    };

    // create button
    this.addChild( new PushButton( options.upNode, options.overNode, options.downNode, options.disabledNode, options.callback ) );
  }

  inherit( Node, PlanetModeResetButton );

  return PlanetModeResetButton;
} );