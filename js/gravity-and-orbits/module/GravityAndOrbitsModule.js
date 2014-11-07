// Copyright 2002-2011, University of Colorado
/**
 * The GravityAndOrbitsModule has a set of "modes", one mode for each configuration of bodies (eg, Sun + Planet).
 * Each mode has its own model, canvas, clock, etc, which are used in place of this Module's data.
 * The module contains information that is shared across all modes, such as whether certain features are shown (such as
 * showing the gravitational force).
 *
 * @author Sam Reid
 * @author Jon Olson
 * @author Chris Malley
 * @author John Blanco
 * @author Aaron Davis
 * @see edu.colorado.phet.gravityandorbits.model.GravityAndOrbitsModel
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );

  var G = 6.67428E-11;

  /**
   * //    public GravityAndOrbitsModule( IUserComponent tabUserComponent, final PhetFrame phetFrame, Property<Boolean> whiteBackgroundProperty, final String name, boolean showMeasuringTape, Function1<ModeListParameterList, ArrayList<GravityAndOrbitsMode>> createModes, int initialModeIndex, boolean showMassCheckBox ) {
   * @param tabUserComponent
   * @param phetFrame
   * @param {Property<boolean>} whiteBackgroundProperty
   * @param {string} name
   * @param {boolean} showMeasuringTape
   * @param {function<ModeListParameterList, Array<GravityAndOrbitsMode>>} createModes
   * @param {number} initialModeIndex
   * @param {boolean} showMassCheckBox
   * @constructor
   */
  function GravityAndOrbitsModule( tabUserComponent, phetFrame, whiteBackgroundProperty, name, showMeasuringTape, createModes, initialModeIndex, showMassCheckBox ) {
    //Properties that are common to all "modes" should live here.

    PropertySet.call( this, {
      showGravityForce: false,
      showPath: false,
      showGrid: false,
      showVelocity: false,
      showMass: false,
      playButtonPressed: false,
      //one quarter of the way up between 1/10 and 2 scale factors
      timeSpeedScale: (0.1 + 2) / 4,
      measuringTapeVisible: false,
      gravityEnabled: true,
      stepping: false,
      rewinding: false,
      mode: 0, // TODO this was black
      whiteBackground: false, // was blank
      showMeasuringTape: false // was blank
    } );


    //TODO: I don't think this clock is used since each mode has its own clock; perhaps this just runs the active tab?
//    SimSharingPiccoloModule.call( this, tabUserComponent, name, new ConstantDtClock( 30, 1 ) );
    this.showMassCheckBox = showMassCheckBox;

    //private
    this.modes = createModes( new ModeListParameterList(
      this.playButtonPressedProperty,
      this.gravityEnabledProperty,
      this.steppingProperty,
      this.rewindingProperty,
      this.timeSpeedScaleProperty) );

    this.modeProperty = new Property( this.modes[initialModeIndex] );
    this.whiteBackground = whiteBackgroundProperty;
    this.showMeasuringTape = showMeasuringTape;

    // TODO: look at java for this
    getModulePanel().setLogoPanel( null );

    for ( var i = 0; i < this.modes.length; i++ ) {
      this.modes[i].init( this );
    }
    setSimulationPanel( getMode().getCanvas() );
    // Switch the entire canvas on mode switches
    modeProperty.addObserver( new SimpleObserver().withAnonymousClassBody( {
      update: function() {
        SwingUtilities.invokeLater( new Runnable().withAnonymousClassBody( {
          run: function() {
            setSimulationPanel( getMode().getCanvas() );
          }
        } ) );
        updateActiveModule();
      }
    } ) );
    //clock panel appears in the canvas
    setClockControlPanel( null );
    reset();
  }

  return inherit( PropertySet, GravityAndOrbitsModule, {
      getModeIndex: function() {
        return modes.indexOf( getMode() );
      },

      //private
      getMode: function() {
        return this.modeProperty.get();
      },

      getModes: function() {
        return new ArrayList( modes );
      },

      //private
      updateActiveModule: function() {
        for ( var mode in modes ) {
          this.mode.active.set( this.mode == getMode() );
        }
      },
      reset: function() {
        for ( var mode in modes ) {
          mode.reset();
        }
        this.showGravityForceProperty.reset();
        this.showPathProperty.reset();
        this.showGridProperty.reset();
        this.showVelocityProperty.reset();
        this.showMassProperty.reset();
        this.playButtonPressed.reset();
        this.timeSpeedScaleProperty.reset();
        this.measuringTapeVisibleProperty.reset();
        this.gravityEnabledProperty.reset();
        this.stepping.reset();
        this.rewinding.reset();
        this.modeProperty.reset();
      },
      setTeacherMode: function( b ) {
        for ( var mode in modes ) {
          this.mode.getModel().teacherMode = b;
        }
      },
      addModelSteppedListener: function( simpleObserver ) {
        for ( var mode in modes ) {
          this.mode.getModel().addModelSteppedListener( simpleObserver );
        }
      },
      setModeIndex: function( selectedMode ) {
        modeProperty.set( this.modes.get( selectedMode ) );
      }
    },
//statics
    {
      G: G
    } );
} );




//// Copyright 2002-2011, University of Colorado
//
//package edu.colorado.phet.gravityandorbits.module;
//
//import java.util.ArrayList;
//
//import javax.swing.SwingUtilities;
//
//import edu.colorado.phet.common.phetcommon.model.clock.ConstantDtClock;
//import edu.colorado.phet.common.phetcommon.model.property.BooleanProperty;
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.simsharing.messages.IUserComponent;
//import edu.colorado.phet.common.phetcommon.util.SimpleObserver;
//import edu.colorado.phet.common.phetcommon.util.function.Function1;
//import edu.colorado.phet.common.phetcommon.view.PhetFrame;
//import edu.colorado.phet.common.piccolophet.SimSharingPiccoloModule;
//
///**
// * The GravityAndOrbitsModule has a set of "modes", one mode for each configuration of bodies (eg, Sun + Planet).
// * Each mode has its own model, canvas, clock, etc, which are used in place of this Module's data.
// * The module contains information that is shared across all modes, such as whether certain features are shown (such as
// * showing the gravitational force).
// *
// * @author Sam Reid
// * @author Jon Olson
// * @author Chris Malley
// * @author John Blanco
// * @see edu.colorado.phet.gravityandorbits.model.GravityAndOrbitsModel
// */
//public class GravityAndOrbitsModule extends SimSharingPiccoloModule {
//    public static final double G = 6.67428E-11;
//
//    //Properties that are common to all "modes" should live here.
//    public final BooleanProperty showGravityForceProperty = new BooleanProperty( false );
//    public final Property<Boolean> showPathProperty = new Property<Boolean>( false );
//    public final Property<Boolean> showGridProperty = new Property<Boolean>( false );
//    public final BooleanProperty showVelocityProperty = new BooleanProperty( false );
//    public final Property<Boolean> showMassProperty = new Property<Boolean>( false );
//    public final Property<Boolean> playButtonPressed = new Property<Boolean>( false );
//    public final Property<Double> timeSpeedScaleProperty = new Property<Double>( ( 0.1 + 2 ) / 4 );//one quarter of the way up between 1/10 and 2 scale factors
//    public final Property<Boolean> measuringTapeVisibleProperty = new Property<Boolean>( false );
//    public final Property<Boolean> gravityEnabledProperty = new Property<Boolean>( true );
//    public final Property<Boolean> stepping = new Property<Boolean>( false );
//    public final Property<Boolean> rewinding = new Property<Boolean>( false );
//
//    public final Property<GravityAndOrbitsMode> modeProperty;
//    public final Property<Boolean> whiteBackgroundProperty;
//    public final boolean showMeasuringTape;
//    private final ArrayList<GravityAndOrbitsMode> modes;
//    public final boolean showMassCheckBox;
//
//    public GravityAndOrbitsModule( IUserComponent tabUserComponent, final PhetFrame phetFrame, Property<Boolean> whiteBackgroundProperty, final String name, boolean showMeasuringTape, Function1<ModeListParameterList, ArrayList<GravityAndOrbitsMode>> createModes, int initialModeIndex, boolean showMassCheckBox ) {
//        super( tabUserComponent, name, new ConstantDtClock( 30, 1 ) );//TODO: I don't think this clock is used since each mode has its own clock; perhaps this just runs the active tab?
//        this.showMassCheckBox = showMassCheckBox;
//        modes = createModes.apply( new ModeListParameterList( playButtonPressed, gravityEnabledProperty, stepping, rewinding, timeSpeedScaleProperty ) );
//        modeProperty = new Property<GravityAndOrbitsMode>( modes.get( initialModeIndex ) );
//        this.whiteBackgroundProperty = whiteBackgroundProperty;
//        this.showMeasuringTape = showMeasuringTape;
//        getModulePanel().setLogoPanel( null );
//        for ( GravityAndOrbitsMode mode : modes ) {
//            mode.init( this );
//        }
//
//        setSimulationPanel( getMode().getCanvas() );
//
//        // Switch the entire canvas on mode switches
//        modeProperty.addObserver( new SimpleObserver() {
//            public void update() {
//                SwingUtilities.invokeLater( new Runnable() {
//                    public void run() {
//                        setSimulationPanel( getMode().getCanvas() );
//                    }
//                } );
//                updateActiveModule();
//            }
//        } );
//        setClockControlPanel( null );//clock panel appears in the canvas
//
//        reset();
//    }
//
//    public int getModeIndex() {
//        return modes.indexOf( getMode() );
//    }
//
//    private GravityAndOrbitsMode getMode() {
//        return modeProperty.get();
//    }
//
//    public ArrayList<GravityAndOrbitsMode> getModes() {
//        return new ArrayList<GravityAndOrbitsMode>( modes );
//    }
//
//    private void updateActiveModule() {
//        for ( GravityAndOrbitsMode mode : modes ) {
//            mode.active.set( mode == getMode() );
//        }
//    }
//
//    public void reset() {
//        for ( GravityAndOrbitsMode mode : modes ) {
//            mode.reset();
//        }
//        showGravityForceProperty.reset();
//        showPathProperty.reset();
//        showGridProperty.reset();
//        showVelocityProperty.reset();
//        showMassProperty.reset();
//        playButtonPressed.reset();
//        timeSpeedScaleProperty.reset();
//        measuringTapeVisibleProperty.reset();
//        gravityEnabledProperty.reset();
//        stepping.reset();
//        rewinding.reset();
//        modeProperty.reset();
//    }
//
//    public void setTeacherMode( boolean b ) {
//        for ( GravityAndOrbitsMode mode : modes ) {
//            mode.getModel().teacherMode = b;
//        }
//    }
//
//    public void addModelSteppedListener( SimpleObserver simpleObserver ) {
//        for ( GravityAndOrbitsMode mode : modes ) {
//            mode.getModel().addModelSteppedListener( simpleObserver );
//        }
//    }
//
//    public void setModeIndex( int selectedMode ) {
//        modeProperty.set( modes.get( selectedMode ) );
//    }
//}