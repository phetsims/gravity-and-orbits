// Copyright 2002-2015, University of Colorado
/**
 * Draws a vector for a Body, such as a force vector or velocity vector.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var MutableArrowNode = require( 'SCENERY_PHET/MutableArrowNode' );
  var Body = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/Body' );
  var Node = require( 'SCENERY/nodes/Node' );

  var FORCE_SCALE = 76.0 / 5.179E15;

  /**
   * Constructor for VectorNode
   * @param {Body} body
   * @param {Property.<ModelViewTransform>} transformProperty
   * @param {Property.<boolean>} visibleProperty
   * @param {Property.<Vector2>} vectorProperty
   * @param {number} scale
   * @param {Color} fill
   * @param {Color} outline
   * @constructor
   */
  function VectorNode( body, transformProperty, visibleProperty, vectorProperty, scale, fill, outline ) {
    Node.call( this );
    var thisNode = this;

    this.body = body; // private
    this.vectorProperty = vectorProperty; // private
    this.body = body; // private
    this.transformProperty = transformProperty; // private
    this.scale = scale; // private

    //Only show if the body hasn't collided
    new DerivedProperty( [ visibleProperty, body.getCollidedProperty() ], function( visible, collided ) {
      return visible && !collided;
    } ).linkAttribute( this, 'visible' );

    var arrowNode = new MutableArrowNode( 0, 0, 0, 0, {
      headHeight: 15,
      headWidth: 15,
      tailWidth: 5,
      fill: fill,
      stroke: outline,
      pickable: false
    } );

    Property.multilink( [ vectorProperty, body.getPositionProperty(), transformProperty ],
      function() {
        var tail = thisNode.getTail();
        var tip = thisNode.getTip( tail );
        arrowNode.setTailAndTip( tail.x, tail.y, tip.x, tip.y );
      } );

    this.addChild( arrowNode );
  }

  return inherit( Node, VectorNode, {

      //private
      getTail: function() {
        return this.transformProperty.get().modelToViewPosition( this.body.getPositionProperty().get() );
      },

      getTip: function( tail ) {
        if ( typeof tail === 'undefined' ) {
          tail = this.getTail();
        }

        var minArrowLength = 10;
        var force = this.transformProperty.get().modelToViewDelta( this.vectorProperty.get().times( this.scale ) );

        if ( force.magnitude() < minArrowLength && force.magnitude() > 1E-12 ) {
          //force = force.getInstanceOfMagnitude( minArrowLength );
          force = force.times( minArrowLength );
        }
        return new Vector2( force.x + tail.x, force.y + tail.y );
      }
    },
    {
      FORCE_SCALE: FORCE_SCALE
    } );
} );
