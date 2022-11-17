// Copyright 2014-2022, University of Colorado Boulder

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
import Body from '../model/Body.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Image, Mipmap, Node, Path } from '../../../../scenery/js/imports.js';
import sun_png from '../../../mipmaps/sun_png.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';

export default abstract class BodyRenderer extends Node {
  private readonly body: Body;
  public readonly targetBodyRenderer?: BodyRenderer;
  private static readonly ImageRenderer: typeof ImageRenderer;
  private static readonly SwitchableBodyRenderer: typeof SwitchableBodyRenderer;

  public constructor( body: Body ) {

    super();

    this.body = body;
  }

  private getBody(): Body {
    return this.body;
  }

  public abstract setDiameter( viewDiameter: number ): void;
}

gravityAndOrbits.register( 'BodyRenderer', BodyRenderer );

export class SwitchableBodyRenderer extends BodyRenderer {
  public override readonly targetBodyRenderer: BodyRenderer;
  private readonly defaultBodyRenderer: BodyRenderer;
  private readonly massListener: () => void;

  /**
   * This SwitchableBodyRenderer displays one representation when the object is at a specific mass, and a different
   * renderer otherwise.  This is so that (e.g.) the planet can be drawn with an earth image when its mass is equal to
   * earth mass or otherwise drawn as a sphere with a gradient paint.
   */
  public constructor( body: Body, targetMass: number, targetBodyRenderer: BodyRenderer, defaultBodyRenderer: BodyRenderer ) {

    super( body );

    // (read-only)
    this.targetBodyRenderer = targetBodyRenderer;
    this.defaultBodyRenderer = defaultBodyRenderer;

    this.addChild( defaultBodyRenderer );
    this.addChild( targetBodyRenderer );

    this.massListener = () => {
      const showTarget = body.massProperty.get() === targetMass;
      targetBodyRenderer.visible = showTarget;
      defaultBodyRenderer.visible = !showTarget;
    };
    body.massProperty.link( this.massListener.bind( this ) );

  }

  /**
   * Set the diameter for the renderer in view coordinates for both the current and default renderers.
   */
  public setDiameter( viewDiameter: number ): void {
    this.targetBodyRenderer.setDiameter( viewDiameter );
    this.defaultBodyRenderer.setDiameter( viewDiameter );
  }
}

gravityAndOrbits.register( 'SwitchableBodyRenderer', SwitchableBodyRenderer );

export class ImageRenderer extends BodyRenderer {
  private readonly imageNode: Image;
  private viewDiameter: number;

  /**
   * Renders the body using the specified image and the specified diameter in view coordinates.
   */
  public constructor( body: Body, viewDiameter: number, imageName: Mipmap ) {

    super( body );

    this.imageNode = new Image( imageName );
    this.viewDiameter = viewDiameter;
    this.addChild( this.imageNode );

    this.updateViewDiameter();
  }

  /**
   * Set the diameter for the rednerer in view coordinates
   */
  public setDiameter( viewDiameter: number ): void {
    this.viewDiameter = viewDiameter;
    this.updateViewDiameter();
  }

  private updateViewDiameter(): void {
    this.imageNode.matrix = new Matrix3();
    const scale = this.viewDiameter / this.imageNode.width;
    this.imageNode.setScaleMagnitude( scale );

    // Make sure the image is centered on the body's center
    this.imageNode.translate( -this.imageNode.width / 2 / scale, -this.imageNode.height / 2 / scale );
  }
}

gravityAndOrbits.register( 'ImageRenderer', ImageRenderer );

export class SunRenderer extends ImageRenderer {
  private readonly twinkles: Path;
  private readonly numSegments: number;
  private readonly twinkleRadius: ( n: number ) => number;

  /**
   * Adds triangle edges to the sun to make it look more recognizable
   */
  public constructor( body: Body, viewDiameter: number, numSegments: number, twinkleRadius: ( n: number ) => number ) {
    super( body, viewDiameter, sun_png );
    this.twinkles = new Path( null, { fill: 'yellow' } );
    this.numSegments = numSegments;
    this.twinkleRadius = twinkleRadius;
    this.addChild( this.twinkles );
    this.twinkles.moveToBack();
    this.setDiameter( viewDiameter );
  }

  /**
   * Set the diamater for the sun, based on view coordinates.
   *
   * @param  {number} viewDiameter
   */
  public override setDiameter( viewDiameter: number ): void {
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