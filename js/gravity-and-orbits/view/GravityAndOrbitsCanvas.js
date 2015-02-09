// Copyright 2002-2014, University of Colorado

/**
 * Provides the play area for a single GravityAndOrbitsMode.
 *
 * @author Sam Reid
 * @author Aaron Davis
 * @see GravityAndOrbitsMode
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PathNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/PathNode' );
  var BodyNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/BodyNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var GAOStrings = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GAOStrings' );
  var GravityAndOrbitsControlPanel = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/controlpanel/GravityAndOrbitsControlPanel' );
  var Body = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/Body' );
  var GravityAndOrbitsModel = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/GravityAndOrbitsModel' );
//  var GravityAndOrbitsMode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/GravityAndOrbitsMode' );
  var GravityAndOrbitsModule = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/GravityAndOrbitsModule' );
  var Node = require( 'SCENERY/nodes/Node' );
  var UserComponents = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/UserComponents' );
//  var BACKGROUND = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/controlpanel/GravityAndOrbitsControlPanel/BACKGROUND' );//static
//  var CONTROL_FONT = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/controlpanel/GravityAndOrbitsControlPanel/CONTROL_FONT' );//static

  var STAGE_SIZE = new Dimension2( 1008, 679 );
  var buttonBackgroundColor = new Color( 255, 250, 125 );

  /**
   *
   * @param {GravityAndOrbitsModel} model
   * @param {GravityAndOrbitsModule} module
   * @param {GravityAndOrbitsMode} mode
   * @param {number} forceScale
   * @constructor
   */
  function GravityAndOrbitsCanvas( model, module, mode, forceScale ) {

    //view size
//    Node.call( this, new Dimension( 1500, 1500 ) );
    Node.call( this );
    var thisNode = this;

    module.whiteBackgroundProperty.link ( function( whiteBackground ) {
      thisNode.fill = whiteBackground ? Color.WHITE : Color.BLACK;
    } );

    // TODO translate this to js
    this.modelViewTransform = ModelViewTransform2.createOffsetScaleMapping( new Vector2(), 1 );
//    setWorldTransformStrategy( new Node.CenteredStage( this, STAGE_SIZE ) );

    // Root of our scene graph
    // private
//    this.rootNode = new Node();
//    this.addChild( this.rootNode );

    // stores the current position of the mouse so we can change to cursor hand when an object moves under the mouse
    var mousePositionProperty = null;
//    var mousePositionProperty = new Property( new Vector2() );
//    addMouseMotionListener( new MouseMotionListener().withAnonymousClassBody( {
//      mouseDragged: function( mouseEvent ) {
//      },
//      mouseMoved: function( mouseEvent ) {
//        mousePositionProperty.set( new Vector2( mouseEvent.getPoint().x, mouseEvent.getPoint().y ) );
//      }
//    } ) );

    var bodies = model.getBodies();
    var i;


    for ( i = 0; i < bodies.length; i++ ) {
//      this.addChild( new PathNode( bodies[i], mode.transform, module.showPathProperty, bodies[i].getColor() ) );
//      console.log( i );
    }


    var forceVectorColorFill = new Color( 50, 130, 215 );
    var forceVectorColorOutline = new Color(64, 64, 64);
    var velocityVectorColorFill = new Color( 255, 85, 0 );
    var velocityVectorColorOutline = new Color(64, 64, 64);

    //Use canvas coordinates to determine whether something has left the visible area
    var returnable = [];
    for ( i = 0; i < bodies.length; i++ ) {
      var bodyNode = new BodyNode( bodies[i], mode.transform, mousePositionProperty, this, bodies[i].getLabelAngle(), module.whiteBackgroundProperty );
      this.addChild( bodyNode );

//      var property = new Property( false );
//      property.link( function( value ) {
//        var canvasBounds = new Rectangle.Number( 0, 0, GravityAndOrbitsCanvas.this.getWidth(), GravityAndOrbitsCanvas.this.getHeight() );
//        set( !canvasBounds.intersects( bodyNode.getGlobalFullBounds() ) );
//      } );
//
//      returnable.push( new Property( false ).withAnonymousClassBody( {
//        initializer: function() {
//          var updateReturnable = new SimpleObserver().withAnonymousClassBody( {
//            update: function() {
//              var canvasBounds = new Rectangle.Number( 0, 0, GravityAndOrbitsCanvas.this.getWidth(), GravityAndOrbitsCanvas.this.getHeight() );
//              set( !canvasBounds.intersects( bodyNode.getGlobalFullBounds() ) );
//            }
//          } );
//          body.getPositionProperty().addObserver( updateReturnable );
//          //This listener solves the problem that the 'return object' button is in the wrong state on startup
//          addHierarchyListener( new HierarchyListener().withAnonymousClassBody( {
//            hierarchyChanged: function( e ) {
//              updateReturnable.update();
//            }
//          } ) );
//          //This component listener solves the problem that the 'return object' button is in the wrong state when switching between modes
//          addComponentListener( new ComponentAdapter().withAnonymousClassBody( {
//            componentResized: function( e ) {
//              updateReturnable.update();
//            }
//          } ) );
//        }
//      } ) );
//
//      this.addChild( mode.massReadoutFactory.apply( bodyNode, module.showMassProperty ) );
    }

//    //Add gravity force vector nodes
//    for ( i = 0; i < bodies.length; i++ ) {
//      this.addChild( new VectorNode( bodies[i], mode.transform, module.showGravityForceProperty, bodies[i].getForceProperty(), forceScale, forceVectorColorFill, forceVectorColorOutline ) );
//    }
//
//    //Add velocity vector nodes
//    for ( i = 0; i < bodies.length; i++ ) {
//      if ( !bodies[i].fixed ) {
//        this.addChild( new GrabbableVectorNode( bodies[i], mode.transform, module.showVelocityProperty, bodies[i].getVelocityProperty(), mode.getVelocityVectorScale(), velocityVectorColorFill, velocityVectorColorOutline, //TODO: i18n of "V", also recommended to trim to 1 char
//          "V" ) );
//      }
//    }
//
//    //Add explosion nodes, which are always in the scene graph but only visible during explosions
//    for ( i = 0; i < bodies.length; i++ ) {
//      this.addChild( new ExplosionNode( bodies[i], mode.transform ) );
//    }
//
//    //Add the piccolo node for the overlay grid, setting its visibility based on the module.showGridProperty
//    this.addChild( new GridNode( mode.transform, mode.getGridSpacing(), mode.getGridCenter() ).withAnonymousClassBody( {
//      initializer: function() {
//        module.showGridProperty.addObserver( new SimpleObserver().withAnonymousClassBody( {
//          update: function() {
//            setVisible( module.showGridProperty.get() );
//          }
//        } ) );
//      }
//    } ) );
//
//    // Control Panel
//    var controlPanelNode = new ControlPanelNode( new PSwing( new GravityAndOrbitsControlPanel( module, model ) ), BACKGROUND, new BasicStroke( 3 ), green, 4 ).withAnonymousClassBody( {
//      initializer: function() {
//        setOffset( GravityAndOrbitsCanvas.STAGE_SIZE.getWidth() - getFullBounds().getWidth(), 2 );
//        //fine tuned so that control panels for all modes always fit on the screen, and match up with each other
//        setScale( 0.82 );
//      }
//    } );
//
//    this.addChild( controlPanelNode );
//
//    //Reset mode button
//    var buttonForegroundColor = BLACK;
//    var resetModeButton = new TextButtonNode( RESET, CONTROL_FONT ).withAnonymousClassBody( {
//      initializer: function() {
//        setUserComponent( UserComponents.resetButton );
//        setForeground( buttonForegroundColor );
//        setBackground( buttonBackgroundColor );
//        setOffset( controlPanelNode.getFullBounds().getCenterX() - getFullBounds().getWidth() / 2, controlPanelNode.getFullBounds().getMaxY() + 5 );
//        addActionListener( new ActionListener().withAnonymousClassBody( {
//          actionPerformed: function( e ) {
//            //also clears the deviated enable flag
//            module.modeProperty.get().resetMode();
//          }
//        } ) );
//      }
//    } );
//
//    this.addChild( resetModeButton );
//
//    //Reset all button
//    this.addChild( new ResetAllButtonNode( module, this, CONTROL_FONT.getSize(), buttonForegroundColor, buttonBackgroundColor ).withAnonymousClassBody( {
//      initializer: function() {
//        setFont( CONTROL_FONT );
//        setOffset( resetModeButton.getFullBounds().getCenterX() - getFullBounds().getWidth() / 2, resetModeButton.getFullBounds().getMaxY() + 5 );
//        setConfirmationEnabled( false );
//      }
//    } ) );
//
//    //Make it so a "reset" button appears if anything has changed in the sim
//    var p = [];
//    for ( var body in model.getBodies() ) {
//      p.add( body.anyPropertyDifferent() );
//    }
//
//    //Add the clock control within the play area
//    addChild( new FloatingClockControlNode( module.playButtonPressed, mode.getTimeFormatter(), model.getClock(), CLEAR, new IfElse( module.whiteBackgroundProperty, Color.black, Color.white ) ).withAnonymousClassBody( {
//      initializer: function() {
//        setOffset( GravityAndOrbitsCanvas.STAGE_SIZE.getWidth() / 2 - getFullBounds().getWidth() / 2, GravityAndOrbitsCanvas.STAGE_SIZE.getHeight() - getFullBounds().getHeight() );
//        // Add the rewind button and hook it up as needed.
//        var rewindButton = new FloatingRewindButton().withAnonymousClassBody( {
//          initializer: function() {
//            addListener( new DefaultIconButton.Listener().withAnonymousClassBody( {
//              buttonPressed: function() {
//                mode.rewind();
//              }
//            } ) );
//            // changed, otherwise there is nothing to rewind to.
//            var anyPropertyChanged = new MultiwayOr( p );
//            anyPropertyChanged.addObserver( new SimpleObserver().withAnonymousClassBody( {
//              update: function() {
//                setEnabled( anyPropertyChanged.get() );
//              }
//            } ) );
//          }
//        } );
//        addChild( rewindButton );
//        assert && assert( mode.timeSpeedScaleProperty != null );
//        // Add the speed control slider.
//        addChild( new SimSpeedControlPNode( 0.1, mode.timeSpeedScaleProperty, 2.0, rewindButton.getFullBoundsReference().getMinX(), new IfElse( module.whiteBackgroundProperty, Color.black, Color.white ) ) );
//      }
//    } ) );
//    addChild( new MeasuringTape( module.measuringTapeVisibleProperty, mode.measuringTapeStartPoint, mode.measuringTapeEndPoint, mode.transform ) );
//    // shows the bounds of the "stage", which is different from the canvas
//    if ( false ) {
//      addChild( new PhetPPath( new Rectangle.Number( 0, 0, STAGE_SIZE.width, STAGE_SIZE.height ), new BasicStroke( 1
//      f
//    ),
//      Color.RED
//    ))
//      ;
//    }
//    //Tell each of the bodies about the stage size (in model coordinates) so they know if they are out of bounds
//    var stage = new Rectangle.Number( 0, 0, STAGE_SIZE.width, STAGE_SIZE.height );
//    for ( var body in mode.getModel().getBodies() ) {
//      body.getBounds().set( mode.transform.get().viewToModel( stage ) );
//    }
//    //If any body is out of bounds, show a "return object" button
//    var anythingReturnable = new MultiwayOr( returnable );
//    addChild( new TextButtonNode( RETURN_OBJECT ).withAnonymousClassBody( {
//      initializer: function() {
//        setFont( CONTROL_FONT );
//        setBackground( buttonBackgroundColor );
//        addActionListener( new ActionListener().withAnonymousClassBody( {
//          actionPerformed: function( e ) {
//            model.returnBodies();
//            //At 3/21/2011 meeting we decided that "return object" button should also always pause the clock.
//            module.playButtonPressed.set( false );
//          }
//        } ) );
//        anythingReturnable.addObserver( new SimpleObserver().withAnonymousClassBody( {
//          update: function() {
//            setVisible( anythingReturnable.get() );
//          }
//        } ) );
//        setOffset( 100, 100 );
//      }
//    } ) );
//    //Zoom controls
//    addChild( createZoomControls( mode ) );
  }

  return inherit( Node, GravityAndOrbitsCanvas, {
//TODO: this anonymous PNode should be a PNode subclass, it's not reusable

      //private
      createZoomControls: function( mode ) {
        return new Node().withAnonymousClassBody( {
          initializer: function() {
            var MAX = 1.5;
            var MIN = 0.5;
            var DELTA_ZOOM = 0.1;
            var zoomButtonFont = new PhetFont( 20, true );
            var inText = new PText( GAOStrings.ZOOM_IN ).withAnonymousClassBody( {
              initializer: function() {
                setFont( zoomButtonFont );
              }
            } );
            var outText = new PText( GAOStrings.ZOOM_OUT ).withAnonymousClassBody( {
              initializer: function() {
                setFont( zoomButtonFont );
              }
            } );
            var size = new PDimension( Math.max( inText.getFullBounds().getWidth(), outText.getFullBounds().getWidth() ), Math.max( inText.getFullBounds().getHeight(), outText.getFullBounds().getHeight() ) );
            //bring in the insets a bit so there isn't so much padding
            var dim = Math.max( size.getWidth(), size.getHeight() ) - 7;
            var zoomInButton = new ZoomButtonNode( UserComponents.zoomInButton, inText, Color.black, buttonBackgroundColor, dim, dim ).withAnonymousClassBody( {
              initializer: function() {
                setFont( zoomButtonFont );
                addActionListener( new ActionListener().withAnonymousClassBody( {
                  actionPerformed: function( e ) {
                    mode.zoomLevel.set( Math.min( MAX, mode.zoomLevel.get() + DELTA_ZOOM ) );
                  }
                } ) );
                mode.zoomLevel.addObserver( new SimpleObserver().withAnonymousClassBody( {
                  update: function() {
                    setEnabled( mode.zoomLevel.get() != MAX );
                  }
                } ) );
              }
            } );
            var zoomOutButton = new ZoomButtonNode( UserComponents.zoomOutButton, outText, Color.black, buttonBackgroundColor, dim, dim ).withAnonymousClassBody( {
              initializer: function() {
                setFont( zoomButtonFont );
                addActionListener( new ActionListener().withAnonymousClassBody( {
                  actionPerformed: function( e ) {
                    mode.zoomLevel.set( Math.max( MIN, mode.zoomLevel.get() - DELTA_ZOOM ) );
                  }
                } ) );
                mode.zoomLevel.addObserver( new SimpleObserver().withAnonymousClassBody( {
                  update: function() {
                    setEnabled( mode.zoomLevel.get() != MIN );
                  }
                } ) );
              }
            } );
            var slider = new PSwing( new JSlider( JSlider.VERTICAL, 0, 100, 50 ).withAnonymousClassBody( {
              initializer: function() {
                setBackground( new Color( 0, 0, 0, 0 ) );
                setPaintTicks( true );
                setMajorTickSpacing( 25 );
                var modelToView = new Function.LinearFunction( 0, 100, MIN, MAX );
                addChangeListener( new ChangeListener().withAnonymousClassBody( {
                  stateChanged: function( e ) {
                    mode.zoomLevel.set( modelToView.evaluate( getValue() ) );
                  }
                } ) );
                mode.zoomLevel.addObserver( new SimpleObserver().withAnonymousClassBody( {
                  update: function() {
                    setValue( modelToView.createInverse().evaluate( mode.zoomLevel.get() ) );
                  }
                } ) );
              }
            } ) );
            slider.setScale( 0.7 );
            slider.setOffset( 0, zoomInButton.getFullBounds().getMaxY() );
            zoomOutButton.setOffset( 0, slider.getFullBounds().getMaxY() );
            addChild( zoomInButton );
            addChild( slider );
            addChild( zoomOutButton );
            setOffset( 10, 10 );
          }
        } );
      },

      //private
//      addChild: function( node ) {
//        this.rootNode.addChild( node );
//      }
    },
//statics
    {
      STAGE_SIZE: STAGE_SIZE,
      buttonBackgroundColor: buttonBackgroundColor
    } );
} );
