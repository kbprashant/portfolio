/**
 * obstacles.js
 * Plain entity classes for pipes, coins, and background clouds.
 * Each knows how to update its own position/state; drawing is delegated
 * to renderer.js. Spawning logic lives in spawner.js.
 */
(function (MarioGame) {
  const CONFIG = MarioGame.CONFIG;

  class Pipe {
    constructor(x, height) {
      this.x = x;
      this.height = height;
      this.passed = false;
    }

    update(speed) {
      this.x -= speed;
    }

    get isOffscreen() {
      return this.x + CONFIG.PIPE.WIDTH < 0;
    }

    /** Bounding box for collision (includes the wider pipe head). */
    get bounds() {
      const { WIDTH, HEAD_HEIGHT } = CONFIG.PIPE;
      return {
        x: this.x,
        y: CONFIG.WORLD_HEIGHT - CONFIG.GROUND_OFFSET - this.height - HEAD_HEIGHT,
        width: WIDTH,
        height: this.height + HEAD_HEIGHT,
      };
    }
  }

  class Coin {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.alive = true;
      this.anim = 0;
    }

    update(speed) {
      this.x -= speed;
      this.anim++;
    }

    get isOffscreen() {
      return this.x + CONFIG.COIN.SIZE < 0;
    }

    get bounds() {
      return { x: this.x + 2, y: this.y + 2, width: CONFIG.COIN.SIZE - 4, height: CONFIG.COIN.SIZE - 4 };
    }
  }

  class Cloud {
    constructor(x, y, width) {
      this.x = x;
      this.y = y;
      this.width = width;
    }

    update(speed) {
      this.x -= speed * 0.2; // parallax: clouds drift slower than foreground
      if (this.x + this.width < 0) {
        this.x = CONFIG.WORLD_WIDTH + 50;
      }
    }
  }

  MarioGame.Pipe = Pipe;
  MarioGame.Coin = Coin;
  MarioGame.Cloud = Cloud;
})(window.MarioGame = window.MarioGame || {});
