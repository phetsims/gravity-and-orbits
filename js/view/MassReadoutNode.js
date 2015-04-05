// Copyright 2002-2015, University of Colorado

/**
 * Abstract class provides functionality for displaying the mass readout (in text) of a Body node.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );

  function MassReadoutNode( bodyNode, visible ) {
    Node.call( this );
    var thisNode = this;
    this.bodyNode = bodyNode;

    var readoutText = new Text( this.createText(), {
      pickable: false,
      font: new PhetFont( 18 ),
      color: 'white' } );
    this.addChild( readoutText );
    bodyNode.getBody().getMassProperty().link( function() {
      readoutText.setText( thisNode.createText() );
    } );
//
//    var updateLocation = new PropertyChangeListener().withAnonymousClassBody( {
//      propertyChange: function( evt ) {
//        var bounds = bodyNode.getBodyRenderer().getGlobalFullBounds();
//        globalToLocal( bounds );
//        localToParent( bounds );
//        if ( bodyNode.getBody().isMassReadoutBelow() ) {
//          setOffset( bounds.getCenterX() - getFullBounds().getWidth() / 2, bounds.getMaxY() );
//        }
//        else {
//          setOffset( bounds.getCenterX() - getFullBounds().getWidth() / 2, bounds.getMinY() - getFullBounds().getHeight() );
//        }
//      }
//    } );
//    bodyNode.addPropertyChangeListener( Node.PROPERTY_FULL_BOUNDS, updateLocation );
//    //Updating on visibility changes ensures that the labels appear in the correct place initially
//    visible.addObserver( new SimpleObserver().withAnonymousClassBody( {
//      update: function() {
//        updateLocation.propertyChange( null );
//      }
//    } ) );
//    new And( visible, new Not( bodyNode.getBody().getCollidedProperty() ) ).withAnonymousClassBody( {
//      initializer: function() {
//        addObserver( new SimpleObserver().withAnonymousClassBody( {
//          update: function() {
//            setVisible( get() );
//          }
//        } ) );
//      }
//    } );
  }

  return inherit( Node, MassReadoutNode, {
    createText: function() {}
  } );
} );
