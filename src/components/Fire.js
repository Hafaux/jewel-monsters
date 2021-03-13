import { Container, Sprite } from 'pixi.js';
import gsap from 'gsap';

export default class Fire extends Container {
  constructor() {
    super();

    this.fire = new Sprite.from('fire');
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
  }
}