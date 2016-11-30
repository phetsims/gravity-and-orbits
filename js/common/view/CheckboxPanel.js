// Copyright 2015, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis
 */

define( function( require ) {
  'use strict';

  // modules
  var GridNode = require( 'GRAVITY_AND_ORBITS/common/view/GridNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var CheckBox = require( 'SUN/CheckBox' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  // images
  var pathIconImg = require( 'image!GRAVITY_AND_ORBITS/path_icon.png' );
  var pathIconProjectorImg = require( 'image!GRAVITY_AND_ORBITS/path_icon_projector.png' );
  var iconMassImg = require( 'image!GRAVITY_AND_ORBITS/icon_mass.png' );

  // strings
  var gravityForceString = require( 'string!GRAVITY_AND_ORBITS/gravityForce' );
  var velocityString = require( 'string!GRAVITY_AND_ORBITS/velocity' );
  var pathString = require( 'string!GRAVITY_AND_ORBITS/path' );
  var measuringTapeString = require( 'string!GRAVITY_AND_ORBITS/measuringTape' );
  var massString = require( 'string!GRAVITY_AND_ORBITS/mass' );
  var gridString = require( 'string!GRAVITY_AND_ORBITS/grid' );

  // constants
  var FONT = new PhetFont( 18 );
  var ARROW_Y_COORDINATE = -10;
  var CHECKBOX_OPTIONS = {
    scale: 0.8,
    checkBoxColor: GravityAndOrbitsColorProfile.panelTextProperty,
    checkBoxColorBackground: GravityAndOrbitsColorProfile.checkBoxFillProperty,
    maxWidth: 250
  };
  var TEXT_OPTIONS = { font: FONT, fill: GravityAndOrbitsColorProfile.panelTextProperty };
  var SPACING = 10;

  /**
   * @param {GravityAndOrbitsModule} module
   * @param {Object} [options]
   * @constructor
   */
  function CheckboxPanel( module, options ) {

    var children = [];

    var gravityForceTextNode = new Text( gravityForceString, TEXT_OPTIONS );
    var velocityTextNode = new Text( velocityString, TEXT_OPTIONS );
    var massTextNode = new Text( massString, TEXT_OPTIONS );
    var pathTextNode = new Text( pathString, TEXT_OPTIONS );
    var gridTextNode = new Text( gridString, TEXT_OPTIONS );
    var measuringTapeTextNode = new Text( measuringTapeString, TEXT_OPTIONS );

    // gravity force checkbox
    children.push( new CheckBox( new HBox( {
        spacing: SPACING,
        children: [
          gravityForceTextNode,
          new ArrowNode( 135, ARROW_Y_COORDINATE, 180, ARROW_Y_COORDINATE, { fill: '#4380C2' } )
        ]
      } ),
      module.showGravityForceProperty, CHECKBOX_OPTIONS ) );

    // velocity checkbox
    children.push( new CheckBox( new HBox( {
        spacing: SPACING,
        children: [
          velocityTextNode,
          new ArrowNode( 95, ARROW_Y_COORDINATE, 140, ARROW_Y_COORDINATE, { fill: PhetColorScheme.RED_COLORBLIND } )
        ]
      } ),
      module.showVelocityProperty, CHECKBOX_OPTIONS ) );

    // mass checkbox
    if ( module.showMassCheckBox ) {
      children.push( new CheckBox( new HBox( {
          spacing: SPACING,
          children: [
            massTextNode,
            new Image( iconMassImg, { scale: 0.8 } )
          ]
        } ),
        module.showMassProperty, CHECKBOX_OPTIONS ) );
    }

    var pathIconImageNode = new Image( pathIconImg, { scale: 0.25 } );
    GravityAndOrbitsColorProfile.profileNameProperty.lazyLink( function( profileName ) {
      assert && assert( profileName === 'default' || profileName === 'projector' );
      pathIconImageNode.setImage( profileName === 'projector' ? pathIconProjectorImg : pathIconImg );
    } );

    // path checkbox
    children.push( new CheckBox( new HBox( {
        spacing: SPACING,
        children: [
          pathTextNode,
          pathIconImageNode
        ]
      } ),
      module.showPathProperty, CHECKBOX_OPTIONS ) );

    // grid checkbox
    children.push( new CheckBox( new HBox( {
        spacing: SPACING,
        children: [
          gridTextNode,
          new GridNode( new Property( ModelViewTransform2.createIdentity() ), 10, new Vector2(), 1, {
            stroke: GravityAndOrbitsColorProfile.gridIconProperty,
            lineWidth: 1.5
          } )
        ]
      } ),
      module.showGridProperty, CHECKBOX_OPTIONS ) );

    // measuring tape checkbox
    if ( module.showMeasuringTape ) {
      var measuringTapeIcon = MeasuringTape.createIcon( { scale: 0.4 } );
      children.push( new CheckBox( new HBox( {
        spacing: SPACING,
        align: 'top',
        children: [
          measuringTapeTextNode,
          measuringTapeIcon
        ]
      } ), module.measuringTapeVisibleProperty, CHECKBOX_OPTIONS ) );
    }

    // increase the touch area of the checkboxes
    var touchAreaHeight = 32;
    for ( var i = 0; i < children.length; i++ ) {
      var checkboxNode = children[ i ];
      var bounds = checkboxNode.parentToLocalBounds( checkboxNode.bounds );
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
