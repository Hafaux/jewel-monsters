import { Container, Graphics, Sprite } from 'pixi.js';
import gsap from 'gsap';

export default class Fire extends Container {
  constructor() {
    super();

    this.fire = new Sprite.from('fire');
    this.glow = new Sprite.from('fire-glow');

    this.fire.anchor.set(0.5);
    this.glow.anchor.set(0.5, 0.3);

    this.addChild(this.fire);
    this.addChild(this.glow);
  }
}