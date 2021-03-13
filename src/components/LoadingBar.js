import { Container, Sprite } from 'pixi.js';
import { mapRange } from 'gsap/gsap-core';

export default class LoadingBar extends Container {
  constructor() {
    super();

    this.loadingBar = new Sprite.from('loading-bar');
    this.loadingBarGlow1 = new Sprite.from('loading-bar-glow');
    this.loadingBarGlow2 = new Sprite.from('loading-bar-glow');
    this.maskLeft = new Sprite.from('loading-bar-mask-left');
    this.maskRight = new Sprite.from('loading-bar-mask-right');
    this.loadingTest1 = new Sprite.from('loading-bar-test');
    this.loadingTest1.name = '1';
    this.loadingTest2 = new Sprite.from('loading-bar-test');
    this.loadingTest2.name = '2';

    this.loadingBar.anchor.set(0.5);
    this.loadingBarGlow1.anchor.set(0.5, 0);
    this.loadingBarGlow2.anchor.set(0.5, 0);
    this.maskLeft.anchor.set(1, 0.5);
    this.maskRight.anchor.set(0, 0.5);
    this.loadingTest1.anchor.set(0, 0.5);
    this.loadingTest2.anchor.set(0, 0.5);

    this.loadingTest2.rotation = Math.PI;
  
    this.addChild(
      this.loadingBar,
      this.loadingBarGlow1,
      this.loadingBarGlow2,
      this.maskLeft,
      this.maskRight,
      this.loadingTest1,
      this.loadingTest2,
    );

    this.loadingTest1.mask = this.maskLeft;
    this.loadingTest2.mask = this.maskRight;
  }

  update(val) {
    const radians = mapRange(0, 100, 0, Math.PI * 2, val);
    this.loadingBarGlow2.rotation = radians;
    if (val <= 50) {
      this.loadingTest1.rotation = radians;
    } else {
      this.loadingTest1.rotation = Math.PI;
      this.loadingTest2.rotation = radians;
    }
  }
}