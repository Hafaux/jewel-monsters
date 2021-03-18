import { Container, Graphics, Text } from 'pixi.js';

/**
 * Class representing the text prompt button during the game over scenes
 * @prop {PIXI.Text} text prompt text
 * @prop {PIXI.Graphics} _borderGraphics the border graphic
 */
export default class Prompt extends Container {
  constructor(text) {
    super();

    this.text = new Text(text, {
      fill: 0xFFF800,
      fontSize: 15,
      fontWeight: 'bold'
    });
    this.text.anchor.set(0.5);

    const width = 340;
    const height = 36;
    this._borderGraphics = new Graphics();
    this._borderGraphics.lineStyle(3, 0xFFD81F);
    this._borderGraphics.drawRoundedRect(-width / 2, -height / 2, width, height, 50);
    
    this.addChild(this.text);
    this.addChild(this._borderGraphics);

    this.cacheAsBitmap = true;
  }
}