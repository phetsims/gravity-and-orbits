// Copyright 2002-2015, University of Colorado Boulder

/**
 * Shows an explosion for a smaller Body when it crashes into a larger Body.
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var BodyRenderer = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/BodyRenderer' );
  var Node = require( 'SCENERY/nodes/Node' );

  // constants
  var NUM_STEPS_FOR_ANIMATION = 10;

  /**
   *
   * @param {Body} body
   * @param {Property<ModelViewTransform>} modelViewTransformProperty
   * @constructor
   */
  function ExplosionNode( body, modelViewTransformProperty ) {
    Node.call( this );
    var thisNode = this;

    // Function that computes the diameter as a function of the animation step
    var getDiameter = function( numClockTicksSinceExplosion ) {
      if ( numClockTicksSinceExplosion < NUM_STEPS_FOR_ANIMATION / 2 ) {
        return new LinearFunction( 0, NUM_STEPS_FOR_ANIMATION / 2,
          1, thisNode.getMaxViewDiameter( body, modelViewTransformProperty ) )( numClockTicksSinceExplosion );
      }
      else if ( numClockTicksSinceExplosion < NUM_STEPS_FOR_ANIMATION ) {
        return new LinearFunction( NUM_STEPS_FOR_ANIMATION / 2, NUM_STEPS_FOR_ANIMATION,
          thisNode.getMaxViewDiameter( body, modelViewTransformProperty ), 1 )( numClockTicksSinceExplosion );
      }
      else {
        return 1.0;
      }
    };

    // Add the graphic that shows the explosion, uses the twinkle graphics from the cartoon sun
    this.addChild( this.getExplosionEdgeGraphic( body, getDiameter ) );

    // update the location of this node when the body changes, unless the body is collided
    body.positionProperty.link( function() {

      // this if statement wasn't in the Java version, but it looks weird to have the explosion drag with the mouse
      if ( !body.collidedProperty.get() ) {
        thisNode.translation = modelViewTransformProperty.get().modelToViewPosition( body.positionProperty.get() );
      }
    } );
  }

  return inherit( Node, ExplosionNode, {

    // @private
    getExplosionEdgeGraphic: function( body, getDiameter ) {
      var yellowAndWhite = {
        highlight: 'white',
        color: 'yellow'
      };
      var getDoubleRadius = function( radius ) {
        return radius * 2;
      };
      var explosionEdgeGraphic = new BodyRenderer.SunRenderer( yellowAndWhite, 1, 14, getDoubleRadius );

      var explodedProperty = new DerivedProperty( [ body.collidedProperty, body.clockTicksSinceExplosionProperty ],
        function( collided, clockTicks ) {
          return collided && clockTicks <= NUM_STEPS_FOR_ANIMATION;
        } );

      explodedProperty.linkAttribute( explosionEdgeGraphic, 'visible' );

      body.clockTicksSinceExplosionProperty.lazyLink( function( clockTicks ) {
        explosionEdgeGraphic.setDiameter( getDiameter( clockTicks ) );
      } );

      return explosionEdgeGraphic;
    },

    // @private
    getMaxViewDiameter: function( body, modelViewTransformProperty ) {
      return modelViewTransformProperty.get().modelToViewDeltaX( body.diameterProperty.get() ) * 2;
    }
  } );
} );
