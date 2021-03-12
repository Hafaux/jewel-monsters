import Assets from '../core/AssetManager';
import Scene from './Scene';
import config from '../config';
import LoadingBar from '../components/LoadingBar';
import Fire from '../components/Fire';
import Character from '../components/Character';

export default class Loading extends Scene {
  constructor() {
    super();

    this.config = config.scenes.Loading;

    this.loadingBar = new LoadingBar();
    this.addChild(this.loadingBar);

    this._addFire();
    this._addCharacter();
  }

  _addFire() {
    const fire1 = new Fire();
    const fire2 = new Fire();
    const offsetY = 110;
    const offsetX = 680;

    fire1.position.x = -offsetX;
    fire1.position.y = offsetY;
    fire2.position.x = offsetX + 40;
    fire2.position.y = offsetY;

    this.addChild(fire1);
    this.addChild(fire2);
  }

  _addCharacter() {
    const char = new Character();
    char.scale.set(0.8);
    this.addChild(char);
  }

  get finish() {
    return new Promise((res)=>setTimeout(res, this.config.hideDelay));
  }

  preload() {
    const images = {
      'char-body': Assets.images['char-body'],
      'char-eye': Assets.images['char-eye'],
      'char-lid-bottom': Assets.images['char-lid-bottom'],
      'char-lid-top': Assets.images['char-lid-top'],
      'fire-glow': Assets.images['fire-glow'],
      'label-failed': Assets.images['label-failed'],
      'label-passed': Assets.images['label-passed'],
      'loading-bar': Assets.images['loading-bar'],
      'loading-bar-glow': Assets.images['loading-bar-glow'],
      'loading-bar-mask-left': Assets.images['loading-bar-mask-left'],
      'loading-bar-mask-right': Assets.images['loading-bar-mask-right'],
      'loading-bar-test': Assets.images['loading-bar-test'],
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
      fire: Assets.images.fire,
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
      
    };

    return super.preload({ images, sounds });
  }

  onResize(width, height) { // eslint-disable-line no-unused-vars
    // this.loadingText.x = width / 2;
    // this.loadingText.y = (height / 2) + 500;
  }

  onLoadProgress(val) {
    // this.loadingText.text = `${val}%`;
    this.loadingBar.update(val * 2);
  }
}
