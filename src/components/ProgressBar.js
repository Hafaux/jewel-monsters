import { gsap, mapRange } from 'gsap/gsap-core';
import { Container, Sprite } from 'pixi.js';

/**
 * Class representing the xp progress bar during the game.
 * @prop {PIXI.Sprite} scoreBase sprite
 * @prop {PIXI.Sprite} loadingLeft sprite
 * @prop {PIXI.Sprite} loadingMiddle sprite
 * @prop {PIXI.Sprite} loadingRight sprite
 */
export default class ProgressBar extends Container {
  constructor() {
    super();

    this.scoreBase = new Sprite.from('score-base');
    this.loadingLeft = new Sprite.from('loading-left');
    this.loadingMiddle = new Sprite.from('loading-middle');
    this.loadingRight = new Sprite.from('loading-right');

    this.scoreBase.anchor.set(0.5);
    this.addChild(this.scoreBase);
    this._addProgressBar();
  }

  /**
   * Adds all the elements of the progress bar.
   * @private
   */
  _addProgressBar() {
    this.loadingBarContainer = new Container();
    this.loadingBarContainer.visible = false;
    this.loadingLeft.anchor.set(0.5);
    this.loadingMiddle.anchor.set(0, 0.5);
    this.loadingRight.anchor.set(0.5);
    this.loadingMiddle.scale.x = 0.5;

    this.loadingLeft.position.x = -285;
    this.loadingMiddle.position.x = -280;
    this.loadingRight.position.x = -275 + this.loadingMiddle.width;
    this.addChild(this.loadingBarContainer);
    this.loadingBarContainer.addChild(
      this.loadingLeft,
      this.loadingMiddle,
      this.loadingRight
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

    gsap.to(this.loadingMiddle.scale, {
      x: scale,
      onUpdate: () => {
        this.loadingRight.position.x = -275 + this.loadingMiddle.width;
      }
    });
  }
}