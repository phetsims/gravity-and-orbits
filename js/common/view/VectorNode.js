// Copyright 2014-2019, University of Colorado Boulder

/**
 * Draws a vector for a Body, such as a force vector or velocity vector.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
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
    var self = this;

    this.body = body; // @private
    this.vectorProperty = vectorProperty; // @private
    this.body = body; // @private
    this.transformProperty = transformProperty; // @private
    this.scale = scale; // @private

    // Only show if the body hasn't collided
    new DerivedProperty( [ visibleProperty, body.collidedProperty ], function( visible, collided ) {
      return visible && !collided;
    } ).linkAttribute( this, 'visible' );

    var arrowNode = new ArrowNode( 0, 0, 0, 0, {
      headHeight: 15,
      headWidth: 15,
      tailWidth: 5,
      fill: fill,
      stroke: outline,
      pickable: false,
      boundsMethod: 'none',
      isHeadDynamic: true,
      scaleTailToo: true
    } );

    this.propertyListener = function( visible ) {
      if ( visible ) {
        var tail = self.getTail();
        var tip = self.getTip( tail );
        arrowNode.setTailAndTip( tail.x, tail.y, tip.x, tip.y );
      }
    };
    Property.multilink( [ visibleProperty, vectorProperty, body.positionProperty, transformProperty ], self.propertyListener );

    this.addChild( arrowNode );
  }

  gravityAndOrbits.register( 'VectorNode', VectorNode );

  return inherit( Node, VectorNode, {

    // @private
    getTail: function() {
      return this.transformProperty.get().modelToViewPosition( this.body.positionProperty.get() );
    },

    // @protected
    getTip: function( tail ) {
      if ( typeof tail === 'undefined' ) {
        tail = this.getTail();
      }

      var minArrowLength = 10;
      var force = this.transformProperty.get().modelToViewDelta( this.vectorProperty.get().times( this.scale ) );

      if ( force.magnitude < minArrowLength && force.magnitude > 1E-12 ) {
        force = force.times( minArrowLength / force.magnitude );
      }
      return new Vector2( force.x + tail.x, force.y + tail.y );
    }
  }, {
    FORCE_SCALE: FORCE_SCALE
  } );
} );
