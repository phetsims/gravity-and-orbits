// Copyright 2002-2015, University of Colorado
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
  var Property = require( 'AXON/Property' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Body = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/Body' );
  var BodyRenderer = require( 'GRAVITY_AND_ORBITS/view/BodyRenderer' );
  var Node = require( 'SCENERY/nodes/Node' );

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

    //Function that computes the diameter as a function of the animation step
    var getDiameter = function( numClockTicksSinceExplosion ) {
      if ( numClockTicksSinceExplosion < NUM_STEPS_FOR_ANIMATION / 2 ) {
        return new LinearFunction( 0, NUM_STEPS_FOR_ANIMATION / 2, 1, this.getMaxViewDiameter( body, modelViewTransformProperty ) ).evaluate( numClockTicksSinceExplosion );
      }
      else if ( numClockTicksSinceExplosion < NUM_STEPS_FOR_ANIMATION ) {
        return new LinearFunction( NUM_STEPS_FOR_ANIMATION / 2, NUM_STEPS_FOR_ANIMATION, this.getMaxViewDiameter( body, modelViewTransformProperty ), 1 ).evaluate( numClockTicksSinceExplosion );
      }
      else {
        return 1.0;
      }
    };

    //Add the graphic that shows the explosion, uses the twinkle graphics from the cartoon sun
    this.addChild( this.getExplosionEdgeGraphic( body, getDiameter ) );
    //update the location of this node when the body changes
    body.positionProperty.link( function() {
      thisNode.translation = modelViewTransformProperty.get().modelToViewPosition( body.getPosition() );
    } );
  }

  return inherit( Node, ExplosionNode, {

      //private
      getExplosionEdgeGraphic: function( body, getDiameter ) {
        var yellowAndWhite = {
          getHighlight: function() {
            return 'white';
          },
          getColor: function() {
            return 'yellow';
          }
        };
        var getDoubleRadius = function( radius ) {
          return radius * 2;
        };
        var explosionEdgeGraphic = new BodyRenderer.SunRenderer( yellowAndWhite, 1, 14, getDoubleRadius );

        var explodedProperty = new DerivedProperty( [body.getCollidedProperty(), body.clockTicksSinceExplosionProperty],
          function( collided, clockTicks ) {
            return collided && clockTicks <= NUM_STEPS_FOR_ANIMATION;
          } );

        explodedProperty.linkAttribute( explosionEdgeGraphic, 'visible' );

        body.clockTicksSinceExplosionProperty.lazyLink( function( clockTicks ) {
          explosionEdgeGraphic.setDiameter( clockTicks );
        } );

        return explosionEdgeGraphic;
      },

      //private
      getMaxViewDiameter: function( body, modelViewTransformProperty ) {
        return modelViewTransformProperty.get().modelToViewDeltaX( body.getDiameter() ) * 2;
      }
    },
    {
      NUM_STEPS_FOR_ANIMATION: NUM_STEPS_FOR_ANIMATION
    } );
} );
