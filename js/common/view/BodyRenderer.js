// Copyright 2014-2020, University of Colorado Boulder

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

import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import sunImage from '../../../images/sun_png.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';

class BodyRenderer extends Node {
  // @abstract
  constructor( body ) {

    super();

    // @private
    this.body = body;
  }

  // @public
  getBody() {
    return this.body;
  }

  /**
   * @public
   * @abstract
   */
  setDiameter( viewDiameter ) {
    throw new Error( 'must be implemented by subtype' );
  }
}

gravityAndOrbits.register( 'BodyRenderer', BodyRenderer );

class SwitchableBodyRenderer extends BodyRenderer {
  /**
   * This SwitchableBodyRenderer displays one representation when the object is at a specific mass, and a different
   * renderer otherwise.  This is so that (e.g.) the planet can be drawn with an earth image when its mass is equal to
   * earth mass or otherwise drawn as a sphere with a gradient paint.
   *
   * @param body
   * @param targetMass
   * @param targetBodyRenderer
   * @param defaultBodyRenderer
   */
  constructor( body, targetMass, targetBodyRenderer, defaultBodyRenderer ) {

    super( body );

    // @public (read-only)
    this.targetBodyRenderer = targetBodyRenderer;
    this.defaultBodyRenderer = defaultBodyRenderer;

    // @private - so new closure need not be defined
    this.massListener = () => {

      // this defined by bound
      this.removeAllChildren();
      this.addChild( ( body.massProperty.get() === targetMass ) ? targetBodyRenderer : defaultBodyRenderer );
    };
    body.massProperty.link( this.massListener.bind( this ) );

  }

  /**
   * Set the diameter for the renderer in view coordinates for both the current and default renderers.
   *
   * @param {number} viewDiameter
   * @public
   */
  setDiameter( viewDiameter ) {
    this.targetBodyRenderer.setDiameter( viewDiameter );
    this.defaultBodyRenderer.setDiameter( viewDiameter );
  }
}

gravityAndOrbits.register( 'SwitchableBodyRenderer', SwitchableBodyRenderer );

class ImageRenderer extends BodyRenderer {
  /**
   * Renders the body using the specified image and the specified diameter in view coordinates.
   *
   * @param {Body} body
   * @param {number} viewDiameter
   * @param {string} imageName - image from the plugin
   */
  constructor( body, viewDiameter, imageName ) {

    super( body );

    this.imageNode = new Image( imageName ); // @private
    this.viewDiameter = viewDiameter; // @private
    this.addChild( this.imageNode );

    this.updateViewDiameter();
  }

  /**
   * Set the diameter for the rednerer in view coordinates
   *
   * @param  {number} viewDiameter
   */
  setDiameter( viewDiameter ) {
    this.viewDiameter = viewDiameter;
    this.updateViewDiameter();
  }

  // @private
  updateViewDiameter() {
    this.imageNode.matrix = new Matrix3();
    const scale = this.viewDiameter / this.imageNode.width;
    this.imageNode.setScaleMagnitude( scale );

    // Make sure the image is centered on the body's center
    this.imageNode.translate( -this.imageNode.width / 2 / scale, -this.imageNode.height / 2 / scale );
  }
}

gravityAndOrbits.register( 'ImageRenderer', ImageRenderer );

class SunRenderer extends ImageRenderer {
  /**
   * Adds triangle edges to the sun to make it look more recognizable
   *
   * @param {Body} body
   * @param {number} viewDiameter
   * @param {number} numSegments
   * @param {function} twinkleRadius
   */
  constructor( body, viewDiameter, numSegments, twinkleRadius ) {
    super( body, viewDiameter, sunImage );
    this.twinkles = new Path( null, { fill: 'yellow' } ); // @private
    this.numSegments = numSegments; // @private
    this.twinkleRadius = twinkleRadius; // @private
    this.addChild( this.twinkles );
    this.twinkles.moveToBack();
    this.setDiameter( viewDiameter );
  }

  /**
   * Set the diamater for the sun, based on view coordinates.
   *
   * @param  {number} viewDiameter
   */
  setDiameter( viewDiameter ) {
    super.setDiameter( viewDiameter );
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
}

gravityAndOrbits.register( 'SunRenderer', SunRenderer );

BodyRenderer.SwitchableBodyRenderer = SwitchableBodyRenderer;
BodyRenderer.ImageRenderer = ImageRenderer;
BodyRenderer.SunRenderer = SunRenderer;

export default BodyRenderer;