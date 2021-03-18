import { Container, Sprite, filters } from 'pixi.js';
import XpContainer from './XpContainer';

/**
 * Class representing the tooltip next to the progress bar.
 * @prop {Number} _xp the xp to display
 * @prop {PIXI.Sprite} _tooltip the tooltip sprite
 * @prop {XpContainer} _xpContainer the xp number container
 */
export default class Tooltip extends Container {
  constructor(xp = 5000) {
    super();
    
    this._xp = xp;

    this._tooltip = new Sprite.from('tooltip');
    this._tooltip.scale.set(1.2);

    const colorMatrix = new filters.ColorMatrixFilter();
    colorMatrix.blackAndWhite();

    this._xpContainer = new XpContainer(this._xp);
    this._xpContainer.scale.set(0.2);
    this._xpContainer.position.y = 19;
    this._xpContainer.position.x = 52;
    this._xpContainer.filters = [colorMatrix];

    this.addChild(this._tooltip, this._xpContainer);
  }
}