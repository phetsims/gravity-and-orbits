// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of planet mode reset button.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  // images
  var resetArrowImg = require( 'image!GRAVITY_AND_ORBITS/reset_arrow.png' );

  /**
   * @param {GravityAndOrbitsModel} model - Contains set of properties. Instance of PropertySet class. General model for the whole application.
   * @param {Object} [options]
   * @constructor
   */
  function PlanetModeResetButton( model, options ) {
    // create button
    RectangularPushButton.call( this,
      {
        content: new Node( {
          children: [
            new Rectangle( 0, 0, 25, 25, 5, 5, { fill: '#fff' } ),
            new Image( resetArrowImg, { x: 2, y: 1 } )
          ]
        } ),
        xMargin: 0,
        yMargin: 0,
        listener: function() {
//          model.refreshMode = true;
        }
      } );

    this.mutate( options );
  }

  return inherit( RectangularPushButton, PlanetModeResetButton );
} );