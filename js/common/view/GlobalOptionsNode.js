// Copyright 2015-2018, University of Colorado Boulder

/**
 * Global options shown in the "Options" dialog from the PhET Menu
 *
 * @author Aaron Davis
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  var inherit = require( 'PHET_CORE/inherit' );
  var OptionsDialog = require( 'JOIST/OptionsDialog' );
  var ProjectorModeCheckbox = require( 'JOIST/ProjectorModeCheckbox' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   */
  function GlobalOptionsNode() {

    // add support for setting projector mode
    var projectorModeCheckbox = new ProjectorModeCheckbox();
    projectorModeCheckbox.projectorModeEnabledProperty.link( function( projectorMode ) {
      if ( projectorMode ) {
        GravityAndOrbitsColorProfile.profileNameProperty.set( 'projector' );
      }
      else {
        GravityAndOrbitsColorProfile.profileNameProperty.set( 'default' );
      }
    } );

    // VBox is used to make it easy to add additional options
    VBox.call( this, _.extend( {
      children: [ projectorModeCheckbox ],
      spacing: OptionsDialog.DEFAULT_SPACING,
      align: 'left'
    } ) );
  }

  gravityAndOrbits.register( 'GlobalOptionsNode', GlobalOptionsNode );

  return inherit( VBox, GlobalOptionsNode );
} );
