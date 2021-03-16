import Loading from './scenes/Loading';
import Splash from './scenes/Splash';
import Play from './scenes/Play';
import Win from './scenes/Win';
import Lose from './scenes/Lose';
import config from './config';
import { Container } from 'pixi.js';

/**
 * Main game stage, manages scenes/levels.
 *
 * @extends {PIXI.Container}
 */
export default class Game extends Container {

  static get events() {
    return {
      SWITCH_SCENE: 'switch_scene',
      WIN: 'win',
      LOSE: 'lose',
    };
  }

  /**
   * @param {PIXI.Sprite} background 
   */
  constructor({ background } = {}) {
    super();

    this._background = background;
    this.currentScene = null;
  }

  async start() {
    await this._switchToLoading();
    this.switchScene(Play, { scene: 'play' });
  }

  /**
   * @param {Function} constructor 
   * @param {String} scene 
   */
  switchScene(constructor, scene) {
    this.removeChild(this.currentScene);

    if (constructor === Splash) this.currentScene = new Splash(false);
    else this.currentScene = new constructor();

    this.currentScene.background = this._background;
    this.addChild(this.currentScene);

    this._addSceneListeners(constructor);

    this.emit(Game.events.SWITCH_SCENE, scene);

    return this.currentScene.onCreated();
  }

  _addSceneListeners(constructor) {
    if (constructor === Play) {
      const playScene = this.currentScene;

      playScene.on(config.events.WIN, () => {
        this.switchScene(Win, { scene: 'win' });
      });
      playScene.on(config.events.LOSE, () => {
        this.switchScene(Lose, { scene: 'lose' });
      });
    } else if (constructor === Win || constructor === Lose) {
      const gameEndScene = this.currentScene;

      gameEndScene.on(config.events.RESTART, () => {
        this.switchScene(Play, { scene: 'play' });
      });
    }
  }

  async _switchToLoading() {
    await this.switchScene(Splash, { scene: 'splash' });
    await this.currentScene.finish;
    await this.switchScene(Loading, { scene: 'loading' });
    await this.currentScene.finish;
  }

  /**
   * Hook called by the application when the browser window is resized.
   * Use this to re-arrange the game elements according to the window size
   *
   * @param  {Number} width  Window width
   * @param  {Number} height Window height
   */
  onResize(width, height) {
    if (this.currentScene === null) return;

    this.currentScene.onResize(width, height);
  }
}
