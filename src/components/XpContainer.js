import { Container, Sprite } from 'pixi.js';
import NumberContainer from './NumberContainer';

export default class XpContainer extends Container {
  constructor(xp) {
    super();
    this.xp = xp;

    this._init();
  }

  _init() {
    this._addNumberContainer();
    this._addXpLetters();
  }

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

  _addNumberContainer() {
    this.numberContainer = new NumberContainer(this.xp);

    this.addChild(this.numberContainer);
  }

  updateXp(newXp) {
    this.xp = newXp;
    this.numberContainer.updateNumber(this.xp);
  }
}