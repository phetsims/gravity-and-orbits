// Copyright 2014-2018, University of Colorado Boulder

/**
 * This is the Node that renders the content of a physical body, such as a planet or space station.  This component
 * is separate from BodyNode since it is used to create icons.  It is also used to be able to switch between rendering
 * types (i.e. image vs cartoon sphere) without changing any other characteristics of the Node.
 *
 * The classes SwitchableBodyRenderer, SphereRenderer, ImageRenderer, and SunRenderer were static classes in the Java
 * version.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const Vector2 = require( 'DOT/Vector2' );

  // images
  const sunImage = require( 'image!GRAVITY_AND_ORBITS/sun.png' );

  // @abstract
  function BodyRenderer( body ) {

    Node.call( this );

    // @private
    this.body = body;
  }

  gravityAndOrbits.register( 'BodyRenderer', BodyRenderer );

  // this needs to be called before the static classes are defined, otherwise the inheritance doesn't work right
  const renderer = inherit( Node, BodyRenderer, {

    // @public
    getBody: function() {
      return this.body;
    },

    /**
     * @public
     * @abstract
     */
    setDiameter: function( viewDiameter ) {
      throw new Error( 'must be implemented by subtype' );
    }
  }, {
    SwitchableBodyRenderer: SwitchableBodyRenderer,
    ImageRenderer: ImageRenderer,
    SunRenderer: SunRenderer
  } );

  /**
   * This SwitchableBodyRenderer displays one representation when the object is at a specific mass, and a different
   * renderer otherwise.  This is so that (e.g.) the planet can be drawn with an earth image when its mass is equal to
   * earth mass or otherwise drawn as a sphere with a gradient paint.
   *
   * @param body
   * @param targetMass
   * @param targetBodyRenderer
   * @param defaultBodyRenderer
   * @constructor
   */
  function SwitchableBodyRenderer( body, targetMass, targetBodyRenderer, defaultBodyRenderer ) {

    BodyRenderer.call( this, body );

    // @public (read-only)
    this.targetBodyRenderer = targetBodyRenderer;
    this.defaultBodyRenderer = defaultBodyRenderer;

    // @private - so new closure need not be defined
    this.massListener = function() {
      // this defined by bound
      this.removeAllChildren();
      this.addChild( ( body.massProperty.get() === targetMass ) ? targetBodyRenderer : defaultBodyRenderer );
    };
    body.massProperty.link( this.massListener.bind( this ) );

  }

  gravityAndOrbits.register( 'SwitchableBodyRenderer', SwitchableBodyRenderer );

  inherit( BodyRenderer, SwitchableBodyRenderer, {

    /**
     * Set the diameter for the renderer in view coordinates for both the current and default renderers.
     *
     * @param  {number} viewDiameter
     */
    setDiameter: function( viewDiameter ) {
      this.targetBodyRenderer.setDiameter( viewDiameter );
      this.defaultBodyRenderer.setDiameter( viewDiameter );
    }
  } );

  /**
   * Renders the body using the specified image and the specified diameter in view coordinates.
   *
   * @param {Body} body
   * @param {number} viewDiameter
   * @param {string} imageName - image from the plugin
   * @constructor
   */
  function ImageRenderer( body, viewDiameter, imageName ) {

    BodyRenderer.call( this, body );

    this.imageNode = new Image( imageName ); // @private
    this.viewDiameter = viewDiameter; // @private
    this.addChild( this.imageNode );

    this.updateViewDiameter();
  }

  gravityAndOrbits.register( 'ImageRenderer', ImageRenderer );

  inherit( BodyRenderer, ImageRenderer, {

    /**
     * Set the diameter for the rednerer in view coordinates
     *
     * @param  {number} viewDiameter
     */
    setDiameter: function( viewDiameter ) {
      this.viewDiameter = viewDiameter;
      this.updateViewDiameter();
    },

    // @private
    updateViewDiameter: function() {
      this.imageNode.matrix = new Matrix3();
      const scale = this.viewDiameter / this.imageNode.width;
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

    this.twinkles = new Path( null, { fill: 'yellow' } ); // @private
    this.numSegments = numSegments; // @private
    this.twinkleRadius = twinkleRadius; // @private

    ImageRenderer.call( this, body, viewDiameter, sunImage );
    this.addChild( this.twinkles );
    this.twinkles.moveToBack();
    this.setDiameter( viewDiameter );
  }

  gravityAndOrbits.register( 'SunRenderer', SunRenderer );

  inherit( ImageRenderer, SunRenderer, {

    /**
     * Set the diamater for the sun, based on view coordinates.
     *
     * @param  {number} viewDiameter
     */
    setDiameter: function( viewDiameter ) {
      ImageRenderer.prototype.setDiameter.call( this, viewDiameter );
      let angle = 0;
      const deltaAngle = Math.PI * 2 / this.numSegments;
      const radius = viewDiameter / 2;
      const shape = new Shape();
      shape.moveTo( 0, 0 );
      for ( let i = 0; i < this.numSegments + 1; i++ ) {
        const myRadius = ( i % 2 === 0 ) ? this.twinkleRadius( radius ) : radius;
        const target = Vector2.createPolar( myRadius, angle );
        shape.lineToPoint( target );
        angle += deltaAngle;
      }
      this.twinkles.setShape( shape );
    }
  } );
  return renderer;
} );