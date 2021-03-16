import { Container, Sprite } from 'pixi.js';

/**
 * Class representing the number sprites.
 * @prop {Number} integer integer number
 * @prop {(PIXI.Container|null)} digitContainer element containing the number sprites
 */
export default class NumberContainer extends Container {
  constructor(integer) {
    super();

    this.integer = integer;
    this.digitContainer = null;

    this.updateNumber(this.integer);
  }

  /**
   * Updates the number container
   * @param {Number} num integer number
   */
  updateNumber(num) {
    if (this.digitContainer) this.removeChild(this.digitContainer);
    this.digitContainer = new Container();

    this._addDigits(num);
    this.addChild(this.digitContainer);
  }

  /**
   * Adds all the digits of the number as sprites to the container.
   * @param {Number} num integer number
   * @private
   */
  _addDigits(num) {
    let digitOffset = 0;

    if (num === 0) {
      const digitSprite = this._getDigitSprite(0, digitOffset);
      this.digitContainer.addChild(digitSprite);
    } else {
      while (num > 0) {
        const currentDigit = num % 10;
        const digitSprite = this._getDigitSprite(currentDigit, digitOffset);
        this.digitContainer.addChild(digitSprite);
  
        num = Math.floor(num / 10);
        digitOffset -= 60;
      }
    }
  }

  /**
   * Returns a digit sprite.
   * @param {Number} digit single digit
   * @param {Number} digitOffset Digit position
   * @returns {PIXI.Sprite}
   */
  _getDigitSprite(digit, digitOffset) {
    const digitSprite = new Sprite.from(digit.toString());

    digitSprite.anchor.set(0.5);
    digitSprite.position.x = digitOffset;

    return digitSprite;
  }
}