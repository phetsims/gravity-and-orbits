// Copyright 2015-2020, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Checkbox = require( 'SUN/Checkbox' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  const GridNode = require( 'GRAVITY_AND_ORBITS/common/view/GridNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  const merge = require( 'PHET_CORE/merge' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Shape = require( 'KITE/Shape' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );

  // images
  const iconMassImg = require( 'image!GRAVITY_AND_ORBITS/icon_mass.png' );
  const pathIconImg = require( 'image!GRAVITY_AND_ORBITS/path_icon.png' );
  const pathIconProjectorImg = require( 'image!GRAVITY_AND_ORBITS/path_icon_projector.png' );

  // strings
  const gravityForceString = require( 'string!GRAVITY_AND_ORBITS/gravityForce' );
  const gridString = require( 'string!GRAVITY_AND_ORBITS/grid' );
  const massString = require( 'string!GRAVITY_AND_ORBITS/mass' );
  const measuringTapeString = require( 'string!GRAVITY_AND_ORBITS/measuringTape' );
  const pathString = require( 'string!GRAVITY_AND_ORBITS/path' );
  const velocityString = require( 'string!GRAVITY_AND_ORBITS/velocity' );

  // constants
  const FONT = new PhetFont( 18 );
  const ARROW_Y_COORDINATE = -10;
  const CHECKBOX_OPTIONS = {
    scale: 0.8,
    checkboxColor: GravityAndOrbitsColorProfile.panelTextProperty,
    checkboxColorBackground: GravityAndOrbitsColorProfile.checkboxFillProperty,
    maxWidth: 250
  };
  const TEXT_OPTIONS = { font: FONT, fill: GravityAndOrbitsColorProfile.panelTextProperty };
  const SPACING = 10;

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
      children.push( new Checkbox( new HBox( {
          spacing: SPACING,
          children: [
            gravityForceTextNode,
            new ArrowNode( 135, ARROW_Y_COORDINATE, 180, ARROW_Y_COORDINATE, { fill: '#4380C2' } )
          ]
        } ),
        model.showGravityForceProperty, optionsWithTandem( 'gravityForceCheckbox' ) ) );

      // velocity checkbox
      children.push( new Checkbox( new HBox( {
          spacing: SPACING,
          children: [
            velocityTextNode,
            new ArrowNode( 95, ARROW_Y_COORDINATE, 140, ARROW_Y_COORDINATE, { fill: PhetColorScheme.RED_COLORBLIND } )
          ]
        } ),
        model.showVelocityProperty, optionsWithTandem( 'velocityCheckbox' ) ) );

      // mass checkbox
      if ( model.showMassCheckbox ) {
        children.push( new Checkbox( new HBox( {
            spacing: SPACING,
            children: [
              massTextNode,
              new Image( iconMassImg, { scale: 0.8 } )
            ]
          } ),
          model.showMassProperty, optionsWithTandem( 'massCheckbox' ) ) );
      }

      const pathIconImageNode = new Image( pathIconImg, { scale: 0.25 } );
      GravityAndOrbitsColorProfile.profileNameProperty.lazyLink( profileName => {
        assert && assert( profileName === 'default' || profileName === 'projector' );
        pathIconImageNode.setImage( profileName === 'projector' ? pathIconProjectorImg : pathIconImg );
      } );

      // path checkbox
      children.push( new Checkbox( new HBox( {
          spacing: SPACING,
          children: [
            pathTextNode,
            pathIconImageNode
          ]
        } ),
        model.showPathProperty, optionsWithTandem( 'pathCheckbox' ) ) );

      // grid checkbox
      children.push( new Checkbox( new HBox( {
          spacing: SPACING,
          children: [
            gridTextNode,
            new GridNode( new Property( ModelViewTransform2.createIdentity() ), 10, new Vector2( 0, 0 ), 1, {
              stroke: GravityAndOrbitsColorProfile.gridIconProperty,
              lineWidth: 1.5
            } )
          ]
        } ),
        model.showGridProperty, optionsWithTandem( 'gridCheckbox' ) ) );

      // measuring tape checkbox
      if ( model.showMeasuringTape ) {
        const measuringTapeIcon = MeasuringTapeNode.createIcon( { scale: 0.4 } );
        children.push( new Checkbox( new HBox( {
          spacing: SPACING,
          align: 'top',
          children: [
            measuringTapeTextNode,
            measuringTapeIcon
          ]
        } ), model.showMeasuringTapeProperty, optionsWithTandem( 'measuringTapeCheckbox' ) ) );
      }

      // increase the touch area of the checkboxes
      const touchAreaHeight = 32;
      for ( let i = 0; i < children.length; i++ ) {
        const checkboxNode = children[ i ];
        const bounds = checkboxNode.parentToLocalBounds( checkboxNode.bounds );
        checkboxNode.touchArea = Shape.rectangle( -5, bounds.centerY - touchAreaHeight / 2, bounds.width + 10, touchAreaHeight );
      }

      super( merge( {
        children: children,
        spacing: SPACING,
        align: 'left',
        bottom: -12,
        tandem: Tandem.REQUIRED
      }, options ) );
    }
  }

  return gravityAndOrbits.register( 'CheckboxPanel', CheckboxPanel );
} );