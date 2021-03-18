import { Container, Sprite, filters } from 'pixi.js';
import NumberContainer from './NumberContainer';

/**
 * Class representing the container showing the current moves.
 * @prop {Number} _numMoves Amount of moves to show
 * @prop {PIXI.Sprite} _background Moves container background
 * @prop {PIXI.Sprite} _movesText The text sprite saying "moves"
 * @prop {NumberContainer} _numberContainer the moves number container
 */
export default class Moves extends Container {
  constructor(numMoves) {
    super();
    this._numMoves = numMoves;

    this._background = new Sprite.from('moves-bg');
    this._movesText = new Sprite.from('moves');

    this._numberContainer = new NumberContainer(this._numMoves);

    this._init();
  }

  /**
   * Prepares all the sprites, adds a filter, appends everything
   * @private
   */
  _init() {
    this._background.anchor.set(0.5);
    this._movesText.anchor.set(0.5, 1);
    this._movesText.position.y = -20;
    this._numberContainer.scale.set(0.8);
    this._numberContainer.position.x = 22;
    this._numberContainer.position.y = 10;

    const colorMatrix = new filters.ColorMatrixFilter();
    colorMatrix.blackAndWhite();
    this._numberContainer.filters = [colorMatrix];
    this._movesText.filters = [colorMatrix];

    this.updateMoves(this._numMoves);
    this.addChild(this._background, this._movesText, this._numberContainer);
  }

  /**
   * Update the moves number
   * @param {Number} moves number of moves
   */
  updateMoves(moves) {
    if (moves < 10) this._numberContainer.x = 0;
    this._numberContainer.updateNumber(moves);
  }
}