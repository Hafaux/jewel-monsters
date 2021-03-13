import { Container, Sprite, filters } from 'pixi.js';
import NumberContainer from './NumberContainer';

export default class Moves extends Container {
  constructor(numMoves) {
    super();
    this.numMoves = numMoves;

    this.background = new Sprite.from('moves-bg');
    this.movesText = new Sprite.from('moves');

    this.numberContainer = new NumberContainer(this.numMoves);

    this._init();
  }

  _init() {
    this.background.anchor.set(0.5);
    this.movesText.anchor.set(0.5, 1);
    this.movesText.position.y = -20;
    this.numberContainer.scale.set(0.8);
    this.numberContainer.position.x = 22;
    this.numberContainer.position.y = 10;

    const colorMatrix = new filters.ColorMatrixFilter();
    colorMatrix.blackAndWhite();
    this.numberContainer.filters = [colorMatrix];
    this.movesText.filters = [colorMatrix];

    this.addChild(this.background, this.movesText, this.numberContainer);
  }

  updateMoves(moves) {
    if (moves < 10) this.numberContainer.x = 0;
    this.numberContainer.updateNumber(moves);
  }
}