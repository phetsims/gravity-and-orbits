/**
 * Copyright 2002-2013, University of Colorado
 * view for sun
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  function Sun( model ) {
    var self = this;
    Node.call( this, model.sun.coordinates );

    this.view = new Circle( model.sun.radius, {
      fill: new RadialGradient( model.sun.radius * 0.3, -model.sun.radius * 0.3, 1, model.sun.radius * 0.3, -model.sun.radius * 0.3, model.sun.radius / 1.5 )
        .addColorStop( 0, model.sun.colorGradient[0] )
        .addColorStop( 1, model.sun.colorGradient[1] )
    } );

    this.addChild( this.view );

    model.scaleProperty.link( function( newScale, oldScale ) {
      if ( oldScale ) {
        self.view.scale( 1 / oldScale );
      }
      self.view.scale( newScale );
    } );
  }

  inherit( Node, Sun );

  return Sun;
} );