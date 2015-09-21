// Copyright 2002-2014, University of Colorado

/**
 * This is the Node that renders the content of a physical body, such as a planet or space station.  This component is separate from
 * BodyNode since it is used to create icons.  It is also used to be able to switch between rendering types (i.e. image vs cartoon sphere) without
 * changing any other characteristics of the Node.
 *
 * The classes SwitchableBodyRenderer, SphereRenderer, ImageRenderer, and SunRenderer were static classes in the Java code
 *
 * @author Sam Reid
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Vector2 = require( 'DOT/Vector2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Matrix3 = require( 'DOT/Matrix3' );

  // images
  var sunMipmap = require( 'mipmap!GRAVITY_AND_ORBITS/sun.png' );

  function BodyRenderer( body ) {

    Node.call( this );

    // @private
    this.body = body;
  }

  // this needs to be called before the static classes are defined, otherwise the inheritance does work right
  // this jshint warning notifies if a variable is used before it is defined
  /* jshint -W003 */
  var renderer = inherit( Node, BodyRenderer, {
      getBody: function() {
        return this.body;
      },
      setDiameter: function( viewDiameter ) {}
    },
    {
      SwitchableBodyRenderer: SwitchableBodyRenderer,
      //SphereRenderer: SphereRenderer,
      ImageRenderer: ImageRenderer,
      SunRenderer: SunRenderer
    } );
  /* jshint -W003 */

  /**
   * This SwitchableBodyRenderer displays one representation when the object is at a specific mass, and a different renderer
   * otherwise.  This is so that (e.g.) the planet can be drawn with an earth image when its mass is equal to earth mass
   * or otherwise drawn as a sphere with a gradient paint.
   *
   * @param body
   * @param targetMass
   * @param targetBodyRenderer
   * @param defaultBodyRenderer
   * @constructor
   */
  function SwitchableBodyRenderer( body, targetMass, targetBodyRenderer, defaultBodyRenderer ) {

    BodyRenderer.call( this, body );
    var thisRenderer = this;

    this.targetBodyRenderer = targetBodyRenderer;

    //private
    this.defaultBodyRenderer = defaultBodyRenderer;

    body.getMassProperty().link( function() {
      thisRenderer.removeAllChildren();
      thisRenderer.addChild( ( body.getMass() === targetMass ) ? targetBodyRenderer : defaultBodyRenderer );
    } );
  }

  inherit( BodyRenderer, SwitchableBodyRenderer, {
    setDiameter: function( viewDiameter ) {
      this.targetBodyRenderer.setDiameter( viewDiameter );
      this.defaultBodyRenderer.setDiameter( viewDiameter );
    }
  } );

  /**
   * Render a SphericalNode for the body.
   * @param body
   * @param viewDiameter
   * @constructor
   */
  function SphereRenderer( body, viewDiameter ) {
    BodyRenderer.call( this, body );
    this.sphereNode = new Circle( viewDiameter / 2 );
    this.setDiameter( viewDiameter );
    this.addChild( this.sphereNode );
  }

  inherit( BodyRenderer, SphereRenderer, {
    setDiameter: function( viewDiameter ) {
      this.sphereNode.radius = viewDiameter / 2;
      this.sphereNode.fill = this.createPaint( viewDiameter );
      return this;
    },

    // @private
    createPaint: function( diameter ) {
      var highlight = ( this.body ) ? this.body.getHighlight() : 'white';
      var color = ( this.body ) ? this.body.getColor() : 'yellow';
      return BodyRenderer.SphereRenderer.getSphericalGradient( diameter, highlight, color );
    }
  }, {
    getSphericalGradient: function( diameter, highlight, color ) {
      return new RadialGradient( diameter / 8, -diameter / 8, 0, diameter / 4, diameter / 4, diameter )
        .addColorStop( 0, highlight )
        .addColorStop( 0.5, color );
    }
  } );

  /**
   * Renders the body using the specified image and the specified diameter in view coordinates.
   */
  function ImageRenderer( body, viewDiameter, imageName ) {

    BodyRenderer.call( this, body );

    this.imageNode = new Image( imageName );
    this.viewDiameter = viewDiameter;
    this.addChild( this.imageNode );

    this.updateViewDiameter();
  }

  inherit( BodyRenderer, ImageRenderer, {
    setDiameter: function( viewDiameter ) {
      this.viewDiameter = viewDiameter;
      this.updateViewDiameter();
    },

    // @private
    updateViewDiameter: function() {
      this.imageNode.matrix = new Matrix3();
      var scale = this.viewDiameter / this.imageNode.width;
      this.imageNode.setScaleMagnitude( scale );

      // Make sure the image is centered on the body's center
      this.imageNode.translate( -this.imageNode.width / 2 / scale, -this.imageNode.height / 2 / scale );
    }
  } );

  /**
   * Adds triangle edges to the sun to make it look more recognizable
   *
   * @param {Body} body
   * @param {number} viewDiameter
   * @param {number} numSegments
   * @param {function} twinkleRadius
   * @constructor
   */
  function SunRenderer( body, viewDiameter, numSegments, twinkleRadius ) {

    // @private
    this.twinkles = new Path( null, { fill: 'yellow' } );

    ImageRenderer.call( this, body, viewDiameter, sunMipmap );
    this.numSegments = numSegments;
    this.twinkleRadius = twinkleRadius;
    this.addChild( this.twinkles );
    this.twinkles.moveToBack();
    this.setDiameter( viewDiameter );
  }

  inherit( ImageRenderer, SunRenderer, {
    setDiameter: function( viewDiameter ) {
      ImageRenderer.prototype.setDiameter.call( this, viewDiameter );
      var angle = 0;
      var deltaAngle = Math.PI * 2 / this.numSegments;
      var radius = viewDiameter / 2;
      var shape = new Shape();
      shape.moveTo( 0, 0 );
      for ( var i = 0; i < this.numSegments + 1; i++ ) {
        var myRadius = ( i % 2 === 0 ) ? this.twinkleRadius( radius ) : radius;
        var target = Vector2.createPolar( myRadius, angle );
        shape.lineToPoint( target );
        angle += deltaAngle;
      }
      this.twinkles.setShape( shape );
    }
  } );

  return renderer;
} );

