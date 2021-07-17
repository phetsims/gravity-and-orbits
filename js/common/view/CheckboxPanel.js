// Copyright 2015-2020, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import colorProfileNameProperty from '../../../../scenery/js/util/colorProfileNameProperty.js';
import ColorProfileProperty from '../../../../scenery/js/util/ColorProfileProperty.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import iconMassImg from '../../../images/icon_mass_png.js';
import pathIconImg from '../../../images/path_icon_png.js';
import pathIconProjectorImg from '../../../images/path_icon_projector_png.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import gravityAndOrbitsStrings from '../../gravityAndOrbitsStrings.js';
import GravityAndOrbitsConstants from '../GravityAndOrbitsConstants.js';
import GravityAndOrbitsGridNode from './GravityAndOrbitsGridNode.js';

const gravityForceString = gravityAndOrbitsStrings.gravityForce;
const gridString = gravityAndOrbitsStrings.grid;
const massString = gravityAndOrbitsStrings.mass;
const measuringTapeString = gravityAndOrbitsStrings.measuringTape;
const pathString = gravityAndOrbitsStrings.path;
const velocityString = gravityAndOrbitsStrings.velocity;

// constants
const FONT = new PhetFont( 18 );
const ARROW_Y_COORDINATE = -10;
const CHECKBOX_OPTIONS = {
  scale: 0.8,
  checkboxColor: GravityAndOrbitsConstants.FOREGROUND_COLOR_PROPERTY,
  checkboxColorBackground: GravityAndOrbitsConstants.BACKGROUND_COLOR_PROPERTY
};
const TEXT_OPTIONS = {
  font: FONT,
  fill: GravityAndOrbitsConstants.FOREGROUND_COLOR_PROPERTY
};

const SPACING = 10;

const HBOX_OPTIONS = {
  maxWidth: 240,
  spacing: SPACING
};

class CheckboxPanel extends VBox {

  /**
   * @param {GravityAndOrbitsModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    const children = [];

    const gravityForceTextNode = new Text( gravityForceString, TEXT_OPTIONS );
    const velocityTextNode = new Text( velocityString, TEXT_OPTIONS );
    const massTextNode = new Text( massString, TEXT_OPTIONS );
    const pathTextNode = new Text( pathString, TEXT_OPTIONS );
    const gridTextNode = new Text( gridString, TEXT_OPTIONS );
    const measuringTapeTextNode = new Text( measuringTapeString, TEXT_OPTIONS );

    const optionsWithTandem = tandemName => merge( { tandem: options.tandem.createTandem( tandemName ) }, CHECKBOX_OPTIONS );

    // gravity force checkbox
    children.push( new Checkbox( new HBox( merge( {
        children: [
          gravityForceTextNode,
          new ArrowNode( 135, ARROW_Y_COORDINATE, 180, ARROW_Y_COORDINATE, { fill: '#4380C2' } )
        ]
      }, HBOX_OPTIONS ) ),
      model.showGravityForceProperty, optionsWithTandem( 'gravityForceCheckbox' ) ) );

    // velocity checkbox
    children.push( new Checkbox( new HBox( merge( {
        children: [
          velocityTextNode,
          new ArrowNode( 95, ARROW_Y_COORDINATE, 140, ARROW_Y_COORDINATE, { fill: PhetColorScheme.VELOCITY } )
        ]
      }, HBOX_OPTIONS ) ),
      model.showVelocityProperty, optionsWithTandem( 'velocityCheckbox' ) ) );

    // mass checkbox
    if ( model.showMassCheckbox ) {
      children.push( new Checkbox( new HBox( merge( {
          children: [
            massTextNode,
            new Image( iconMassImg, { scale: 0.8 } )
          ]
        }, HBOX_OPTIONS ) ),
        model.showMassProperty, optionsWithTandem( 'massCheckbox' ) ) );
    }

    const pathIconImageNode = new Image( pathIconImg, { scale: 0.25 } );
    colorProfileNameProperty.lazyLink( profileName => {
      assert && assert( profileName === 'default' || profileName === 'projector' );
      pathIconImageNode.setImage( profileName === 'projector' ? pathIconProjectorImg : pathIconImg );
    } );

    // path checkbox
    children.push( new Checkbox( new HBox( merge( {
        children: [
          pathTextNode,
          pathIconImageNode
        ]
      }, HBOX_OPTIONS ) ),
      model.showPathProperty, optionsWithTandem( 'pathCheckbox' ) ) );

    // grid checkbox
    children.push( new Checkbox( new HBox( merge( {
        children: [
          gridTextNode,
          new GravityAndOrbitsGridNode( new Property( ModelViewTransform2.createIdentity() ), 10, new Vector2( 0, 0 ), 1, {
            majorLineOptions: {
              stroke: new ColorProfileProperty( 'grid icon stroke', { default: 'gray', projector: 'black' }, {
                tandem: options.tandem.createTandem( 'gridCheckbox' ).createTandem( 'strokeProperty' )
              } ),
              lineWidth: 1.5
            }
          } )
        ]
      }, HBOX_OPTIONS ) ),
      model.showGridProperty, optionsWithTandem( 'gridCheckbox' ) ) );

    // measuring tape checkbox
    if ( model.showMeasuringTape ) {
      const measuringTapeIcon = MeasuringTapeNode.createIcon( { scale: 0.4 } );
      children.push( new Checkbox( new HBox( merge( {
        align: 'top',
        children: [
          measuringTapeTextNode,
          measuringTapeIcon
        ]
      }, HBOX_OPTIONS ) ), model.showMeasuringTapeProperty, optionsWithTandem( 'measuringTapeCheckbox' ) ) );
    }

    // increase the touch area of the checkboxes
    const touchAreaHeight = 32;
    for ( let i = 0; i < children.length; i++ ) {
      const checkboxNode = children[ i ];
      const bounds = checkboxNode.parentToLocalBounds( checkboxNode.bounds );
      checkboxNode.touchArea = Shape.rectangle( -5, bounds.centerY - touchAreaHeight / 2, bounds.width + 10, touchAreaHeight );
    }

    super( merge( {
      excludeInvisibleChildrenFromBounds: true,
      children: children,
      spacing: SPACING,
      align: 'left',
      bottom: -12,
      tandem: Tandem.REQUIRED
    }, options ) );
  }
}

gravityAndOrbits.register( 'CheckboxPanel', CheckboxPanel );
export default CheckboxPanel;