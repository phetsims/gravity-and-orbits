/**
 * Copyright 2002-2013, University of Colorado
 * view for view mode panel
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ViewModeOption = require( 'view/ViewModePanel/ViewModeOption' );
  var cartoonIcon = require( 'image!GRAVITY_AND_ORBITS/cartoon_icon.png' );
  var toScaleIcon = require( 'image!GRAVITY_AND_ORBITS/to_scale_icon.png' );

  function ViewModePanel( model, x, y ) {
    var self = this;
    Node.call( this, {x: x, y: y} );

    // add cartoon option
    this.addChild( new ViewModeOption( model, {x: 0, y: 0}, {image: cartoonIcon, value: model.viewModes[0]} ) );

    // add scale option
    this.addChild( new ViewModeOption( model, {x: 75, y: 0}, {image: toScaleIcon, value: model.viewModes[1]} ) );
  }

  inherit( Node, ViewModePanel );

  return ViewModePanel;
} );