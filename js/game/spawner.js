/**
 * spawner.js
 * Encapsulates spawn-timing decisions so engine.js doesn't need to know
 * the randomization rules for pipes/coins. Pure logic, no rendering.
 */
(function (MarioGame) {
  const CONFIG = MarioGame.CONFIG;

  class Spawner {
    constructor() {
      this._framesSinceLastPipe = 0;
      this._nextGap = this._randomGap();
    }

    _randomGap() {
      const { MIN_GAP_FRAMES, MAX_GAP_FRAMES } = CONFIG.PIPE;
      return MIN_GAP_FRAMES + Math.random() * (MAX_GAP_FRAMES - MIN_GAP_FRAMES);
    }

    reset() {
      this._framesSinceLastPipe = 0;
      this._nextGap = this._randomGap();
    }

    /**
     * Advances spawn timers by one frame and returns any newly created
     * entities this frame (usually none, occasionally a pipe + maybe a coin).
     * @returns {{ pipes: object[], coins: object[] }}
     */
    tick() {
      this._framesSinceLastPipe++;
      const pipes = [];
      const coins = [];

      if (this._framesSinceLastPipe > this._nextGap) {
        const height = CONFIG.PIPE.MIN_HEIGHT + Math.random() * (CONFIG.PIPE.MAX_HEIGHT - CONFIG.PIPE.MIN_HEIGHT);
        const pipe = new MarioGame.Pipe(CONFIG.WORLD_WIDTH + 50, height);
        pipes.push(pipe);

        if (Math.random() < CONFIG.COIN.SPAWN_CHANCE) {
          const coinX = pipe.x + 10;
          const coinY = CONFIG.WORLD_HEIGHT - CONFIG.GROUND_OFFSET - pipe.height - 40;
          coins.push(new MarioGame.Coin(coinX, coinY));
        }

        this._framesSinceLastPipe = 0;
        this._nextGap = this._randomGap();
      }

      return { pipes, coins };
    }

    /** Used to seed the very first obstacle so the game isn't empty at start. */
    static initialPipe() {
      const height = CONFIG.PIPE.MIN_HEIGHT + Math.random() * (CONFIG.PIPE.MAX_HEIGHT - CONFIG.PIPE.MIN_HEIGHT);
      return new MarioGame.Pipe(CONFIG.WORLD_WIDTH + 200, height);
    }
  }

  MarioGame.Spawner = Spawner;
})(window.MarioGame = window.MarioGame || {});
