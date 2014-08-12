// Copyright 2002-2013, University of Colorado Boulder

/**
 * Space object abstract constructor.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  /**
   * @param options {Object} options for build abstract space object
   * @constructor
   */
  function AbstractSpaceObject( options ) {
    Node.call( this, options.coords );

    this.scaleCoeff = options.scaleCoeff || 1;
    this.prevScale = 1;

    // create image view for planet object
    if ( options.image ) {
      this.image = options.image;
      this.view = new Image( options.image );
      this.addChild( this.view );
    }
  }

  return inherit( Node, AbstractSpaceObject, {
    // resize image view accordingly to given radius
    setRadius: function( radius ) {
      var width = this.image.width / 2,
        height = this.image.height / 2,
        scale = radius / width * this.scaleCoeff;

      this.view.scale( 1 / this.prevScale );
      this.view.scale( scale );
      this.prevScale = scale;
      this.view.setTranslation( -width * scale, -height * scale );
    },
    // return circle with gradient. Necessary for Earth (gray view) and Sun views.
    getCircleGradient: function( radius, stopColor0, stopColor1, isVisible ) {
      return new Circle( radius, {
        fill: new RadialGradient( radius * 0.3, -radius * 0.3, 1, radius * 0.3, -radius * 0.3, radius / 1.5 )
          .addColorStop( 0, stopColor0 )
          .addColorStop( 1, stopColor1 ),
        visible: isVisible
      } );
    }
  } );
} );