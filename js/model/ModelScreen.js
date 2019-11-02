// Copyright 2016-2019, University of Colorado Boulder

/**
 * The 'Model' screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ModelModel = require( 'GRAVITY_AND_ORBITS/model/ModelModel' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsScreenView = require( 'GRAVITY_AND_ORBITS/common/view/GravityAndOrbitsScreenView' );
  const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const modelString = require( 'string!GRAVITY_AND_ORBITS/model' );

  // images
  const cartoonMipmap = require( 'mipmap!GRAVITY_AND_ORBITS/model_icon.png' );

  class ModelScreen extends Screen {
    constructor( options ) {

      options = merge( {
        name: modelString,
        homeScreenIcon: new Image( cartoonMipmap )
      }, options );

      const viewTandem = options.tandem.createTandem( 'view' );
      super(
        () => new ModelModel( options.tandem.createTandem( 'model' ), viewTandem ),
        model => new GravityAndOrbitsScreenView( model, viewTandem ),
        options
      );
    }
  }

  return gravityAndOrbits.register( 'ModelScreen', ModelScreen );
} );