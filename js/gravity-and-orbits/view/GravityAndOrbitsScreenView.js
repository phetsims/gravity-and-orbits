//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author PhET Interactive Simulations
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var GravityAndOrbitsCanvas = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/GravityAndOrbitsCanvas' );
  var GravityAndOrbitsMode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/GravityAndOrbitsMode' );
  var GravityAndOrbitsModule = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/GravityAndOrbitsModule' );
  var RightControlPanel = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/controlpanel/right-control-panel/RightControlPanel' );


  /**
   * @param {GravityAndOrbitsModule} module
   * @constructor
   */
  function GravityAndOrbitsScreenView( module ) {

    ScreenView.call( this );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        module.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

    var controlPanelNode = new RightControlPanel( module );
    this.addChild( controlPanelNode );


//    var module = new GravityAndOrbitsModule( null, null, new Property( false ), true, )
    this.addChild( module.getMode().getCanvas() );
  }

  return inherit( ScreenView, GravityAndOrbitsScreenView, {

    // Called by the animation loop. Optional, so if your view has no animation, you can omit this.
    step: function( dt ) {
      // Handle view animation here.
    }
  } );
} );