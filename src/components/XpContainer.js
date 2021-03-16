import { Container, Sprite } from 'pixi.js';
import NumberContainer from './NumberContainer';

/**
 * Class representing an XP container, containing number sprites and XP letter sprites.
 * @prop {Number} xp Amount of xp to display
 */
export default class XpContainer extends Container {
  /**
   * @param {Number} xp Amount of xp to display.
   */
  constructor(xp) {
    super();
    this.xp = xp;

    this._init();
  }

  /**
   * Initializes the container.
   * @private
   */
  _init() {
    this._addNumberContainer();
    this._addXpLetters();
  }

  /**
   * Adds the 'XP' letter sprites.
   * @private
   */
  _addXpLetters() {
    const text = 'XP';

    let xpOffset = 65;
    text.split('').forEach((letter) => {
      const letterSprite = new Sprite.from(letter);
      letterSprite.anchor.set(0.5);
      letterSprite.position.x = xpOffset;
      xpOffset += 60;
      this.addChild(letterSprite);
    });
  }

  /**
   * Adds the number container.
   * @private
   */
  _addNumberContainer() {
    this.numberContainer = new NumberContainer(this.xp);

    this.addChild(this.numberContainer);
  }

  /**
   * Updates the xp shown.
   * @param {Number} newXp New xp to show
   */
  updateXp(newXp) {
    this.xp = newXp;
    this.numberContainer.updateNumber(this.xp);
  }
}