// Copyright 2002-2015, University of Colorado Boulder

/**
 * Container for mass sliders, there should be two of them per mode.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var BodyMassControl = require( 'GRAVITY_AND_ORBITS/view/right-control-panel/BodyMassControl' );

  /**
   * @param {GravityAndOrbitsModule} module
   * @param {Object} [options]
   * @constructor
   */
  function MassMenu( module, options ) {

    options = _.extend( { resize: false }, options );
    VBox.call( this, options );

    var thisNode = this;
    module.modeProperty.link( function( mode ) {
      thisNode.removeAllChildren();
      var bodies = mode.getModel().getBodies();
      for ( var i = 0; i < bodies.length; i++ ) {
        var body = bodies[ i ];
        if ( body.isMassSettable() ) {
          thisNode.addChild( new BodyMassControl( body, body.getMassProperty().getInitialValue() / 2, body.getMassProperty().getInitialValue() * 2, body.getTickValue(), body.getTickLabel(), module.whiteBackgroundProperty ) );
        }
      }
      thisNode.updateLayout();

    } );
  }

  return inherit( VBox, MassMenu );
} );