import { Container, Sprite } from 'pixi.js';
import gsap from 'gsap';

export default class Symbol extends Container {
  constructor(type, id) {
    super();

    this.isCleared = false;
    this.type = type;
    this.sprite = new Sprite.from(`symbol-${this.type}`);
    this.id = id;

    this.buttonMode = true;
    this.interactive = true;
    this.cursor = 'default';

    this.pivot.set(50, 50);

    this.addChild(this.sprite);
  }

  clear() {
    this.buttonMode = false;
    this.interactive = false;
    this.isCleared = true;

    gsap.to(this.scale, {
      x: 1.3,
      y: 1.3,
      duration: 0.2
    });

    return gsap.to(this, {
      alpha: 0,
      duration: 0.2,
    });
  }

  updateIndex(index) {
    this.id = index;
  }
}