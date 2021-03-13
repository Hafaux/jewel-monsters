import { Container, filters } from 'pixi.js';
import Scene from './Scene';
import gsap from 'gsap';
import Fire from '../components/Fire';
import Character from '../components/Character';
import Moves from '../components/Moves';
import Symbol from '../components/Symbol';
import ProgressBar from '../components/ProgressBar';
import XpContainer from '../components/XpContainer';
import Tooltip from '../components/Tooltip';

export default class Play extends Scene {
  async onCreated() {
    this.draggedSymbol = null;
    this.transition = false;
    this.symbols = [];
    this.config = {
      typesOfSymbols: 6,
      symbolSize: 100,
      fieldSize: 6,
      maxMoves: 20,
      maxXp: 2000,
    };
    this.currentMoves = this.config.maxMoves;
    this.currentXp = 0;

    this.fireContainer = this._addFire();
    this.charContaienr = this._addCharacters();
    this.movesContainer = this._addMoves();
    this.progressBar = this._addProgressBar();
    this.xpContainer = null;
    this.symbolContainer = null;
    this._addSymbolContainer();
    this._updateCurrentXpText(this.currentXp);

    window.addEventListener('pointerup', () => {
      if (this.draggedSymbol === null) return;

      this.draggedSymbol.sprite.alpha = 1;
      this.draggedSymbol.scale.set(1);
    });
  }

  _updateCurrentXpText(xp) {
    if (this.xpContainer !== null) {
      this.xpContainer.updateXp(xp);
    } else {
      this.xpContainer = new XpContainer(xp);
  
      this.xpContainer.position.y = window.innerHeight / 2 - 120;
      this.xpContainer.scale.set(0.3);
  
      this.addChild(this.xpContainer);
    }
  }

  _addProgressBar() {
    const progressBar = new ProgressBar();
    const tooltip = new Tooltip(this.config.maxXp);

    progressBar.position.y = window.innerHeight / 2 - 70;
    tooltip.position.y = window.innerHeight / 2 - 90;
    tooltip.position.x = 320;

    this.addChild(progressBar);
    this.addChild(tooltip);

    return progressBar;
  }

  _checkField(generating = false) {
    let match = false;
    
    if (this._checkRow(generating)) match = true;
    if (generating && match) return match;

    if (this._checkColumn(generating)) match = true;
    if (generating && match) return match;

    if (match) {
      setTimeout(() => {
        this._moveSymbolsDown();
      }, 250);
    } else {
      this.transition = false;
    }

    return match;
  }

  _areSymbolsSame(symbolArray) {
    return symbolArray.every((symbol) => {
      return symbol.type === symbolArray[0].type && !symbol.isCleared;
    });
  }

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

      this._xpTextOnMatch(xp, xpPos.x, xpPos.y);

      this._increaseXp(xp);
      symbolArray.forEach((symbol) => {
        symbol.clear();
      });
    }

    return match;
  }

  _checkRow(generating = false) {
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

  _checkColumn(generating = false) {
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

  _checkThreeRow() {
    let match = false;

    for (let i = 0; i < this.symbols.length; i++) {
      if ((i % this.config.fieldSize) + 2 >= this.config.fieldSize) continue;

      const arr = [this.symbols[i], this.symbols[i + 1], this.symbols[i + 2]];

      if (arr.every((val) => val.type === this.symbols[i].type && !val.isCleared)) {
        match = true;
        // this._increaseXp();
        arr.forEach((symbol) => {
          symbol.clear();
        });
      }
    }

    return match;
  }

  _increaseXp(bonusXp) {
    this.currentXp += bonusXp;
    this._updateCurrentXpText(this.currentXp);
    this.progressBar.updateProgress(this.currentXp, this.config.maxXp);
  }

  _decrementMoves() {
    this.movesContainer.updateMoves(--this.currentMoves);
  }

  async __generateNewSymbols(symbolsToGenerate) {
    const size = this.config.fieldSize;
    const fallDuration = 1;
    let tween = null;

    for (let col = 0; col < symbolsToGenerate.length; col++) {
      const cleared = symbolsToGenerate[col];

      for (let i = cleared - 1; i >= 0; i--) {
        const index = col + size * i;
        const oldSymbol = this.symbols[index];
        const newSymbol = this._getRandomSymbol(index);
  
        newSymbol.position.x = col * this.config.symbolSize;
  
        const posY = i * this.config.symbolSize;
  
        this.transition = true;
  
        tween = gsap.fromTo(newSymbol.position, {
          y: posY - 500,
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
    this.__generateNewSymbols(symbolsToGenerate);
  }

  _swapSymbolsInArray(firstIndex, secondIndex) {
    const tempSymbol = this.symbols[firstIndex];

    this.symbols[firstIndex] = this.symbols[secondIndex];
    this.symbols[firstIndex].updateIndex(firstIndex);
    this.symbols[secondIndex] = tempSymbol;
    this.symbols[secondIndex].updateIndex(secondIndex);
  }

  async _onPointerUp(symbol) {
    if (this.draggedSymbol === null || this.transition) return;

    this.draggedSymbol.sprite.alpha = 1;
    this.draggedSymbol.scale.set(1);

    if (this.draggedSymbol.id === symbol.id) return;

    await this._moveSymbols(this.draggedSymbol, symbol);
    this.transition = true;
    const match = this._checkField();

    if (!match) {
      this._moveSymbols(this.draggedSymbol, symbol, 'power1.inOut');
    } else {
      this.transition = false;
      this._decrementMoves();
    }

    this.draggedSymbol = null;
  }

  async _moveSymbols(symbol1, symbol2, ease = 'power1.inOut') {
    this.transition = true;

    const tempPos = {
      x: symbol1.position.x,
      y: symbol1.position.y,
    };

    const tempId = symbol1.id;

    [this.symbols[symbol1.id], this.symbols[symbol2.id]] 
      = [this.symbols[symbol2.id], this.symbols[symbol1.id]];

    symbol1.updateIndex(symbol2.id);
    symbol2.updateIndex(tempId);

    gsap.to(symbol1.position, {
      x: symbol2.position.x,
      y: symbol2.position.y,
      duration: 0.3,
      ease,
    });

    await gsap.to(symbol2.position, {
      x: tempPos.x,
      y: tempPos.y,
      duration: 0.3,
      ease,
    });

    this.transition = false;
  } 

  _onPointerDown(symbol) {
    if (this.transition) return;

    this.draggedSymbol = symbol;
    this.draggedSymbol.sprite.alpha = 0.8;
    this.draggedSymbol.scale.set(0.8);
  }

  _getRandomSymbol(index) {
    const symbolType = Math.floor(Math.random() * this.config.typesOfSymbols + 1);
    // const symbolType = Math.floor(Math.random() * 3 + 1);

    const symbol = new Symbol(symbolType, index);

    symbol.on('pointerdown', () => {
      this._onPointerDown(symbol);
    });
    symbol.on('pointerup', () => {
      this._onPointerUp(symbol);
    });

    return symbol;
  }

  _generateNewField() {
    const symbolContainer = new Container();
    this.symbols = [];

    for (let i = 0; i < this.config.fieldSize * this.config.fieldSize; i++) {
      const symbol = this._getRandomSymbol(i);

      symbol.position.x = this.config.symbolSize * (i % this.config.fieldSize);
      symbol.position.y = this.config.symbolSize * (Math.floor(i / this.config.fieldSize));
      symbolContainer.addChild(symbol);

      this.symbols.push(symbol);
    }

    return symbolContainer;
  }

  _addSymbolContainer() {
    do {
      this.symbolContainer = this._generateNewField();
    } while (this._checkField(true));

    this.addChild(this.symbolContainer);
    this._resizeField();
  }

  _addMoves() {
    const movesContainer = new Moves(20);
    movesContainer.position.y = -window.innerHeight / 2 + 60;

    this.addChild(movesContainer);

    return movesContainer;
  }

  _addFire() {
    const fireContainer = new Container();
    const fire1 = new Fire();
    const fire2 = new Fire();
    const offsetY = 110;
    const offsetX = 680;

    fire1.position.x = -offsetX;
    fire1.position.y = offsetY;
    fire2.position.x = offsetX + 40;
    fire2.position.y = offsetY;

    fireContainer.addChild(fire1, fire2);
    this.addChild(fireContainer);

    return fireContainer;
  }

  _addCharacters() {
    const charContainer = new Container();
    const char1 = new Character();
    const char2 = new Character();

    char1.scale.set(0.4);
    char1.position.x = 400;
    char1.position.y = -200;

    char2.position.x = -500;
    char2.position.y = 50;

    gsap.to([char1.position, char2.position], {
      y: '+=40',
      repeat: -1,
      yoyo: true,
      duration: 3,
      ease: 'power1.inOut',
    });

    charContainer.addChild(char1, char2);
    this.addChild(charContainer);

    return charContainer;
  }

  _resizeField() {
    const defaultFieldWidth = (this.config.symbolSize * this.config.fieldSize);
    const scaleRatio = (window.innerHeight * 60 / 100) / defaultFieldWidth;
    this.symbolContainer.scale.set(scaleRatio);
    const fieldWidth = this.symbolContainer.width;
    this.symbolContainer.position.y = -fieldWidth / 2 + (fieldWidth / (this.config.fieldSize * 2));
    this.symbolContainer.position.x = -fieldWidth / 2 + (fieldWidth / (this.config.fieldSize * 2));
  }

  /**
   * Hook called by the application when the browser window is resized.
   * Use this to re-arrange the game elements according to the window size
   *
   * @param  {Number} width  Window width
   * @param  {Number} height Window height
   */
  onResize(width, height) { // eslint-disable-line no-unused-vars
    this.movesContainer.position.y = -height / 2 + 60;
    this.xpContainer.position.y = height / 2 - 120;
    this.progressBar.position.y = height / 2 - 70;
    this._resizeField();
  }
}
