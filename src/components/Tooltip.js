import { Container, Sprite, filters } from 'pixi.js';
import XpContainer from './XpContainer';

export default class Tooltip extends Container {
  constructor(xp = 5000) {
    super();
    
    this.xp = xp;

    this.tooltip = new Sprite.from('tooltip');
    this.tooltip.scale.set(1.2);

    const colorMatrix = new filters.ColorMatrixFilter();
    colorMatrix.blackAndWhite();

    this.xpContainer = new XpContainer(this.xp);
    this.xpContainer.scale.set(0.2);
    this.xpContainer.position.y = 19;
    this.xpContainer.position.x = 52;
    this.xpContainer.filters = [colorMatrix];

    this.addChild(this.tooltip, this.xpContainer);
  }
}