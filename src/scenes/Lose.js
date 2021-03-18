import Scene from './Scene';
import config from '../config';
import gsap from 'gsap/gsap-core';
import Prompt from '../components/Prompt';
import Assets from '../core/AssetManager';
import Label from '../components/Label';

/**
 * Class representing the losing scene.
 */
export default class Lose extends Scene {
  constructor() {
    super();

    this._addLabel();
    this._addPrompt();
    
    this._keyDownHandler = this._onKeyDown.bind(this);
    window.addEventListener('keydown', this._keyDownHandler);
    Assets.sounds.fail.play();

    this._resizeScene();
  }
  
  /**
   * Called on key down.
   * @param {Event} e keydown event
   */
  _onKeyDown(e) {
    if (e.code === 'Space') this._restartGame();
  }

  /**
   * Cleans up the scene and restarts the game.
   * @private
   */
  _restartGame() {
    window.removeEventListener('keydown', this._keyDownHandler);

    this.emit(config.events.RESTART);
  }

  /**
   * Adds and animates the label.
   * @private
   */
  _addLabel() {
    this._labelContainer = new Label('label-failed');

    gsap.fromTo(this._labelContainer.position, {
      y: -window.innerHeight / 2,
    }, {
      y: 0,
      ease: 'back',
      duration: 1,
    });

    this.addChild(this._labelContainer);

    this._labelContainer.startingWidth = this._labelContainer.width;
  }

  /**
   * Adds and initializes the prompt
   * @private
   */
  _addPrompt() {
    const prompt = new Prompt('PRESS SPACE TO PLAY AGAIN');
    gsap.fromTo(prompt, {
      y: 0,
    }, {
      y: 220,
      ease: 'back',
      duration: 1
    });
    this.addChild(prompt);

    prompt.buttonMode = true;
    prompt.interactive = true;
    prompt.on('pointerdown', this._restartGame.bind(this));
  }

  /**
   * Resizes the scene to fit the screen.
   * @private
   */
  _resizeScene() {
    const labelWidth = this._labelContainer.startingWidth;

    if (labelWidth > window.innerWidth) {
      const scale = (window.innerWidth / (labelWidth + 20));
      this._labelContainer.scale.set(scale);
    } else {
      this._labelContainer.scale.set(1);
    }
  }
  
  /**
   * Hook called by the application when the browser window is resized.
   * @param  {Number} width  Window width
   * @param  {Number} height Window height
   */
  onResize(width, height) { // eslint-disable-line no-unused-vars
    this._resizeScene();
  }
}