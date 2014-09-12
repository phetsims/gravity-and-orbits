// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of planet mode reset button.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var resetArrowImg = require( 'image!GRAVITY_AND_ORBITS/reset_arrow.png' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  /**
   * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
   * @param {Object} options - Options for buttons.
   * @param {Number} dy - y-offset of node.
   * @constructor
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
      pushButton.setY( mode * dy + 2.5 );
    } );
  }

  return inherit( Node, PlanetModeResetButton );
} );