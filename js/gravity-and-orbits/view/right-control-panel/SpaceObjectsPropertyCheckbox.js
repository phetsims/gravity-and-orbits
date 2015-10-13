// Copyright 2002-2015, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis
 */

define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var CheckBox = require( 'SUN/CheckBox' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsColorProfile' );

  // images
  var iconPathImg = require( 'image!GRAVITY_AND_ORBITS/icon_path.png' );
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
  var GRID_LINE_OPTIONS = { stroke: 'gray', lineWidth: 1.5 };
  var ARROW_Y_COORDINATE = -10;
  var CHECKBOX_OPTIONS = {
    scale: 0.8,
    checkBoxColor: GravityAndOrbitsColorProfile.panelTextProperty,
    checkBoxColorBackground: GravityAndOrbitsColorProfile.panelBackgroundProperty
  };
  var TEXT_OPTIONS = { font: FONT, fill: GravityAndOrbitsColorProfile.panelTextProperty };
  var SPACING = 10;

  /**
   * @param {GravityAndOrbitsModule} module
   * @param {Object} [options]
   * @constructor
   */
  function SpaceObjectsPropertyCheckbox( module, options ) {

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
          new ArrowNode( 95, ARROW_Y_COORDINATE, 140, ARROW_Y_COORDINATE, { fill: '#ED1C24' } )
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

    // path checkbox
    children.push( new CheckBox( new HBox( {
        spacing: SPACING,
        children: [
          pathTextNode,
          new Image( iconPathImg, { scale: 0.9 } )
        ]
      } ),
      module.showPathProperty, CHECKBOX_OPTIONS ) );

    // grid checkbox
    children.push( new CheckBox( new HBox( {
        spacing: SPACING,
        children: [
          gridTextNode,
          new Node( {
            children: [
              new Path( Shape.lineSegment( 0, 0, 20, 0 ), GRID_LINE_OPTIONS ),
              new Path( Shape.lineSegment( 20, 0, 20, 20 ), GRID_LINE_OPTIONS ),
              new Path( Shape.lineSegment( 20, 20, 0, 20 ), GRID_LINE_OPTIONS ),
              new Path( Shape.lineSegment( 0, 20, 0, 0 ), GRID_LINE_OPTIONS ),
              new Path( Shape.lineSegment( 10, 0, 10, 20 ), GRID_LINE_OPTIONS ),
              new Path( Shape.lineSegment( 0, 10, 20, 10 ), GRID_LINE_OPTIONS )
            ]
          } )
        ]
      } ),
      module.showGridProperty, CHECKBOX_OPTIONS ) );

    // measuring tape checkbox
    if ( module.showMeasuringTape ) {
      var measuringTapeIcon = MeasuringTape.createMeasuringTapeIcon( { scale: 0.4 } );
      children.push( new CheckBox( new HBox( {
        spacing: SPACING,
        children: [
          measuringTapeTextNode,
          measuringTapeIcon
        ]
      } ), module.measuringTapeVisibleProperty, CHECKBOX_OPTIONS ) );
    }

    VBox.call( this, _.extend( {
      children: children,
      resize: false,
      spacing: SPACING,
      align: 'left',
      bottom: -12
    }, options ) );
  }

  return inherit( VBox, SpaceObjectsPropertyCheckbox );
} );