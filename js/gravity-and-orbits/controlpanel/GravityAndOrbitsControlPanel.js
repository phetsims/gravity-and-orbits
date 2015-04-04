//// Copyright 2002-2015, University of Colorado
//
///**
// * Control panel for a GravityAndOrbitsMode (one control panel per mode).  Multiple control panels
// * are synchronized through Module specific properties.
// *
// * @author Sam Reid
// * @author Aaron Davis
// */
//define( function( require ) {
//  'use strict';
//
//  // modules
//  var inherit = require( 'PHET_CORE/inherit' );
//  var Color = require( 'SCENERY/util/Color' );
//  var Dimension = require( 'java.awt.Dimension' );
//  var Font = require( 'SCENERY/util/Font' );
//  var GridBagConstraints = require( 'java.awt.GridBagConstraints' );
//  var GridLayout = require( 'java.awt.GridLayout' );
//  var Vector2 = require( 'java.awt.geom.Vector2' );
//  var Box = require( 'javax.swing.Box' );
//  var ImageIcon = require( 'javax.swing.ImageIcon' );
//  var JComponent = require( 'javax.swing.JComponent' );
//  var JLabel = require( 'javax.swing.JLabel' );
//  var JPanel = require( 'javax.swing.JPanel' );
//  var HorizontalLayoutPanel = require( 'edu.colorado.phet.common.phetcommon.view.HorizontalLayoutPanel' );
//  var PhetColorScheme = require( 'edu.colorado.phet.common.phetcommon.view.PhetColorScheme' );
//  var PhetLineBorder = require( 'edu.colorado.phet.common.phetcommon.view.PhetLineBorder' );
//  var PhetTitledBorder = require( 'edu.colorado.phet.common.phetcommon.view.PhetTitledBorder' );
//  var VBox = require( 'SCENERY/nodes/VBox' );
//  var PhetFont = require( 'edu.colorado.phet.common.phetcommon.view.util.PhetFont' );
//  var ArrowNode = require( 'edu.colorado.phet.common.piccolophet.nodes.ArrowNode' );
//  var GAOStrings = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GAOStrings' );
//  var Body = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/Body' );
//  var PlanetModeMenu = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/PlanetModeMenu' );
//  var GravityAndOrbitsModel = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/GravityAndOrbitsModel' );
//  var GravityAndOrbitsMode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/GravityAndOrbitsMode' );
//  var GravityAndOrbitsModule = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/GravityAndOrbitsModule' );
//  var StringUtils = require( 'PHETCOMMON/StringUtils' );
//
//  var BACKGROUND = new Color( 3, 0, 133 );
//  var FOREGROUND = Color.white;
//  var CONTROL_FONT = new PhetFont( 16 );
//
//  function GravityAndOrbitsControlPanel( module, model ) {
//    VBox.call( this );
//
//    // add mode check-boxes
//    var modeButtons = new PlanetModeMenu( module );
//
//    var textOptions = { font: CONTROL_FONT, fill: '#fff', pickable: false };
//    var gravityPanel = new HBox( {
//      spacing: 10, bottom: 2, children: [
//        //new Text( gravityString + ':', { font: FONT, fill: '#fff', pickable: false } ),
//        new Text( StringUtils.format( GAOStrings.PATTERN_LABEL, GAOStrings.GRAVITY ), textOptions ),
//        new AquaRadioButton( module.gravityEnabledProperty, true, new Text( GAOStrings.ON, textOptions ), { radius: 7 } ),
//        new AquaRadioButton( module.gravityEnabledProperty, false, new Text( GAOStrings.OFF, textOptions ), { radius: 7 } )
//      ]
//    } );
//
//    // "Show" subpanel
//    add( new VBox().withAnonymousClassBody( {
//      initializer: function() {
//        setOpaque( false );
//        setBorder( new PhetTitledBorder( new PhetLineBorder( Color.white ), GAOStrings.SHOW ).withAnonymousClassBody( {
//          initializer: function() {
//            setTitleColor( Color.white );
//            setTitleFont( CONTROL_FONT );
//          }
//        } ) );
//        setFillNone();
//        setAnchor( GridBagConstraints.WEST );
//        //Checkboxes for Gravity force and Velocity vectors
//        add( new JPanel( new GridLayout( 2, 2 ) ).withAnonymousClassBody( {
//          initializer: function() {
//            setOpaque( false );
//            add( new GAOCheckBox( showGravityForceCheckBox, GAOStrings.GRAVITY_FORCE, module.showGravityForceProperty ) );
//            add( newArrow( PhetColorScheme.GRAVITATIONAL_FORCE ) );
//            add( new GAOCheckBox( showVelocityCheckBox, GAOStrings.VELOCITY, module.showVelocityProperty ) );
//            add( newArrow( PhetColorScheme.VELOCITY ) );
//            setMaximumSize( getPreferredSize() );
//          }
//        } ) );
//        if ( module.showMassCheckBox ) {
//          //only show this on real mode
//          add( new GAOCheckBox( showMassCheckBox, GAOStrings.MASS, module.showMassProperty ) );
//        }
//        add( new GAOCheckBox( showPathCheckBox, GAOStrings.PATH, module.showPathProperty ) );
//        add( new GAOCheckBox( showGridCheckBox, GAOStrings.GRID, module.showGridProperty ) );
//        //Panel with measuring tape.
//        if ( module.showMeasuringTape ) {
//          add( new GAOCheckBox( showMeasuringTapeCheckbox, GAOStrings.MEASURING_TAPE, module.measuringTapeVisibleProperty ) );
//        }
//      }
//    } ) );
//    // Mass sliders
//    for ( var body in model.getBodies() ) {
//      if ( body.isMassSettable() ) {
//        add( new BodyMassControl( body, body.getMassProperty().getInitialValue() / 2, body.getMassProperty().getInitialValue() * 2, body.getTickValue(), body.getTickLabel(), module.whiteBackgroundProperty ) );
//      }
//    }
//  }
//
//  return inherit( VBox, GravityAndOrbitsControlPanel, {
//
//      //private
//      newArrow: function( color ) {
//        //Looks slightly different than the arrow in VectorNode so that it looks good at this size, see VectorNode constructor
//        return new JLabel( new ImageIcon( new ArrowNode( new Vector2(), new Vector2( 65, 0 ), 15, 15, 5, 2, true ).withAnonymousClassBody( {
//          initializer: function() {
//            setPaint( color );
//            setStrokePaint( Color.darkGray );
//          }
//        } ).toImage() ) );
//      },
//
//      //private
//      setFontsAndColors: function( component ) {
//        component.setFont( CONTROL_FONT );
//        component.setForeground( FOREGROUND );
//      }
//    },
////statics
//    {
//      BACKGROUND: BACKGROUND,
//      FOREGROUND: FOREGROUND,
//      CONTROL_FONT: CONTROL_FONT
//    } );
//} );
//
