// Copyright 2014-2025, University of Colorado Boulder

/**
 * GravityAndOrbitsScreenView. This file was not in the original Java code, but was created to have the sim follow the
 * PhET HTML5 sim conventions.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import ManualConstraint from '../../../../scenery/js/layout/constraints/ManualConstraint.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsConstants from '../GravityAndOrbitsConstants.js';
import GravityAndOrbitsModel from '../model/GravityAndOrbitsModel.js';
import GravityAndOrbitsControls from './GravityAndOrbitsControls.js';
import GravityAndOrbitsTimeControlNode from './GravityAndOrbitsTimeControlNode.js';
import MassControlPanel from './MassControlPanel.js';

// constants
const MARGIN = 5;

class GravityAndOrbitsScreenView extends ScreenView {

  /**
   * Constructor for GravityAndOrbitsScreenView. This is the ScreenView for both screens in this sim.
   */
  public constructor( model: GravityAndOrbitsModel, tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    // Control panel in the upper right of the play area.
    const controlPanelTandem = tandem.createTandem( 'controlPanel' );
    const controlPanel = new GravityAndOrbitsControls( model, this, {
      tandem: controlPanelTandem // The outer Panel below is instrumented, this is just to pass the tandem to children
    } );

    // Container so all mass control panels (for each scene) can be hidden/shown at once
    const massesControlPanelTandem = tandem.createTandem( 'massesControlPanel' );
    const massesControlPanel = new VBox();

    // Container so all play areas (for each scene) can be hidden/shown at once
    const playAreaNodeTandem = tandem.createTandem( GravityAndOrbitsConstants.PLAY_AREA_TANDEM_NAME );
    const playAreaNode = new Node( {
      tandem: playAreaNodeTandem
    } );

    // Add the scene selection controls, one for each of the four modes
    model.getScenes().forEach( scene => {
      const sceneView = scene.sceneView;

      const massControlPanel = new MassControlPanel( scene.getMassSettableBodies(), {

        // Nest under massesControlPanel, see https://github.com/phetsims/gravity-and-orbits/issues/284#issuecomment-554106611
        tandem: massesControlPanelTandem.createTandem( scene.massControlPanelTandemName )
      } );
      scene.massControlPanel = massControlPanel;

      playAreaNode.addChild( sceneView );
      massesControlPanel.addChild( massControlPanel );
    } );
    this.addChild( playAreaNode );

    // add the control panel on top of the canvases
    this.addChild( new VBox( {
      top: this.layoutBounds.top + MARGIN,
      right: this.layoutBounds.right - MARGIN,
      spacing: MARGIN,
      stretch: true,
      children: [
        new Panel( controlPanel, combineOptions<PanelOptions>( {}, GravityAndOrbitsConstants.CONTROL_PANEL_OPTIONS, {
          tandem: controlPanelTandem,
          visiblePropertyOptions: {
            phetioReadOnly: false
          },
          align: 'left'
        } ) ),
        new Panel( massesControlPanel, combineOptions<PanelOptions>( {}, GravityAndOrbitsConstants.CONTROL_PANEL_OPTIONS, {
          tandem: massesControlPanelTandem,
          visiblePropertyOptions: {
            phetioReadOnly: false
          },
          align: 'left'
        } ) )
      ]
    } ) );

    // Make sure only one scene is visible at a time
    model.sceneProperty.link( scene => {
      for ( let i = 0; i < model.sceneList.scenes.length; i++ ) {
        const gravityAndOrbitsScene = model.sceneList.scenes[ i ];
        gravityAndOrbitsScene.sceneView.visible = false;
        if ( gravityAndOrbitsScene.massControlPanel ) {
          gravityAndOrbitsScene.massControlPanel.visible = false;
        }
      }
      scene.sceneView.visible = true;
      if ( scene.massControlPanel ) {
        scene.massControlPanel.visible = true;
      }
      model.updateActiveModule();
    } );

    // Add play/pause, rewind, and step buttons
    const timeControlNode = new GravityAndOrbitsTimeControlNode( model, {
      tandem: tandem.createTandem( 'timeControlNode' )
    } );
    this.addChild( timeControlNode );

    // Node to be used for getting the correct coordinates to position the TimeControlNode
    const positionerNode = new Rectangle( 0, 0, 1, 10, {
      visible: false,
      centerX: this.layoutBounds.centerX - 117,
      bottom: this.layoutBounds.bottom - MARGIN
    } );
    this.addChild( positionerNode );

    // Calculate the center point of the spacer in parent coordinates, just for the x-coordinate
    const targetCenter = this.globalToParentPoint( positionerNode.globalBounds.center );

    ManualConstraint.create( this, [ timeControlNode ], timeControlNodeProxy => {
      timeControlNodeProxy.x = targetCenter.x;
      timeControlNodeProxy.bottom = this.layoutBounds.bottom - MARGIN;
    } );

    // Create and add the Reset All Button in the bottom right, which resets the model
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that are in progress
        model.reset();
      },
      right: this.layoutBounds.right - MARGIN - 4,
      bottom: this.layoutBounds.bottom - MARGIN - 4, // slight difference centers below panels
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }
}

gravityAndOrbits.register( 'GravityAndOrbitsScreenView', GravityAndOrbitsScreenView );
export default GravityAndOrbitsScreenView;