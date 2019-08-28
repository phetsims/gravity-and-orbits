// Copyright 2015-2019, University of Colorado Boulder

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
  const inherit = require( 'PHET_CORE/inherit' );
  const MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Shape = require( 'KITE/Shape' );
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

  /**
   * @param {GravityAndOrbitsModule} module
   * @param {Object} [options]
   * @constructor
   */
  function CheckboxPanel( module, options ) {

    const children = [];

    const gravityForceTextNode = new Text( gravityForceString, TEXT_OPTIONS );
    const velocityTextNode = new Text( velocityString, TEXT_OPTIONS );
    const massTextNode = new Text( massString, TEXT_OPTIONS );
    const pathTextNode = new Text( pathString, TEXT_OPTIONS );
    const gridTextNode = new Text( gridString, TEXT_OPTIONS );
    const measuringTapeTextNode = new Text( measuringTapeString, TEXT_OPTIONS );

    // gravity force checkbox
    children.push( new Checkbox( new HBox( {
        spacing: SPACING,
        children: [
          gravityForceTextNode,
          new ArrowNode( 135, ARROW_Y_COORDINATE, 180, ARROW_Y_COORDINATE, { fill: '#4380C2' } )
        ]
      } ),
      module.showGravityForceProperty, CHECKBOX_OPTIONS ) );

    // velocity checkbox
    children.push( new Checkbox( new HBox( {
        spacing: SPACING,
        children: [
          velocityTextNode,
          new ArrowNode( 95, ARROW_Y_COORDINATE, 140, ARROW_Y_COORDINATE, { fill: PhetColorScheme.RED_COLORBLIND } )
        ]
      } ),
      module.showVelocityProperty, CHECKBOX_OPTIONS ) );

    // mass checkbox
    if ( module.showMassCheckbox ) {
      children.push( new Checkbox( new HBox( {
          spacing: SPACING,
          children: [
            massTextNode,
            new Image( iconMassImg, { scale: 0.8 } )
          ]
        } ),
        module.showMassProperty, CHECKBOX_OPTIONS ) );
    }

    const pathIconImageNode = new Image( pathIconImg, { scale: 0.25 } );
    GravityAndOrbitsColorProfile.profileNameProperty.lazyLink( function( profileName ) {
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
      module.showPathProperty, CHECKBOX_OPTIONS ) );

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
      module.showGridProperty, CHECKBOX_OPTIONS ) );

    // measuring tape checkbox
    if ( module.showMeasuringTape ) {
      const measuringTapeIcon = MeasuringTapeNode.createIcon( { scale: 0.4 } );
      children.push( new Checkbox( new HBox( {
        spacing: SPACING,
        align: 'top',
        children: [
          measuringTapeTextNode,
          measuringTapeIcon
        ]
      } ), module.measuringTapeVisibleProperty, CHECKBOX_OPTIONS ) );
    }

    // increase the touch area of the checkboxes
    const touchAreaHeight = 32;
    for ( let i = 0; i < children.length; i++ ) {
      const checkboxNode = children[ i ];
      const bounds = checkboxNode.parentToLocalBounds( checkboxNode.bounds );
      checkboxNode.touchArea = Shape.rectangle( -5, bounds.centerY - touchAreaHeight / 2, bounds.width + 10, touchAreaHeight );
    }

    VBox.call( this, _.extend( {
      children: children,
      resize: false,
      spacing: SPACING,
      align: 'left',
      bottom: -12
    }, options ) );
  }

  gravityAndOrbits.register( 'CheckboxPanel', CheckboxPanel );

  return inherit( VBox, CheckboxPanel );
} );