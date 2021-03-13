import { Container, Sprite } from 'pixi.js';

export default class NumberContainer extends Container {
  constructor(integer) {
    super();

    this.integer = integer;
    this.digitContainer = null;

    this.updateNumber(this.integer);
  }

  updateNumber(num) {
    if (this.digitContainer) this.removeChild(this.digitContainer);
    this.digitContainer = new Container();

    this._addDigits(num);
    this.addChild(this.digitContainer);
  }

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

  _getDigitSprite(digit, digitOffset) {
    const digitSprite = new Sprite.from(digit.toString());

    digitSprite.anchor.set(0.5);
    digitSprite.position.x = digitOffset;

    return digitSprite;
  }
}