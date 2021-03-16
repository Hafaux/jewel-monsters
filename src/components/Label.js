import { Container, Sprite } from 'pixi.js';

/**
 * Class representing the level passed or level failed label.
 * @prop {PIXI.Sprite} label the label sprite
 */
export default class Label extends Container {
  constructor(spriteName) {
    super();

    this.label = new Sprite.from(spriteName);
    this.label.anchor.set(0.5);

    this.addChild(this.label);
  }
}