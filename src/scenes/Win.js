import Scene from './Scene';
import config from '../config';
import Character from '../components/Character';
import { Container, Sprite } from 'pixi.js';
import gsap from 'gsap/gsap-core';
import Prompt from '../components/Prompt';
import Assets from '../core/AssetManager';
import Label from '../components/Label';

/**
 * Class representing the winning scene.
 */
export default class Win extends Scene {
  constructor() {
    super();

    this._addXpSprites();
    this._charContainer = this._addCharacters();
    this._addLabel(); 
    this._addPrompt();
    this.addFire();

    this._keyDownHandler = this._onKeyDown.bind(this);
    window.addEventListener('keydown', this._keyDownHandler);
    Assets.sounds.win.play();

    this._resizeScene();
  }

  /**
   * Called on key down.
   * @param {Event} e keydown event
   * @private
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

    this._characters.forEach((char) => {
      char.unfollowMouse();
    });

    this.emit(config.events.RESTART);
  }

  /**
   * Adds and animates the characters and sets them up.
   * @private
   * @returns {PIXI.Container}
   */
  _addCharacters() {
    const charContainer = new Container();
    this._characters = [
      new Character(),
      new Character(),
      new Character(),
    ];

    this._characters[0].position.x = -250;
    this._characters[0].position.y = -200;
    this._characters[1].position.x = -50;
    this._characters[1].position.y = -300;
    this._characters[2].position.x = 200;
    this._characters[2].position.y = -250;

    this._characters[0].scale.set(0.6);
    this._characters[1].scale.set(0.4);
    this._characters[2].scale.set(0.8);

    gsap.from(this._characters.map((char) => char.position), {
      y: '-=500',
      duration: 1,
      stagger: 0.2,
      ease: 'back',
      onComplete: () => {
        this._characters[0].hover('-=40', 3);
        this._characters[1].hover('-=30', 2);
        this._characters[2].hover('-=20', 4);
      }
    });

    this._characters.forEach((character) => {
      character.openEyes();
      character.followMouse();
      charContainer.addChild(character);
    });

    this.addChild(charContainer);

    return charContainer;
  }

  /**
   * Adds and animates the flying XP sprites.
   * @private
   */
  _addXpSprites() {
    this._xpContainer = new Container();
    const sprites = [
      new Sprite.from('xp'),
      new Sprite.from('xp'),
      new Sprite.from('xp'),
    ];

    sprites.forEach((sprite) => {
      sprite.position.y = -50;
      sprite.alpha = 0;
      sprite.anchor.set(0.5);
      this._xpContainer.addChild(sprite);
    });

    this.addChild(this._xpContainer);

    sprites[1].scale.set(0.4);
    sprites[2].scale.set(0.4);

    const ease = 'power3.out';
    const duration = 1.5;

    new gsap.timeline()
      .to(sprites[0].position, { x: 380, y: -200, duration, ease })
      .to(sprites[0], { alpha: 1, rotation: 0.5, duration, }, '<')
      .to(sprites[1].position, { x: 70, y: -430, duration, ease }, '<')
      .to(sprites[1], { alpha: 1, rotation: 0.3, duration, }, '<')
      .to(sprites[2].position, { x: -400, y: -250, duration, ease }, '<')
      .to(sprites[2], { alpha: 1, rotation: -0.3, duration, }, '<');
  }

  /**
   * Adds and animates the label.
   * @private
   */
  _addLabel() {
    this._labelContainer = new Label('label-passed');

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
      this._charContainer.scale.set(scale);
      this._xpContainer.scale.set(scale);
    } else {
      this._labelContainer.scale.set(1);
      this._charContainer.scale.set(1);
      this._xpContainer.scale.set(1);
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