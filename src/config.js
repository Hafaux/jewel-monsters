export default {
  view: {
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xffffff,
    worldWidth: 1000,
    worldHeight: 500,
    resizeTo: window,
    centerOnResize: true,
  },
  game: {
    width: 1000,
    height: 500,
    drag: false,
    pinch: true,
    decelerate: true,
    wheel: false,
  },
  sprites: {
    fire1Pos: {
      x: -680,
      y: 110,
    },
    fire2Pos: {
      x: 720,
      y: 110
    }
  },
  scenes: {
    Loading: {
      hideDelay: 0,
    },
    Play: {
      fieldSize: 6,
      maxXp: 5000,
      maxMoves: 20,
      adjacentOnly: false,
    }
  },
  assets: {
    root: '/',
  },
  events: {
    LOSE: 'game_lose',
    WIN: 'game_win',
    RESTART: 'game_restart',
  }
};
