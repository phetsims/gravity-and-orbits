// Copyright 2002-2015, University of Colorado Boulder

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
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var CheckBox = require( 'SUN/CheckBox' );
  var OptionsDialog = require( 'JOIST/OptionsDialog' );

  // strings
  var whiteBackgroundString = require( 'string!GRAVITY_AND_ORBITS/options.whiteBackground' );

  function GlobalOptionsNode( whiteBackgroundProperty ) {
    var children = [];

    children.push( new CheckBox( new Text( whiteBackgroundString, { font: OptionsDialog.DEFAULT_FONT } ),
      whiteBackgroundProperty, {} ) );

    VBox.call( this, _.extend( {
      children: children,
      spacing: OptionsDialog.DEFAULT_SPACING,
      align: 'left'
    } ) );
  }

  return inherit( VBox, GlobalOptionsNode );
} );