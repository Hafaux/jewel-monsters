import { Container, Graphics, Text } from 'pixi.js';

/**
 * Class representing the text prompt button during the game over scenes
 * @prop {PIXI.Text} text prompt text
 * @prop {PIXI.Graphics} borderGraphics the border graphic
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
    this.borderGraphics = new Graphics();
    this.borderGraphics.lineStyle(3, 0xFFD81F);
    this.borderGraphics.drawRoundedRect(-width / 2, -height / 2, width, height, 50);
    
    this.addChild(this.text);
    this.addChild(this.borderGraphics);

    this.cacheAsBitmap = true;
  }
}