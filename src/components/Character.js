import { Container, Sprite } from 'pixi.js';
import gsap from 'gsap';

/**
 * Class representing the floating monster character.
 * @prop {PIXI.Sprite} _charBody the body sprite
 * @prop {PIXI.Sprite} _charEye the eye sprite
 * @prop {PIXI.Sprite} _charLidBottom the bottom eyelid sprite
 * @prop {PIXI.Sprite} _charLidTop the top eyelid sprite
 */
export default class Character extends Container {
  constructor() {
    super();

    this.name = 'character';
    this._charBody = new Sprite.from('char-body');
    this._charBody.name = 'char-body';
    this._charEye = new Sprite.from('char-eye');
    this._charEye.name = 'char-eye';
    this._charLidBottom = new Sprite.from('char-lid-bottom');
    this._charLidBottom.name = 'char-lid-bottom';
    this._charLidTop = new Sprite.from('char-lid-top');
    this._charLidTop.name = 'char-lid-top';

    this._init();
  }

  /**
   * Sets the elements up
   * @private
   */
  _init() {
    this._charBody.anchor.set(0.5);
    this._charEye.anchor.set(0.5);
    this._charLidBottom.anchor.set(0.5, 1);
    this._charLidTop.anchor.set(0.5, 0);

    this._charEye.position.y = -20;
    this._charLidTop.position.y = -60;
    this._charLidBottom.position.y = 20;

    this.addChild(
      this._charBody,
      this._charEye,
      this._charLidBottom,
      this._charLidTop,
    );

    this.tl = new gsap.timeline();
  }

  /**
   * Plays the blinking nimation
   */
  blink() {
    const eyelidsScale = [this._charLidTop, this._charLidBottom].map((c) => c.scale);
    this.tl.to(eyelidsScale, {
      y: 1.4,
      yoyo: true,
      repeat: 1,
      duration: 0.1,
      ease: 'linear'
    });
  }

  /**
   * Eyes widening animation
   */
  openEyesWide() {
    const eyelidsScale = [this._charLidTop, this._charLidBottom].map((c) => c.scale);
    this.tl
      .to(eyelidsScale, {
        y: 0.3,
        x: 0.6,
        duration: 0.1,
        ease: 'power1.in',
      })
      .to(eyelidsScale, {
        y: 1,
        x: 1,
        duration: 0.3,
      }, '+=0.5');
  }

  /**
   * Starts the hover animation.
   * @param {number | string} y the y property for the tween
   * @param {number} duration tween duration
   * @returns {Character}
   */
  hover(y, duration) {
    gsap.to(this.position, {
      y,
      duration,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });

    return this;
  }

  /**
   * Hook called whenever the pointer moves.
   * @param {Event} e event
   * @private
   */
  _onPointerMove(e) {
    const bounds = this.getBounds();
    const eyeMiddlePos = {
      x: bounds.x + (bounds.width / 2),
      y: bounds.y + (bounds.height / 2),
    };
    const eyePos = {
      x: -(eyeMiddlePos.x - e.pageX) / 120,
      y: -(eyeMiddlePos.y - e.pageY) / 120 - 20,
    };

    this._charEye.position.x = eyePos.x;
    this._charEye.position.y = eyePos.y;
  }

  /**
   * Eyes start following the pointer.
   * @returns {Character}
   */
  followMouse() {
    this.pointerHandler = this._onPointerMove.bind(this);
    window.addEventListener('pointermove', this.pointerHandler);

    return this;
  }

  /**
   * Eyes stop following the cursor.
   * @returns {Character} 
   */
  unfollowMouse() {
    window.removeEventListener('pointermove', this.pointerHandler);

    return this;
  }

  /**
   * Makes the eyelid sprites invisible
   * @returns {Character}
   */
  openEyes() {
    this._charLidBottom.visible = false;
    this._charLidTop.visible = false;

    return this;
  }
  
  /**
   * Makes eyelid sprites visible
   * @returns {Character}
   */
  closeEyes() {
    this._charLidBottom.visible = true;
    this._charLidTop.visible = true;

    return this;
  }
}