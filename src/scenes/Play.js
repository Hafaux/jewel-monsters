import { Container, filters } from 'pixi.js';
import Scene from './Scene';
import gsap from 'gsap';
import Character from '../components/Character';
import Moves from '../components/Moves';
import Symbol from '../components/Symbol';
import ProgressBar from '../components/ProgressBar';
import XpContainer from '../components/XpContainer';
import Tooltip from '../components/Tooltip';
import config from '../config';
import Assets from '../core/AssetManager';

/**
 * Class representing the main scene of the game.
 * @prop {Symbol} draggedSymbol The symbol the player is currently dragging
 * @prop {Boolean} gameOver Game state
 * @prop {Boolean} transition True when the symbols are in a transitional state (moving, falling, etc.)
 * @prop {Symbols[]} symbols Array containing all of the symbols in the field
 * @prop {Number} combo Number of consecutive matches
 * @prop {Object} config Game configuration object
 * @prop {Number} currentMoves The amount of moves available to the players
 * @prop {Number} currentXp Current accumulated xp
 * @prop {PIXI.Container} fireContainer Contains the two fire sprites
 * @prop {PIXI.Container} charContainer Contains the two characters
 * @prop {Moves} movesContainer The Moves label on the top
 * @prop {(PIXI.Container|null)} xpContainer The XP text above the progress bar
 * @prop {(PIXI.Container|null)} symbolContainer The element containing all of the symbols on the screen.
 */
export default class Play extends Scene {
  async onCreated() {
    this.draggedSymbol = null;
    this.gameOver = false;
    this.transition = false;
    this.symbols = [];
    this.combo = 0;
    this.config = {
      typesOfSymbols: 6,
      symbolSize: 100,
      fieldSize: 6,
      maxMoves: 20,
      maxXp: 5000,
      adjacentOnly: false,
    };
    this.currentMoves = this.config.maxMoves;
    this.currentXp = 0;

    this.charContainer = this._addCharacters();
    this.movesContainer = this._addMoves();
    this.xpContainer = null;
    this.symbolContainer = null;
    this._addProgressBar();
    this._addSymbolContainer();
    this._onSceneEnter();
  }

  /**
   * Transitions the scene elements smoothy when the scene starts.
   * @private
   * @returns {Promise}
   */
  async _onSceneEnter() {
    this.transition = true;

    const elements = [
      this.symbolContainer,
      this.charContainer,
      this.movesContainer,
      this.progressBarContainer
    ];

    await gsap.fromTo(elements, { alpha: 0 }, { alpha: 1 });

    this.transition = false;
  }

  /**
   * Called when the pointer is released outside the symbol.
   * Resets symbol scale.
   * @private
   */
  _symbolOnPointerUpOutside() {
    if (this.draggedSymbol === null) return;
    gsap.to(this.draggedSymbol.scale, {
      x: 1,
      y: 1,
      duration: 0.05,
      ease: 'linear',
    });
  }

  /**
   * Updates the xp amount on the bottom, 
   * creates a container for the XP text if one does not exist already.
   * @private
   */
  _updateCurrentXpText(xp) {
    if (this.xpContainer !== null) {
      this.xpContainer.updateXp(xp);
    } else {
      this.xpContainer = new XpContainer(xp);
  
      this.xpContainer.position.y = -50;
      this.xpContainer.scale.set(0.3);
  
      this.progressBarContainer.addChild(this.xpContainer);
    }
  }

  /**
   * Adds the progress bar on the bottom to the scene.
   * @private
   */
  _addProgressBar() {
    this.progressBarContainer = new Container();
    const progressBar = new ProgressBar();
    const tooltip = new Tooltip(this.config.maxXp);

    this.progressBarContainer.position.y = window.innerHeight / 2 - 70;
    tooltip.position.y = -20;
    tooltip.position.x = 320;

    this.progressBarContainer.addChild(progressBar);
    this.progressBarContainer.addChild(tooltip);
    this._updateCurrentXpText(this.currentXp);

    this.progressBarContainer.progressBar = progressBar;
    this.addChild(this.progressBarContainer);

    this.progressBarContainer.startingWidth = this.progressBarContainer.width;
    this._resizeProgressBar();
  }

  /**
   * Checks all rows and columns of symbols for matches of 3 or more.
   * @param {Boolean} generating If true, returns on the first match, used for regenerating the field when the game starts.
   * @returns {Boolean}
   * @private
   */
  _checkField(generating = false) {
    let match = false;
    if (!generating && this.gameOver) return false;

    if (this._checkRows(generating)) match = true;
    if (generating && match) return match;

    if (this._checkColumns(generating)) match = true;
    if (generating && match) return match;

    if (match) {
      this.chars.forEach((char) => char.openEyesWide());

      const sound = Assets.sounds.match.play();
      Assets.sounds.match.rate(1 + 0.2 * this.combo, sound);
      if (this.combo < 5) this.combo++;

      setTimeout(() => {
        this._moveSymbolsDown();
      }, 250);
    } else {
      this.transition = false;
      this.combo = 0;
    }

    return match;
  }

  /**
   * Checks if all of the symbols in the array are of the same type.
   * @param {Symbol[]} symbolArray Array of symbols
   * @private
   * @returns {Boolean}
   */
  _areSymbolsSame(symbolArray) {
    return symbolArray.every((symbol) => {
      return symbol.type === symbolArray[0].type && !symbol.isCleared;
    });
  }

  /**
   * Animates the amount of xp from the location of the match.
   * @param {Number} xp Match xp
   * @param {Number} x X coordinate of the xp text
   * @param {Number} y Y coordinate of the xp text
   * @private
   * @returns {Promise}
   */
  async _xpTextOnMatch(xp, x, y) {
    const colorMatrix = new filters.ColorMatrixFilter();
    const text = new XpContainer(xp);

    colorMatrix.hue(230);
    text.filters = [colorMatrix];
    text.scale.set(0.3);
    text.position.x = x;
    text.position.y = y; 
    
    this.symbolContainer.addChild(text);

    gsap.fromTo(text, { alpha: 0 }, { alpha: 1 });
    await gsap.fromTo(text.position, { y: y + 20 }, { y });
    gsap.to(text, { alpha: 0 });
    gsap.to(text.position, {
      y: '-=20',
      ease: 'power1.inOut',
      onComplete: () => {
        this.symbolContainer.removeChild(text);
      }
    });
  }

  /**
   * 
   * @param {Symbol[]} symbolArray Array of symbols to check for a match
   * @param {Boolean} prevMatch The previous match, to prevent this func from resetting the match boolean
   * @param {Boolean} generating If true, returns right after if finds a match 
   * @returns {Boolean}
   * @private
   */
  _checkMatch(symbolArray, prevMatch, generating = false) {
    let match = prevMatch;

    if (this._areSymbolsSame(symbolArray)) {
      match = true;
      if (generating) return match;
      
      const length = symbolArray.length;
      const xpPos = {
        x: (symbolArray[0].position.x + symbolArray[length - 1].position.x) / 2,
        y: (symbolArray[0].position.y + symbolArray[length - 1].position.y) / 2,
      };
      const xp = 300 + ((length - 3) * 150);

      if (length > 3) this._shakeElement(this, (length - 3) * 5);
      this._xpTextOnMatch(xp, xpPos.x, xpPos.y);

      this._increaseXp(xp);
      symbolArray.forEach((symbol) => {
        symbol.clear();
      });
    }

    return match;
  }

  /**
   * Checks the rows for matches
   * @param {Boolean} generating If it's generating the symbols at the game start
   * @returns {Boolean}
   * @private
   */
  _checkRows(generating = false) {
    let match = false;
    const size = this.config.fieldSize;

    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      for (let i = 0; i < (size - 2); i++) {
        const offsetIndex = rowIndex * size;
        const startIndex = i + offsetIndex;
        const endIndex = size + offsetIndex;

        for (let start = startIndex, end = endIndex; (end - start) >= 3; end--) {
          const subRow = this.symbols.slice(start, end);

          match = this._checkMatch(subRow, match, generating);
          if (generating && match) return match;
        }
      }
    }

    return match;
  }

  /**
   * Checks the columns for matches.
   * @param {Boolean} generating If it's generating the symbols at the game start, returns on the first match
   * @returns {Boolean}
   * @private
   */
  _checkColumns(generating = false) {
    let match = false;
    const size = this.config.fieldSize;

    for (let colIndex = 0; colIndex < size; colIndex++) {
      const column = [];

      for (let i = 0; i < size * size; i += size) {
        column.push(this.symbols[i + colIndex]);
      }
      
      for (let i = 0; i < (size - 2); i++) { 
        for (let start = i, end = size; (end - start) >= 3; end--) {
          const subColumn = column.slice(start, end);

          match = this._checkMatch(subColumn, match, generating);
          if (generating && match) return match;
        }
      }
    }

    return match;
  }

  /**
   * Updates the progress bar with the current amount of xp.
   * @private
   */
  _updateProgressBar() {
    this.progressBarContainer.progressBar.updateProgress(this.currentXp, this.config.maxXp);
  }

  /**
   * Increase current xp, checks if the player has reached the max amount of needed xp.
   * @param {Number} bonusXp Amount of xp to increase with
   * @private
   */
  _increaseXp(bonusXp) {
    this.currentXp += bonusXp;
    this._updateCurrentXpText(this.currentXp);
    this._updateProgressBar();

    if (this.currentXp >= this.config.maxXp) {
      this._sceneTransition(config.events.WIN);
    }
  }

  /**
   * Transitions the scene to either the game win or lose scene.
   * @param {String} event the event to emit
   * @private
   */
  _sceneTransition(event) {
    this.gameOver = true;
    this.transition = true;

    const elements = [
      this.symbolContainer,
      this.charContainer,
      this.movesContainer,
      this.progressBarContainer
    ];

    this.blinkIntervals.forEach((interval) => clearInterval(interval));

    setTimeout(async () => {
      if (this.chars) {
        this.chars.forEach((char) => {
          char.unfollowMouse();
        });
      }

      await gsap.to(elements, { alpha: 0, duration: 0.3 });
      this.emit(event);
    }, 1500);
  }

  /**
   * Decrements the current moves, updates the moves number and checks if the player is out of moves.
   * @private
   */
  _decrementMoves() {
    this.movesContainer.updateMoves(--this.currentMoves);

    if (this.currentMoves === 0 && (this.currentXp < this.config.maxXp)) {
      this._sceneTransition(config.events.LOSE);
    }
  }

  /**
   * Generates new symbols for each column and smoothly animates the fall.
   * @param {Number[]} symbolsToGenerate array containing the amount of new symbols each column need
   * @private
   * @returns {Promise}
   */
  async _generateNewSymbols(symbolsToGenerate) {
    const size = this.config.fieldSize;
    const fallDuration = 1;
    let tween = null;

    for (let col = 0; col < symbolsToGenerate.length; col++) {
      const cleared = symbolsToGenerate[col];

      for (let i = cleared - 1; i >= 0; i--) {
        const index = col + size * i;
        const oldSymbol = this.symbols[index];
        const newSymbol = this._getNewSymbol(index);
  
        newSymbol.position.x = col * this.config.symbolSize;
  
        const posY = i * this.config.symbolSize;
  
        this.transition = true;
  
        tween = gsap.fromTo(newSymbol.position, {
          y: posY - window.innerHeight / 2,
        }, {
          y: posY,
          ease: 'power1.out',
          duration: fallDuration,
        });
  
        this.symbols[index] = newSymbol;
  
        this.symbolContainer.removeChild(oldSymbol);
        this.symbolContainer.addChild(newSymbol);
      }
    }

    await tween;
    this._checkField();
  }

  /**
   * Moves the symbols down smoothly
   * @private
   */
  _moveSymbolsDown() {
    const size = this.config.fieldSize;
    const fallingDuration = 0.7;
    const symbolsToGenerate = [];

    for (let i = size * size - size; i < size * size; i++) {
      let clearedSymbols = 0;

      for (let j = i; j >= 0; j -= size) {
        if (this.symbols[j].isCleared) {
          clearedSymbols++;
          continue;
        }

        if (!clearedSymbols) continue;
        this.transition = true;

        gsap.to(this.symbols[j].position, {
          y: `+=${clearedSymbols * this.config.symbolSize}`,
          ease: 'bounce',
          duration: fallingDuration,
        });

        const newIndex = j + clearedSymbols * this.config.fieldSize;
        this._swapSymbolsInArray(newIndex, j);
      }
      symbolsToGenerate.push(clearedSymbols);
    }
    this._generateNewSymbols(symbolsToGenerate);
  }

  /**
   * Swaps two symbols in the symbols array and updates their indices.
   * @param {Number} firstIndex index of the first symbol
   * @param {Number} secondIndex index of the second symbol
   * @private
   */
  _swapSymbolsInArray(firstIndex, secondIndex) {
    const tempSymbol = this.symbols[firstIndex];

    this.symbols[firstIndex] = this.symbols[secondIndex];
    this.symbols[firstIndex].updateIndex(firstIndex);
    this.symbols[secondIndex] = tempSymbol;
    this.symbols[secondIndex].updateIndex(secondIndex);
  }

  /**
   * Called on a pointerup event, swaps symbols if possible
   * @param {Symbol} symbol symbol element
   * @private
   */
  async _symbolOnPointerUp(symbol) {
    if (this.draggedSymbol === null || this.transition) return;

    gsap.to(this.draggedSymbol.scale, {
      x: 1,
      y: 1,
      duration: 0.05,
      ease: 'linear',
    });

    if (this.draggedSymbol.id === symbol.id) return;

    const moved = await this._moveSymbols(this.draggedSymbol, symbol);
    if (!moved) {
      this.transition = false;

      return;
    };

    const match = this._checkField();

    if (!match) {
      await this._moveSymbols(this.draggedSymbol, symbol);
      this.transition = false;
    } else {
      window.navigator.vibrate(200);
      this._decrementMoves();
    }
    
    this.draggedSymbol = null;
  }

  /**
   * Shakes an element horizontally.
   * @param {(PIXI.Container|PIXI.Sprite)} element element to shake
   * @param {Number=} amount shake amount
   * @private
   */
  async _shakeElement(element, amount = 5) {
    const startingPos = element.position.x;

    await gsap.fromTo(element.position, {
      x: startingPos - amount,
    }, {
      x: startingPos + amount,
      yoyo: true,
      repeat: 2,
      duration: 0.05,
      ease: 'linear'
    });

    gsap.to(element.position, {
      x: startingPos,
      duration: 0.05,
    });
  }

  /**
   * Swaps two symbols if possible.
   * @param {Symbol} symbol1 first symbol
   * @param {Symbol} symbol2 second symbol
   * @private
   * @returns {Boolean}
   */
  async _moveSymbols(symbol1, symbol2) {
    this.transition = true;

    const symbol1Coords = {
      x: symbol1.id % this.config.fieldSize,
      y: Math.floor(symbol1.id / this.config.fieldSize),
    };
    
    const symbol2Coords = {
      x: symbol2.id % this.config.fieldSize,
      y: Math.floor(symbol2.id / this.config.fieldSize),
    };

    if (this.config.adjacentOnly) {
      if (
        !((symbol1Coords.x === symbol2Coords.x
						&& (symbol1Coords.y === symbol2Coords.y - 1
							|| symbol1Coords.y === symbol2Coords.y + 1))
					|| (symbol1Coords.y === symbol2Coords.y
						&& (symbol1Coords.x === symbol2Coords.x - 1
							|| symbol1Coords.x === symbol2Coords.x + 1)))
      ) {
        this._shakeElement(symbol1);

        return false;
      }
    }

    this._swapSymbolsInArray(symbol1.id, symbol2.id);
    const ease = 'power1.inOut';

    gsap.to(symbol1.position, {
      x: this.config.symbolSize * (symbol1.id % this.config.fieldSize), // symbol2.position.x,
      y: this.config.symbolSize * (Math.floor(symbol1.id / this.config.fieldSize)), // symbol2.position.y,
      duration: 0.3,
      ease,
    });

    await gsap.to(symbol2.position, {
      x: this.config.symbolSize * (symbol2.id % this.config.fieldSize), // symbol2.position.x,
      y: this.config.symbolSize * (Math.floor(symbol2.id / this.config.fieldSize)), // symbol2.position.y,
      duration: 0.3,
      ease,
    });

    return true;
  } 

  /**
   * Called on pointer down, scales the symbol down and sets the dragged symbol
   * @param {Symbol} symbol 
   * @private
   */
  _symbolOnPointerDown(symbol) {
    if (this.transition) return;

    this.draggedSymbol = symbol;
    gsap.to(this.draggedSymbol.scale, {
      x: 0.8,
      y: 0.8,
      duration: 0.05,
      ease: 'linear',
    });
  }

  /**
   * Gets a new symbol of a random type
   * @param {Number} index the index in the array of new symbol
   * @private
   * @returns {Symbol}
   */
  _getNewSymbol(index) {
    const symbolType = Math.floor(Math.random() * this.config.typesOfSymbols + 1);
    const symbol = new Symbol(symbolType, index);

    symbol.on('pointerdown', () => {
      this._symbolOnPointerDown(symbol);
    });
    symbol.on('pointerup', () => {
      this._symbolOnPointerUp(symbol);
    });
    symbol.on('pointerupoutside', () => {
      this._symbolOnPointerUpOutside();
    });

    symbol.on('pointerover', () => {
      if (this.transition) return;
      gsap.to(symbol, {
        alpha: 0.8,
        duration: 0,
      });
    });

    symbol.on('pointerout', () => {
      gsap.to(symbol, {
        alpha: 1,
        duration: 0,
      });
    });

    return symbol;
  }

  /**
   * Generates the symbols field. Keeps generating until there are no matches.
   * @private
   */
  _generateNewField() {
    if (this.symbolContainer) this.removeChild(this.symbolContainer);
    
    do {
      this.symbolContainer = new Container();
      this.symbols = [];
  
      for (let i = 0; i < this.config.fieldSize * this.config.fieldSize; i++) {
        const symbol = this._getNewSymbol(i);
  
        symbol.position.x = this.config.symbolSize * (i % this.config.fieldSize);
        symbol.position.y = this.config.symbolSize * (Math.floor(i / this.config.fieldSize));
        this.symbolContainer.addChild(symbol);
  
        this.symbols.push(symbol);
      }
    } while (this._checkField(true));
    
    this.addChild(this.symbolContainer);
  }

  /**
   * Generates the new field and resizes it.
   * @private
   */
  _addSymbolContainer() {
    this._generateNewField();
    this._resizeField();
  }

  /**
   * Adds the Moves container to the scene
   * @private
   * @returns {Moves}
   */
  _addMoves() {
    const movesContainer = new Moves(this.currentMoves);
    movesContainer.position.y = -window.innerHeight / 2 + 60;

    this.addChild(movesContainer);

    return movesContainer;
  }

  /**
   * Adds the characters to the scene.
   * @private
   * @returns {PIXI.Container}
   */
  _addCharacters() {
    const charContainer = new Container();
    this.chars = [
      new Character(),
      new Character(),
    ];

    this.chars[0].scale.set(0.4);
    this.chars[0].position.x = 400;
    this.chars[0].position.y = -200;

    this.chars[1].position.x = -500;
    this.chars[1].position.y = 50;

    this.chars[0].hover('+=30', 4).followMouse();
    this.chars[1].hover('+=50', 3).followMouse();

    this.blinkIntervals = [];

    for (const char of this.chars) {
      let blinkIntervalSeconds =  Math.random() * 5 + 5;

      const interval = setInterval(() => {
        char.blink();
        blinkIntervalSeconds = Math.random() * 3 + 5;
      }, blinkIntervalSeconds * 1000);

      this.blinkIntervals.push(interval);
    }

    charContainer.addChild(...this.chars);
    this.addChild(charContainer);

    return charContainer;
  }

  /**
   * Resizes the symbols field to fit the screen.
   * @private
   */
  _resizeField() {
    const defaultFieldWidth = (this.config.symbolSize * this.config.fieldSize);
    const scaleRatio = (window.innerHeight * 60 / 100) / defaultFieldWidth;
    const scaleRatioWidth = (window.innerWidth * 95 / 100) / defaultFieldWidth;
    const smallerRatio = scaleRatio < scaleRatioWidth ? scaleRatio : scaleRatioWidth;
    this.symbolContainer.scale.set(smallerRatio);
    const fieldWidth = this.symbolContainer.width;
    this.symbolContainer.position.y = -fieldWidth / 2 + (fieldWidth / (this.config.fieldSize * 2));
    this.symbolContainer.position.x = -fieldWidth / 2 + (fieldWidth / (this.config.fieldSize * 2));
  }

  /**
   * Resizes the progress bar to fit the screen.
   * @private
   */
  _resizeProgressBar() {
    this.progressBarContainer.position.y = window.innerHeight / 2 - 70;
    const progresBarWidth = this.progressBarContainer.startingWidth + 90;

    if (progresBarWidth > window.innerWidth) {
      this.progressBarContainer.scale.set(window.innerWidth / progresBarWidth);
      this.progressBarContainer.position.x = -20;
    } else {
      this.progressBarContainer.scale.set(1);
      this.progressBarContainer.position.x = 0;
    }
  }

  /**
   * Hook called by the application when the browser window is resized.
   * @param  {Number} width  Window width
   * @param  {Number} height Window height
   */
  onResize(width, height) { // eslint-disable-line no-unused-vars
    this.movesContainer.position.y = -height / 2 + 60;
    this._resizeProgressBar();
    this._resizeField();
  }
}
