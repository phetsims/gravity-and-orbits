// Copyright 2002-2014, University of Colorado

/**
 * The main application for Gravity and Orbits.
 *
 * @author Sam Reid
 * @author Aaron Davis
 * @see GravityAndOrbitsModule
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var CartoonModeList = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/CartoonModeList' );
  var GravityAndOrbitsMode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/GravityAndOrbitsMode' );
  var GravityAndOrbitsModule = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/GravityAndOrbitsModule' );
  var ModeListParameterList = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/ModeListParameterList' );
  var RealModeList = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/RealModeList' );
  var GravityAndOrbitsApplicationState = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/simsharing/GravityAndOrbitsApplicationState' );
//  var cartoonTab = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GAOSimSharing/UserComponents/cartoonTab' );//static
//  var toScaleTab = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GAOSimSharing/UserComponents/toScaleTab' );//static
//  var CARTOON = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GAOStrings/CARTOON' );//static
//  var TO_SCALE = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GAOStrings/TO_SCALE' );//static

  var PROJECT_NAME = "gravity-and-orbits";

//Some features are disabled in teacher mode, such as showing the diameter of spherical bodies, since it is too expensive
  var teacherMode = false;

  // static class: IntroModule
      function IntroModule( phetFrame, whiteBackgroundProperty ) {
        GravityAndOrbitsModule.call( this, cartoonTab, phetFrame, whiteBackgroundProperty, CARTOON, false, function( p ) {
            return new CartoonModeList( p.playButtonPressed, p.gravityEnabled, p.stepping, p.rewinding, p.timeSpeedScale );
        }, 0, false );
      }

      inherit( GravityAndOrbitsModule, IntroModule );

  // static class: CartoonModule
      function CartoonModule( phetFrame, whiteBackgroundProperty ) {
        GravityAndOrbitsModule.call( this, toScaleTab, phetFrame, whiteBackgroundProperty, TO_SCALE, true, function( p ) {
              return new RealModeList( p.playButtonPressed, p.gravityEnabled, p.stepping, p.rewinding, p.timeSpeedScale );
          }, //Start Real tab in earth/satellite mode because it is more playful
          3, true );
      }

       inherit( GravityAndOrbitsModule, CartoonModule );


  function GravityAndOrbitsApplication( config ) {

    //private
    this.whiteBackgroundProperty = new Property( false );

    //For simsharing
    //private
    this.imageFactory = new ImageFactory();

    //private
    this.index = 0;

    //Modules are stored so the data can be read and set for simsharing
    //private
    this.intro = new IntroModule( getPhetFrame(), whiteBackgroundProperty );
    this.addModule( this.intro );

    //private
    this.toScale = new CartoonModule( getPhetFrame(), whiteBackgroundProperty );
    this.addModule( this.toScale );

//    getPhetFrame().addMenu( new OptionsMenu().withAnonymousClassBody( {
//      initializer: function() {
//        addWhiteBackgroundCheckBoxMenuItem( whiteBackgroundProperty );
//      }
//    } ) );
  }

  return inherit( PiccoloPhetApplication, GravityAndOrbitsApplication, {
      setTeacherMode: function( b ) {
        teacherMode = b;
        intro.setTeacherMode( b );
        toScale.setTeacherMode( b );
      },
      getState: function() {
        return new GravityAndOrbitsApplicationState( this, imageFactory, index++ );
      },
      setState: function( state ) {
        state.apply( this );
      },
      addModelSteppedListener: function( updateSharing ) {
        getIntro().addModelSteppedListener( new SimpleObserver().withAnonymousClassBody( {
          update: function() {
            updateSharing.apply();
          }
        } ) );
        getToScale().addModelSteppedListener( new SimpleObserver().withAnonymousClassBody( {
          update: function() {
            updateSharing.apply();
          }
        } ) );
      },
      isPaused: function() {
        return getIntro().modeProperty.get().getModel().getClock().isPaused();
      },
      setPlayButtonPressed: function( b ) {
        getIntro().playButtonPressed.set( true );
      },
      getIntro: function() {
        return intro;
      },
      getToScale: function() {
        return toScale;
      },
//Main method for the sim
      main: function( args ) /*throws ClassNotFoundException*/ {
        new PhetApplicationLauncher().launchSim( args, PROJECT_NAME, GravityAndOrbitsApplication.class );
      }
    },
//statics
    {
      PROJECT_NAME: PROJECT_NAME,
      RESOURCES: RESOURCES,
      teacherMode: teacherMode
    } );
} );
