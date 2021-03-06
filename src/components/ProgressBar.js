import { gsap, mapRange } from 'gsap/gsap-core';
import { Container, Sprite } from 'pixi.js';

/**
 * Class representing the xp progress bar during the game.
 * @prop {PIXI.Sprite} _scoreBase sprite
 * @prop {PIXI.Sprite} _loadingLeft sprite
 * @prop {PIXI.Sprite} _loadingMiddle sprite
 * @prop {PIXI.Sprite} _loadingRight sprite
 */
export default class ProgressBar extends Container {
  constructor() {
    super();

    this._scoreBase = new Sprite.from('score-base');
    this._loadingLeft = new Sprite.from('loading-left');
    this._loadingMiddle = new Sprite.from('loading-middle');
    this._loadingRight = new Sprite.from('loading-right');

    this._scoreBase.anchor.set(0.5);
    this.addChild(this._scoreBase);
    this._addProgressBar();
  }

  /**
   * Adds all the elements of the progress bar.
   * @private
   */
  _addProgressBar() {
    this.loadingBarContainer = new Container();
    this.loadingBarContainer.visible = false;
    this._loadingLeft.anchor.set(0.5);
    this._loadingMiddle.anchor.set(0, 0.5);
    this._loadingRight.anchor.set(0.5);
    this._loadingMiddle.scale.x = 0.5;

    this._loadingLeft.position.x = -285;
    this._loadingMiddle.position.x = -280;
    this._loadingRight.position.x = -275 + this._loadingMiddle.width;
    this.addChild(this.loadingBarContainer);
    this.loadingBarContainer.addChild(
      this._loadingLeft,
      this._loadingMiddle,
      this._loadingRight
    );
  }

  /**
   * Updates progress.
   * @param {Number} currentXp current xp
   * @param {Number} maxXp max xp
   */
  updateProgress(currentXp, maxXp) {
    if (!this.loadingBarContainer.visible && currentXp > 0) {
      this.loadingBarContainer.visible = true;
    }

    if (currentXp > maxXp) currentXp = maxXp;
    const scale = mapRange(0, maxXp, 0, 18.6, currentXp);

    gsap.to(this._loadingMiddle.scale, {
      x: scale,
      onUpdate: () => {
        this._loadingRight.position.x = -275 + this._loadingMiddle.width;
      }
    });
  }
}