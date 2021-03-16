import { Container, filters, Sprite, WRAP_MODES } from 'pixi.js';
import gsap from 'gsap';

/**
 * Class representing the fire.
 * @prop {PIXI.Sprite} fire the fire sprite
 * @prop {PIXI.Sprite} glow the fire glow sprite
 */
export default class Fire extends Container {
  constructor() {
    super();

    this.fire = new Sprite.from('fire');
    this.fire.name = 'fire';
    this.glow = new Sprite.from('fire-glow');

    this.fire.anchor.set(0.5);
    this.glow.anchor.set(0.5, 0.3);

    gsap.to(this.glow.scale, {
      x: 1.2,
      y: 1.2,
      yoyo: true,
      ease: 'power1.inOut',
      duration: 2,
      repeat: -1,
    });

    this.addChild(this.fire);
    this.addChild(this.glow);
    this._addDisplacementFilter();
  }

  /**
   * Adds a displacement filter to the fire.
   * @private
   */
  _addDisplacementFilter() {
    const displacementSprite = new Sprite.from('displacement-map');
    displacementSprite.anchor.set(0.5, 0);
    displacementSprite.texture.baseTexture.wrapMode = WRAP_MODES.REPEAT;
    displacementSprite.scale.set(10);

    const displacementFilter = new filters.DisplacementFilter(displacementSprite);
    displacementFilter.padding = 10;
    displacementFilter.scale.set(50, 20);
    displacementFilter.position = this.fire.position;
    this.addChild(displacementSprite);

    this.fire.filters = [displacementFilter];

    gsap.to(displacementSprite, {
      y: -displacementSprite.width,
      repeat: -1,
      ease: 'linear',
      duration: 10,
    });
  }
}