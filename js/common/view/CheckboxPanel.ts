// Copyright 2015-2022, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { colorProfileProperty, HBox, HBoxOptions, Image, SceneryConstants, Text, TextOptions } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import iconMass_png from '../../../images/iconMass_png.js';
import pathIcon_png from '../../../images/pathIcon_png.js';
import pathIconProjector_png from '../../../images/pathIconProjector_png.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import GravityAndOrbitsStrings from '../../GravityAndOrbitsStrings.js';
import GravityAndOrbitsColors from '../GravityAndOrbitsColors.js';
import GridNode from '../../../../scenery-phet/js/GridNode.js';
import GravityAndOrbitsModel from '../model/GravityAndOrbitsModel.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupItem, VerticalCheckboxGroupOptions } from '../../../../sun/js/VerticalCheckboxGroup.js';

// constants
const FONT = new PhetFont( 18 );
const ARROW_Y_COORDINATE = -10;
const CHECKBOX_OPTIONS = {
  scale: 0.8,
  checkboxColor: GravityAndOrbitsColors.foregroundProperty,
  checkboxColorBackground: GravityAndOrbitsColors.backgroundProperty
};
const TEXT_OPTIONS = {
  font: FONT,
  fill: GravityAndOrbitsColors.foregroundProperty
};

const SPACING = 10;

const HBOX_OPTIONS = {
  maxWidth: 240,
  spacing: SPACING
};

type SelfOptions = EmptySelfOptions;

type CheckboxPanelOptions = SelfOptions & VerticalCheckboxGroupOptions;

class CheckboxPanel extends VerticalCheckboxGroup {

  public constructor( model: GravityAndOrbitsModel, providedOptions?: CheckboxPanelOptions ) {

    const items: VerticalCheckboxGroupItem[] = [ {
      property: model.showGravityForceProperty,
      createNode: tandem => new HBox( merge( {
        children: [
          new Text( GravityAndOrbitsStrings.gravityForceStringProperty, combineOptions<TextOptions>( { tandem: tandem.createTandem( 'labelText' ) }, TEXT_OPTIONS ) ),
          new ArrowNode( 135, ARROW_Y_COORDINATE, 180, ARROW_Y_COORDINATE, { fill: '#4380C2' } )
        ]
      }, HBOX_OPTIONS ) ),
      tandemName: 'gravityForceCheckbox',
      options: CHECKBOX_OPTIONS
    }, {

      // velocity checkbox
      property: model.showVelocityProperty,
      createNode: tandem => new HBox( merge( {
        children: [
          new Text( GravityAndOrbitsStrings.velocityStringProperty, combineOptions<TextOptions>( { tandem: tandem.createTandem( 'labelText' ) }, TEXT_OPTIONS ) ),
          new ArrowNode( 95, ARROW_Y_COORDINATE, 140, ARROW_Y_COORDINATE, { fill: PhetColorScheme.VELOCITY } )
        ]
      }, HBOX_OPTIONS ) ),
      tandemName: 'velocityCheckbox',
      options: CHECKBOX_OPTIONS
    }
    ];

    // mass checkbox
    if ( model.showMassCheckbox ) {
      items.push( {
        property: model.showMassProperty,
        tandemName: 'massCheckbox',
        createNode: tandem => new HBox( merge( {
          children: [
            new Text( GravityAndOrbitsStrings.massStringProperty, combineOptions<TextOptions>( { tandem: tandem.createTandem( 'labelText' ) }, TEXT_OPTIONS ) ),
            new Image( iconMass_png, { scale: 0.8 } )
          ]
        }, HBOX_OPTIONS ) ),
        options: CHECKBOX_OPTIONS
      } );
    }

    const pathIconImageNode = new Image( pathIcon_png, { scale: 0.25 } );
    colorProfileProperty.lazyLink( ( profileName: string ) => {
      assert && assert( profileName === SceneryConstants.DEFAULT_COLOR_PROFILE || profileName === SceneryConstants.PROJECTOR_COLOR_PROFILE );
      pathIconImageNode.setImage( profileName === SceneryConstants.PROJECTOR_COLOR_PROFILE ? pathIconProjector_png : pathIcon_png );
    } );

    // path checkbox
    items.push( {
      property: model.showPathProperty,
      tandemName: 'pathCheckbox',
      createNode: tandem => new HBox( merge( {
        children: [
          new Text( GravityAndOrbitsStrings.pathStringProperty, combineOptions<TextOptions>( { tandem: tandem.createTandem( 'labelText' ) }, TEXT_OPTIONS ) ),
          pathIconImageNode
        ]
      }, HBOX_OPTIONS ) ),
      options: CHECKBOX_OPTIONS
    } );

    // grid checkbox
    items.push( {
      property: model.showGridProperty,
      tandemName: 'gridCheckbox',
      createNode: tandem => new HBox( merge( {
        children: [
          new Text( GravityAndOrbitsStrings.gridStringProperty, combineOptions<TextOptions>( { tandem: tandem.createTandem( 'labelText' ) }, TEXT_OPTIONS ) ),
          new GridNode( new Property( ModelViewTransform2.createIdentity() ), 10, new Vector2( 0, 0 ), 1, {
            stroke: GravityAndOrbitsColors.gridIconStrokeColorProperty,
            lineWidth: 1.5
          } )
        ]
      }, HBOX_OPTIONS ) ),
      options: CHECKBOX_OPTIONS
    } );

    // measuring tape checkbox
    if ( model.showMeasuringTape ) {
      const measuringTapeIcon = MeasuringTapeNode.createIcon( { scale: 0.4 } );
      items.push( {
        property: model.showMeasuringTapeProperty,
        tandemName: 'measuringTapeCheckbox',
        createNode: tandem => new HBox( combineOptions<HBoxOptions>( {
          align: 'top',
          children: [
            new Text( GravityAndOrbitsStrings.measuringTapeStringProperty, combineOptions<TextOptions>( { tandem: tandem.createTandem( 'labelText' ) }, TEXT_OPTIONS ) ),
            measuringTapeIcon
          ]
        }, HBOX_OPTIONS ) ),
        options: CHECKBOX_OPTIONS
      } );
    }

    const options = optionize<CheckboxPanelOptions, SelfOptions, VerticalCheckboxGroupOptions>()( {
      spacing: SPACING,
      align: 'left',
      bottom: -12,
      tandem: Tandem.REQUIRED
    }, providedOptions );
    super( items, options );
  }
}

gravityAndOrbits.register( 'CheckboxPanel', CheckboxPanel );
export default CheckboxPanel;