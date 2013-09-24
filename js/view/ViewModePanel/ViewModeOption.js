/**
 * Copyright 2002-2013, University of Colorado
 * view for view mode option
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RadioButton = require( 'SUN/RadioButton' );
  var Image = require( 'SCENERY/nodes/Image' );

  function ViewModePanel( model, coords, options ) {
    var self = this, imageScale = 0.1;
    Node.call( this, coords );

    var img = new Image( options.image, {scale: imageScale} );
    var stroke = new Rectangle( 0, 0, img.getImageWidth() * imageScale, img.getImageHeight() * imageScale, {fill: 'rgba(0,0,0,0)', stroke: '#fff', lineWidth: 2} );

    // button options
    var opt = {
      selectedNode: new Node( {children: [img, stroke]} ),
      deselectedNode: new Node( {children: [img]} )
    };

    // create button
    this.button = new RadioButton( model.viewModeProperty, options.value, opt.selectedNode, opt.deselectedNode );
    this.addChild( this.button );
  }

  inherit( Node, ViewModePanel );

  return ViewModePanel;
} );