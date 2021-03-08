import { Container, Graphics, Sprite } from 'pixi.js';
import gsap from 'gsap';

export default class Character extends Container {
  constructor() {
    super();

    this.name = 'character';
    this.charBody = new Sprite.from('char-body');
    this.charBody.name = 'char-body';
    this.charEye = new Sprite.from('char-eye');
    this.charEye.name = 'char-eye';
    this.charLidBottom = new Sprite.from('char-lid-bottom');
    this.charLidBottom.name = 'char-lid-bottom';
    this.charLidTop = new Sprite.from('char-lid-top');
    this.charLidTop.name = 'char-lid-top';

    this.charBody.anchor.set(0.5);
    this.charEye.anchor.set(0.5);
    this.charLidBottom.anchor.set(0.5);
    this.charLidTop.anchor.set(0.5);

    this.charEye.position.y = -20;
    this.charLidTop.position.y = -45;
    this.charLidBottom.position.y = 5;

    this.addChild(
      this.charBody,
      this.charEye,
      this.charLidBottom,
      this.charLidTop,
    );
  }
}