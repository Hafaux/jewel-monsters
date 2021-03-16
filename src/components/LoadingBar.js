import { Container, Sprite } from 'pixi.js';
import { mapRange } from 'gsap/gsap-core';
import * as particles from 'pixi-particles';
import emitterConfig from './EmitterConfig';

/**
 * Class representing the circular loading bar.
 * @prop {Boolean} doneLoading whether the loading progress is at 100%
 * @prop {PIXI.Sprite} loadingBar the gray loading bar sprite
 * @prop {PIXI.Sprite} loadingBarGlow1 the stationary blue glow
 * @prop {PIXI.Sprite} loadingBarGlow2 the blue glow following the blue bar
 * @prop {PIXI.Sprite} maskLeft left loading bar mask
 * @prop {PIXI.Sprite} maskRight right loading bar mask
 * @prop {PIXI.Sprite} loadingBarBlueL left blue loading bar sprite
 * @prop {PIXI.Sprite} loadingBarBlueR right blue loading bar sprite
 * @prop {PIXI.Container} particleContainer the particle container
 */
export default class LoadingBar extends Container {
  constructor() {
    super();

    this.doneLoading = false;
    this.loadingBar = new Sprite.from('loading-bar');
    this.loadingBarGlow1 = new Sprite.from('loading-bar-glow');
    this.loadingBarGlow2 = new Sprite.from('loading-bar-glow');
    this.maskLeft = new Sprite.from('loading-bar-mask-left');
    this.maskRight = new Sprite.from('loading-bar-mask-right');
    this.loadingBarBlueL = new Sprite.from('loading-bar-blue');
    this.loadingBarBlueR = new Sprite.from('loading-bar-blue');

    this._init();
  }

  /**
   * Prepares all the sprites.
   * @private
   */
  _init() {
    this.loadingBar.anchor.set(0.5);
    this.loadingBarGlow1.anchor.set(0.5, 0);
    this.loadingBarGlow2.anchor.set(0.5, 0);
    this.maskLeft.anchor.set(1, 0.5);
    this.maskRight.anchor.set(0, 0.5);
    this.loadingBarBlueL.anchor.set(0, 0.5);
    this.loadingBarBlueR.anchor.set(0, 0.5);

    this.loadingBarBlueR.rotation = Math.PI;
    this.loadingBarGlow1.alpha = 0.5;
    this.maskLeft.position.y = 1;
  
    this.addChild(
      this.loadingBar,
      this.loadingBarGlow1,
      this.loadingBarGlow2,
      this.maskLeft,
      this.maskRight,
      this.loadingBarBlueL,
      this.loadingBarBlueR,
    );

    this.loadingBarBlueL.mask = this.maskLeft;
    this.loadingBarBlueR.mask = this.maskRight;

    this.particleContainer = this._addParticles();
  }

  /**
   * Adds the particles to a container
   * @private
   * @returns {PIXI.Container}
   */
  _addParticles() {
    const particleContainer = new Container();
    particleContainer.name = 'particleContainer';
    particleContainer.pivot.set(0, -165);

    this.emitter = new particles.Emitter(particleContainer, 'particle', emitterConfig);
    this.addChild(particleContainer);
    
    let elapsed = Date.now();

    function update() {
      if (this.doneLoading) return;
      
      const now = Date.now();
      this.emitter.update((now - elapsed) * 0.001);
      elapsed = now;

      requestAnimationFrame(update.bind(this));
    };

    this.emitter.emit = true;

    const updateHook = update.bind(this);
    updateHook(); 

    return particleContainer;
  }

  /**
   * Updates the progress bar
   * @param {Number} val progress bar value
   */
  update(val) {
    if (val >= 100) {
      this.doneLoading = true;
      this.emitter.emit = false;
    }
    const radians = mapRange(50, 100, 0, Math.PI * 2, val);

    this.loadingBarGlow2.rotation = radians;
    this.particleContainer.rotation = radians;

    if (val <= 75) {
      this.loadingBarBlueL.rotation = radians;
      this.loadingBarBlueR.rotation = Math.PI;
    } else {
      this.loadingBarBlueL.rotation = Math.PI;
      this.loadingBarBlueR.rotation = radians;
    }
  }
}