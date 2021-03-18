import { Container, Sprite } from 'pixi.js';
import gsap from 'gsap';

/**
 * Class representing the match-3 symbol.
 * @prop {Boolean} isCleared whether the symbol has been cleared
 * @prop {Number} type symbol type (from 1 to 6)
 * @prop {PIXI.Sprite} _sprite the symbol sprite
 * @prop {Number} id the symbol index in the symbols array
 */
export default class Symbol extends Container {
  constructor(type, id) {
    super();

    this.isCleared = false;
    this.type = type;
    this._sprite = new Sprite.from(`symbol-${this.type}`);
    this.id = id;

    this.buttonMode = true;
    this.interactive = true;
    this.cursor = 'default';

    this.pivot.set(50, 50);

    this.addChild(this._sprite);
  }

  /**
   * Clears the symbol.
   * @returns {Promise}
   */
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

  /**
   * updates the symbol's index
   * @param {Number} index new Index
   */
  updateIndex(index) {
    this.id = index;
  }
}