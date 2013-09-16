/**
 * Copyright 2002-2013, University of Colorado
 * control speed radio buttons view
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  var Strings = require( 'Strings' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FONT = new PhetFont( 16 );

  function SpeedCheckbox( model, coords ) {
    Node.call( this, coords );

    this.addChild( new VerticalAquaRadioButtonGroup( [
      {property: model.speedProperty, value: 1.75, node: new Text( Strings['GAO.fastForward'], { font: FONT, fill: '#fff', pickable: false, y: -7 } )},
      {property: model.speedProperty, value: 1, node: new Text( Strings['GAO.normal'], { font: FONT, fill: '#fff', pickable: false, y: -7 } )},
      {property: model.speedProperty, value: 0.25, node: new Text( Strings['GAO.slowMotion'], { font: FONT, fill: '#fff', pickable: false, y: -7 } )}
    ], {scale: 0.9} ) );
  }

  inherit( Node, SpeedCheckbox );

  return SpeedCheckbox;
} );