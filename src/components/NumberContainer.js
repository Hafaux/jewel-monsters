import { Container, Sprite } from 'pixi.js';

/**
 * Class representing the number sprites.
 * @prop {Number} _integer integer number
 * @prop {(PIXI.Container|null)} _digitContainer element containing the number sprites
 */
export default class NumberContainer extends Container {
  constructor(integer) {
    super();

    this._integer = integer;
    this._digitContainer = null;

    this.updateNumber(this._integer);
  }

  /**
   * Updates the number container
   * @param {Number} num integer number
   */
  updateNumber(num) {
    if (this._digitContainer) this.removeChild(this._digitContainer);
    this._digitContainer = new Container();

    this._addDigits(num);
    this.addChild(this._digitContainer);
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
      this._digitContainer.addChild(digitSprite);
    } else {
      while (num > 0) {
        const currentDigit = num % 10;
        const digitSprite = this._getDigitSprite(currentDigit, digitOffset);
        this._digitContainer.addChild(digitSprite);
  
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