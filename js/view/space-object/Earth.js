// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for Earth.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );

  // images
  var earthImg = require( 'image!GRAVITY_AND_ORBITS/earth.gif' );

  function Earth( coords, radius ) {
    Node.call( this, coords );

    this.viewGray = new Circle( radius, {
      fill: new RadialGradient( radius * 0.3, -radius * 0.3, 1, radius * 0.3, -radius * 0.3, radius / 1.5 )
        .addColorStop( 0, '#fff' )
        .addColorStop( 1, '#808080' )
    } ).setVisible( false );
    this.addChild( this.viewGray );

    this.setRadius( radius );
  }

  return inherit( Node, Earth, {
    setRadius: function( radius ) {
      var width = earthImg.width / 2, scale = radius / width;
      if ( this.view ) {this.removeChild( this.view );}

      this.view = new Image( earthImg, {scale: scale, x: -width * scale, y: -width * scale} );
      this.addChild( this.view );

      this.viewGray.setRadius( radius );
    },
    setGrayView: function() {
      this.viewGray.setVisible( true );
      this.view.setVisible( false );
    },
    setDefaultView: function() {
      this.viewGray.setVisible( false );
      this.view.setVisible( true );
    }
  } );
} );