import Assets from '../core/AssetManager';
import Scene from './Scene';
import config from '../config';

export default class Splash extends Scene {
  constructor() {
    super();

    this.config = config.scenes.Splash;
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
      'loading-bar': Assets.images['loading-bar'],
      'loading-bar-glow': Assets.images['loading-bar-glow'],
      'loading-bar-mask-left': Assets.images['loading-bar-mask-left'],
      'loading-bar-mask-right': Assets.images['loading-bar-mask-right'],
      'loading-bar-test': Assets.images['loading-bar-test'],
      fire: Assets.images.fire,
    };
    const sounds = {
      
    };

    return super.preload({ images, sounds });
  }

  onResize(width, height) { // eslint-disable-line no-unused-vars
  }

  onLoadProgress() {
  }
}
