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
  var Color = require( 'SCENERY/util/Color' );
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


//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.gravityandorbits.view;
//
//import java.awt.Color;
//import java.beans.PropertyChangeEvent;
//import java.beans.PropertyChangeListener;
//
//import edu.colorado.phet.common.phetcommon.model.property.And;
//import edu.colorado.phet.common.phetcommon.model.property.Not;
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.util.SimpleObserver;
//import edu.colorado.phet.common.phetcommon.view.util.PhetFont;
//import edu.umd.cs.piccolo.PNode;
//import edu.umd.cs.piccolo.nodes.PText;
//import edu.umd.cs.piccolo.util.PBounds;
//
///**
// * Abstract class provides functionality for displaying the mass readout (in text) of a Body node.
// *
// * @author Sam Reid
// */
//public abstract class MassReadoutNode extends PNode {
//    protected final BodyNode bodyNode;
//
//    public MassReadoutNode( final BodyNode bodyNode, final Property<Boolean> visible ) {
//        this.bodyNode = bodyNode;
//        addChild( new PText( createText() ) {{
//            setPickable( false );
//            setChildrenPickable( false );
//            setFont( new PhetFont( 18, true ) );
//            setTextPaint( Color.white );
//            bodyNode.getBody().getMassProperty().addObserver( new SimpleObserver() {
//                public void update() {
//                    setText( createText() );
//                }
//            } );
//        }} );
//        final PropertyChangeListener updateLocation = new PropertyChangeListener() {
//            public void propertyChange( PropertyChangeEvent evt ) {
//                PBounds bounds = bodyNode.getBodyRenderer().getGlobalFullBounds();
//                globalToLocal( bounds );
//                localToParent( bounds );
//                if ( bodyNode.getBody().isMassReadoutBelow() ) {
//                    setOffset( bounds.getCenterX() - getFullBounds().getWidth() / 2, bounds.getMaxY() );
//                }
//                else {
//                    setOffset( bounds.getCenterX() - getFullBounds().getWidth() / 2, bounds.getMinY() - getFullBounds().getHeight() );
//                }
//            }
//        };
//        bodyNode.addPropertyChangeListener( PNode.PROPERTY_FULL_BOUNDS, updateLocation );
//        //Updating on visibility changes ensures that the labels appear in the correct place initially
//        visible.addObserver( new SimpleObserver() {
//            public void update() {
//                updateLocation.propertyChange( null );
//            }
//        } );
//        new And( visible, new Not( bodyNode.getBody().getCollidedProperty() ) ) {{
//            addObserver( new SimpleObserver() {
//                public void update() {
//                    setVisible( get() );
//                }
//            } );
//        }};
//    }
//
//    protected abstract String createText();
//}