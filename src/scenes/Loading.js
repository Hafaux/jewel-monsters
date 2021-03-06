import Assets from '../core/AssetManager';
import Scene from './Scene';
import config from '../config';
import LoadingBar from '../components/LoadingBar';
import Character from '../components/Character';

/**
 * Class representing the loading screen.
 * @prop {Object} config scene config
 * @prop {LoadingBar} loadingBar The circular loading bar.
 */
export default class Loading extends Scene {
  constructor() {
    super();

    this.config = config.scenes.Loading;
  }

  async _init() {
    await this._loadSceneAssets();
    
    this.addFire();
    this._addCharacter();
    this.loadingBar = new LoadingBar();
    this.addChild(this.loadingBar);
  }

  async _loadSceneAssets() {
    const images = {
      'char-body': Assets.images['char-body'],
      'char-eye': Assets.images['char-eye'],
      'char-lid-bottom': Assets.images['char-lid-bottom'],
      'char-lid-top': Assets.images['char-lid-top'],
      'fire-glow': Assets.images['fire-glow'],
      'loading-bar': Assets.images['loading-bar'],
      'loading-bar-glow': Assets.images['loading-bar-glow'],
      'loading-bar-mask-left': Assets.images['loading-bar-mask-left'],
      'loading-bar-mask-right': Assets.images['loading-bar-mask-right'],
      'loading-bar-blue': Assets.images['loading-bar-blue'],
      fire: Assets.images.fire,
      'displacement-map': Assets.images['displacement-map'], 
      particle: Assets.images.particle,
    };

    await Assets.load({ images });
    await Assets.prepareImages(images);
  }

  /**
   * Adds the character to the scene.
   * @private
   */
  _addCharacter() {
    const char = new Character();

    char.hover('+=10', 2);
    char.scale.set(0.8);
    this.addChild(char);
  }

  get finish() {
    return new Promise((res)=>setTimeout(res, this.config.hideDelay));
  }

  async preload() {
    const images = {
      'label-failed': Assets.images['label-failed'],
      'label-passed': Assets.images['label-passed'],
      'loading-left': Assets.images['loading-left'],
      'loading-middle': Assets.images['loading-middle'],
      'loading-right': Assets.images['loading-right'],
      'moves-bg': Assets.images['moves-bg'],
      'score-base': Assets.images['score-base'],
      'symbol-1': Assets.images['symbol-1'],
      'symbol-2': Assets.images['symbol-2'],
      'symbol-3': Assets.images['symbol-3'],
      'symbol-4': Assets.images['symbol-4'],
      'symbol-5': Assets.images['symbol-5'],
      'symbol-6': Assets.images['symbol-6'],
      moves: Assets.images.moves,
      tooltip: Assets.images.tooltip,
      xp: Assets.images.xp,
      0: Assets.images['0'],
      1: Assets.images['1'],
      2: Assets.images['2'],
      3: Assets.images['3'],
      4: Assets.images['4'],
      5: Assets.images['5'],
      6: Assets.images['6'],
      7: Assets.images['7'],
      8: Assets.images['8'],
      9: Assets.images['9'],
      X: Assets.images.X,
      P: Assets.images.P,
    };
    const sounds = {
      match: Assets.sounds.match,
      win: Assets.sounds.win,
      fail: Assets.sounds.fail,
    };

    await this._init();

    return super.preload({ images, sounds });
  }

  onResize(width, height) { // eslint-disable-line no-unused-vars
  }

  /**
   * Called when there's a sprite loading progress update.
   * @param {Number} val loading progress
   */
  onLoadProgress(val) {
    this.loadingBar.update(val);
  }
}
