import { Container, Sprite, Texture } from 'pixi.js';
import config from '../config';

export default class Moves extends Container {
  constructor(moves) {
    super();
    this.numMoves = moves;

    this.background = new Sprite.from('moves-bg');
    this.movesText = new Sprite.from('moves');

    this.movesTens = new Sprite.from('2');
    this.movesOnes = new Sprite.from('0');

    this._init();
  }

  _init() {
    this.background.anchor.set(0.5);
    this.movesText.anchor.set(0.5, 1);
    this.movesText.position.y = -20;

    this.movesTens.anchor.set(0.5);
    this.movesOnes.anchor.set(0.5);
    this.movesTens.scale.set(0.8);
    this.movesOnes.scale.set(0.8);

    this.movesOnes.position.y = 10;
    this.movesTens.position.y = 10;

    this.movesOnes.position.x = 20;
    this.movesTens.position.x = -25;

    this.addChild(this.background, this.movesText, this.movesTens, this.movesOnes);
  }

  updateMoves(moves) {
    if (moves > 99 || moves < 0) return;

    if (!moves) this.emit(config.events.loss);

    this.movesOnes.texture = (new Texture.from(`${moves % 10}`));
    this.movesTens.texture = (new Texture.from(`${Math.floor(moves / 10)}`));
  }
}