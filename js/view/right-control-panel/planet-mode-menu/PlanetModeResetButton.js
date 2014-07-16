// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of planet mode reset button.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  var resetArrowImg = require( 'image!GRAVITY_AND_ORBITS/reset_arrow.png' ),
    Image = require( 'SCENERY/nodes/Image' ),
    Node = require( 'SCENERY/nodes/Node' ),
    inherit = require( 'PHET_CORE/inherit' ),
    Rectangle = require( 'SCENERY/nodes/Rectangle' ),
    RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  /**
   * @param {Object} model
   * @param {Object} options for buttons
   * @param {Number} dy y-offset of node
   */

  function PlanetModeResetButton( model, options, dy ) {
    var pushButton;
    Node.call( this, options );

    // create button
    this.addChild( pushButton = new RectangularPushButton( {
        content: new Node( {
          children: [
            new Rectangle( 0, 0, 25, 25, 5, 5, {fill: '#fff'} ),
            new Image( resetArrowImg, {x: 2, y: 1} )
          ]} ),
        xMargin: 0,
        yMargin: 0,
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