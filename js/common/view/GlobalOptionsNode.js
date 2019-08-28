// Copyright 2015-2019, University of Colorado Boulder

/**
 * Global options shown in the "Options" dialog from the PhET Menu
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  const inherit = require( 'PHET_CORE/inherit' );
  const OptionsDialog = require( 'JOIST/OptionsDialog' );
  const ProjectorModeCheckbox = require( 'JOIST/ProjectorModeCheckbox' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   */
  function GlobalOptionsNode() {

    // add support for setting projector mode
    const projectorModeCheckbox = new ProjectorModeCheckbox( GravityAndOrbitsColorProfile );

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
