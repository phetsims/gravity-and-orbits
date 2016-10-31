// Copyright 2015, University of Colorado Boulder

/**
 * Global options shown in the "Options" dialog from the PhET Menu
 *
 * @author Aaron Davis
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var CheckBox = require( 'SUN/CheckBox' );
  var OptionsDialog = require( 'JOIST/OptionsDialog' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  var GravityAndOrbitsQueryParameters = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsQueryParameters' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  // strings
  var projectorModeString = require( 'string!GRAVITY_AND_ORBITS/projectorMode' );

  function GlobalOptionsNode() {
    var children = [];

    var projectorModeProperty = new Property( GravityAndOrbitsQueryParameters.projectorMode );
    projectorModeProperty.link( function( projectorMode ) {
      if ( projectorMode ) {
        GravityAndOrbitsColorProfile.profileNameProperty.set( 'projector' );
      }
      else {
        GravityAndOrbitsColorProfile.profileNameProperty.set( 'default' );
      }
    } );

    children.push( new CheckBox( new Text( projectorModeString, { font: OptionsDialog.DEFAULT_FONT } ),
      projectorModeProperty, {} ) );

    VBox.call( this, _.extend( {
      children: children,
      spacing: OptionsDialog.DEFAULT_SPACING,
      align: 'left'
    } ) );
  }

  gravityAndOrbits.register( 'GlobalOptionsNode', GlobalOptionsNode );

  return inherit( VBox, GlobalOptionsNode );
} );
