import { Sprite } from 'pixi.js';
import Scene from './Scene';
import gsap from 'gsap';
import Fire from '../components/Fire';
import Character from '../components/Character';
import LoadingBar from '../components/LoadingBar';

export default class Play extends Scene {
  async onCreated() {

    // const footer = new Footer();
    // footer.x = - window.innerWidth / 2;
    // footer.y = window.innerHeight / 2 - footer.height;
    // this.addChild(footer);

    this._addFire();
    this._addLoadingBar();
    this._addCharacters();
  }

  _addLoadingBar() {
    const loadingBar = new LoadingBar();

    this.addChild(loadingBar);

    loadingBar.update(70);
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

  _addCharacters() {
    const char1 = new Character();
    const char2 = new Character();

    char1.scale.set(0.4);
    char1.position.x = 300;
    char1.position.y = -200;

    char2.position.x = -500;
    char2.position.y = 50;

    gsap.to([char1.position, char2.position], {
      y: '+=20',
      repeat: -1,
      yoyo: true,
      duration: 3,
    });

    this.addChild(char1, char2);
  }

  /**
   * Hook called by the application when the browser window is resized.
   * Use this to re-arrange the game elements according to the window size
   *
   * @param  {Number} width  Window width
   * @param  {Number} height Window height
   */
  onResize(width, height) { // eslint-disable-line no-unused-vars

  }
}
