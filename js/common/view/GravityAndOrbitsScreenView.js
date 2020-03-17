// Copyright 2014-2020, University of Colorado Boulder

/**
 * GravityAndOrbitsScreenView. This file was not in the original Java code, but was created to have the sim follow the
 * PhET HTML5 sim conventions.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsConstants from '../GravityAndOrbitsConstants.js';
import GravityAndOrbitsControlPanel from './GravityAndOrbitsControlPanel.js';
import MassControlPanel from './MassControlPanel.js';
import GravityAndOrbitsTimeControlNode from './GravityAndOrbitsTimeControlNode.js';

// constants
const MARGIN = 5;

class GravityAndOrbitsScreenView extends ScreenView {

  /**
   * Constructor for GravityAndOrbitsScreenView. This is the ScreenView for both screens in this sim.
   *
   * @param {GravityAndOrbitsModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super();

    // Control panel in the upper right of the play area
    const controlPanel = new GravityAndOrbitsControlPanel( model, {
      top: this.layoutBounds.top + MARGIN,
      right: this.layoutBounds.right - MARGIN,
      tandem: tandem.createTandem( 'controlPanel' )
    } );

    // Container so all mass control panels (for each scene) can be hidden/shown at once
    const massesControlPanelTandem = tandem.createTandem( 'massesControlPanel' );
    const massesControlPanel = new Node( {
      tandem: massesControlPanelTandem
    } );

    // Container so all play areas (for each scene) can be hidden/shown at once
    const playAreaNodeTandem = tandem.createTandem( GravityAndOrbitsConstants.PLAY_AREA_TANDEM_NAME );
    const playAreaNode = new Node( {
      tandem: playAreaNodeTandem
    } );

    // Add the scene selection controls, one for each of the four modes
    model.getScenes().forEach( scene => {
      const sceneView = scene.sceneView;

      const massControlPanel = new MassControlPanel( scene.getMassSettableBodies(), {
        top: controlPanel.bottom + MARGIN,
        right: this.layoutBounds.right - MARGIN,

        // Nest under massesControlPanel, see https://github.com/phetsims/gravity-and-orbits/issues/284#issuecomment-554106611
        tandem: massesControlPanelTandem.createTandem( scene.massControlPanelTandemName )
      } );
      scene.massControlPanel = massControlPanel;

      playAreaNode.addChild( sceneView );
      massesControlPanel.addChild( massControlPanel );
    } );
    this.addChild( playAreaNode );
    this.addChild( massesControlPanel );

    // add the control panel on top of the canvases
    this.addChild( controlPanel );

    // Make sure only one scene is visible at a time
    model.sceneProperty.link( scene => {
      for ( let i = 0; i < model.sceneList.scenes.length; i++ ) {
        model.sceneList.scenes[ i ].sceneView.visible = false;
        model.sceneList.scenes[ i ].massControlPanel.visible = false;
      }
      scene.sceneView.visible = true;
      scene.massControlPanel.visible = true;
      model.updateActiveModule();
    } );

    // Add play/pause, rewind, and step buttons
    const timeControlNode = new GravityAndOrbitsTimeControlNode( model, {
      tandem: tandem.createTandem( 'timeControlNode' )
    } );
    this.addChild( timeControlNode );
    timeControlNode.setPlayPauseButtonCenter( new Vector2( this.layoutBounds.centerX - 117, this.layoutBounds.bottom - timeControlNode.height / 2 - MARGIN ) );

    // spacing to put the SpeedRadioButtonGroup at the edge of the layout bounds - current spacing
    // plus distance from the left of the TimeControlNode to left edge of layout bounds
    timeControlNode.setButtonGroupXSpacing( timeControlNode.buttonGroupXSpacing + timeControlNode.left - this.layoutBounds.left - MARGIN );

    // Create and add the Reset All Button in the bottom right, which resets the model
    const resetAllButton = new ResetAllButton( {
      listener: () => model.reset(),
      right: this.layoutBounds.right - MARGIN - 4,
      bottom: this.layoutBounds.bottom - MARGIN - 4, // slight difference centers below panels
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }
}

gravityAndOrbits.register( 'GravityAndOrbitsScreenView', GravityAndOrbitsScreenView );
export default GravityAndOrbitsScreenView;