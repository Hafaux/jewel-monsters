/* eslint-disable */
/// <reference types="cypress" />

context('Actions', () => {
  it('should load', () => {
    cy.visit('/');
    cy.getPixiApp().then((app) => {
      expect(app).to.exist;
    });
  });

  it('should have a Play scene', () => {
    const element = 'play scene';

    cy.getPixiStage().getPixiElementByName(element)
      .then((element) => {
        expect(element).to.exist;
      });
  });

  it('when a symbol is moved on a valid position a connection should be made', () => {
    const element = 'symbolContainer';

    cy.getPixiStage().getPixiElementByName(element)
      .then((symbolsContainer) => {
        expect(symbolsContainer).to.exist;

        const symbols = [...symbolsContainer.children];
        const fieldSize = symbolsContainer.fieldSize;

        cy.wait(500).then(() => {
          expect(
            findMatchRows(symbols, fieldSize) 
            || findMatchCols(symbols, fieldSize)
          ).to.be.true;
        });
      }
      );
  });
});

// sorry for the ugly code 
//  😳
// 👉👈  
/**
 * Searches every row to find a possible match
 * @param {Symbol[]} symbols symbols array 
 * @param {Number} fieldSize row and column length
 * @returns {Boolean}
 */
function findMatchRows(symbols, fieldSize) {
  for (let y = 0; y < fieldSize; y++) {
    for (let x = 0; x < fieldSize - 1; x++) {
      const index = y * fieldSize + x;
      const [symbol1, symbol2] = [symbols[index], symbols[index + 1]];
      const symbol3 = x < fieldSize - 2 ? symbols[index + 2] : null;
      const predicate = (symbol) => symbol.type === symbols[index].type;
      let searchSymbol = null;

      // X X Y | Y X X
      if (symbol1.type === symbol2.type) {
        const offset = x > 0 ? -1 : 0;

        if (x > 0) symbols[index - 1].emit('pointerdown');
        else symbols[index + 2].emit('pointerdown');

        searchSymbol = symbols.slice(0, index + offset).find(predicate) 
          || symbols.slice(index + 3 + offset, fieldSize * fieldSize).find(predicate);
      // X Y X
      } else if (symbol3 && symbol1.type === symbol3.type) {
        symbol2.emit('pointerdown');

        searchSymbol = symbols.slice(0, index).find(predicate) 
          || symbols.slice(index + 3, fieldSize * fieldSize).find(predicate);
      }

      if (searchSymbol) {
        searchSymbol.emit('pointerup');

        cy.wait(1000).then(() => {
          expect(searchSymbol.isCleared).to.be.true;
        });

        return true;
      }
    }
  }

  return false;
}

/**
 * Searches every column to find a possible match
 * @param {Symbol[]} symbols symbols array 
 * @param {Number} fieldSize row and column length
 * @returns {Boolean}
 */
function findMatchCols(symbols, fieldSize) {
  for (let y = 0; y < fieldSize - 1; y++) {
    for (let x = 0; x < fieldSize; x++) {
      const index = y * fieldSize + x;
      const [symbol1, symbol2] = [symbols[index], symbols[index + fieldSize]];
      const predicate = (symbol) => symbol.type === symbols[index].type;

      if (symbol1.type === symbol2.type) {

        if (y > 0) symbols[index - fieldSize].emit('pointerdown');
        else symbols[index + fieldSize * 2].emit('pointerdown');

        const searchSymbol = symbols.filter((s, i) => {
          return i !== index && i !== index + fieldSize;
        }).find(predicate);

        if (searchSymbol) {
          searchSymbol.emit('pointerup');

          cy.wait(1000).then(() => {
            expect(searchSymbol.isCleared).to.be.true;
          });

          return true;
        }
      }
    }
  }

  return false;
}