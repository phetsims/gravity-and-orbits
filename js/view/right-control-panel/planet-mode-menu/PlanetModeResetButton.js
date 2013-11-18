// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of planet mode reset button.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  var resetArrowImg = require( 'image!GRAVITY_AND_ORBITS/reset_arrow.svg' );

  var Image = require( 'SCENERY/nodes/Image' );
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectanglePushButton = require( 'SUN/RectanglePushButton' );

  function PlanetModeResetButton( model, coords, dy ) {
    var pushButton;
    Node.call( this, coords );

    // create button
    this.addChild( pushButton = new RectanglePushButton( new Node( {
      children: [
        new Rectangle( 0, 0, 25, 25, 5, 5, {fill: '#fff'} ),
        new Image( resetArrowImg, {x: 2, y: 1} )
      ]} ),
      {
        rectangleXMargin: 0,
        rectangleYMargin: 0,
        listener: function() {
          model.refreshMode = true;
        }
      } )
    );

    model.planetModeProperty.link( function( mode ) {
      pushButton.setY( mode * dy );
    } );
  }

  return inherit( Node, PlanetModeResetButton );
} );