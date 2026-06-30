/**
 * engine.js
 * The composition root for the game loop. Wires together entities,
 * spawner, collision, score store, renderer, and HUD — but contains no
 * drawing code and no DOM queries itself (those are injected). This is
 * the only module that knows the full game lifecycle (start → playing →
 * game over → retry).
 */
(function (MarioGame) {
  const CONFIG = MarioGame.CONFIG;

  class GameEngine {
    /**
     * @param {{
     *   canvasManager: InstanceType<typeof MarioGame.CanvasManager>,
     *   hudRefs: { scoreEl: HTMLElement, livesEl: HTMLElement, hiEl: HTMLElement }
     * }} deps
     */
    constructor({ canvasManager, hudRefs }) {
      this.canvasManager = canvasManager;
      this.renderer = new MarioGame.Renderer(canvasManager.ctx);
      this.hud = new MarioGame.Hud(hudRefs);
      this.scoreStore = new MarioGame.ScoreStore();
      this.mario = new MarioGame.Mario();
      this.spawner = new MarioGame.Spawner();

      this.pipes = [MarioGame.Spawner.initialPipe()];
      this.coins = [];
      this.clouds = this._createClouds();

      this.frame = 0;
      this.speed = CONFIG.SPEED.BASE;
      this.started = false;
      this.over = false;

      this.input = new MarioGame.InputController(canvasManager.canvas, () => this._handleAction());

      this.hud.update({ score: 0, lives: this.scoreStore.lives, highScore: this.scoreStore.highScore });

      this._loop = this._loop.bind(this);
    }

    _createClouds() {
      const clouds = [];
      for (let i = 0; i < CONFIG.CLOUD_COUNT; i++) {
        clouds.push(new MarioGame.Cloud(100 + i * 250, 20 + Math.random() * 30, 80 + Math.random() * 40));
      }
      return clouds;
    }

    start() {
      requestAnimationFrame(this._loop);
    }

    _handleAction() {
      if (!this.started) {
        this.started = true;
        return;
      }
      if (this.over) {
        this._resetRound();
        return;
      }
      this.mario.jump();
    }

    _resetRound() {
      this.mario.reset();
      this.spawner.reset();
      this.pipes = [MarioGame.Spawner.initialPipe()];
      this.coins = [];
      this.scoreStore.reset();
      this.frame = 0;
      this.speed = CONFIG.SPEED.BASE;
      this.over = false;
      this.hud.update({ score: 0, lives: this.scoreStore.lives, highScore: this.scoreStore.highScore });
    }

    _updateSpeed() {
      const ramp = Math.floor(this.scoreStore.score / CONFIG.SPEED.RAMP_SCORE_INTERVAL) * CONFIG.SPEED.RAMP_INCREMENT;
      this.speed = Math.min(CONFIG.SPEED.BASE + ramp, CONFIG.SPEED.MAX);
    }

    _registerHit() {
      this.mario.takeHit();
      const gameOver = this.scoreStore.loseLife();
      if (gameOver) {
        this.over = true;
        this.scoreStore.commitHighScoreIfNeeded();
      }
      this.hud.update({
        score: this.scoreStore.score,
        lives: this.scoreStore.lives,
        highScore: this.scoreStore.highScore,
      });
    }

    _update() {
      if (!this.started || this.over) return;
      this.frame++;
      this._updateSpeed();

      this.mario.update();

      for (const cloud of this.clouds) cloud.update(this.speed);

      // Spawn new entities
      const spawned = this.spawner.tick();
      this.pipes.push(...spawned.pipes);
      this.coins.push(...spawned.coins);

      // Pipes: move, score-on-pass, collide, cull offscreen
      for (let i = this.pipes.length - 1; i >= 0; i--) {
        const pipe = this.pipes[i];
        pipe.update(this.speed);

        if (!pipe.passed && pipe.x + CONFIG.PIPE.WIDTH < this.mario.x) {
          pipe.passed = true;
          this.scoreStore.addScore(CONFIG.SCORING.PIPE_CLEAR_BONUS);
        }

        if (!this.mario.isInvincible && MarioGame.intersects(this.mario.hitbox, pipe.bounds)) {
          this._registerHit();
        }

        if (pipe.isOffscreen) this.pipes.splice(i, 1);
      }

      // Coins: move, collect, cull offscreen
      for (let i = this.coins.length - 1; i >= 0; i--) {
        const coin = this.coins[i];
        coin.update(this.speed);

        if (coin.alive && MarioGame.intersects(this.mario.hitbox, coin.bounds)) {
          coin.alive = false;
          this.scoreStore.addScore(CONFIG.COIN.VALUE);
        }

        if (coin.isOffscreen) this.coins.splice(i, 1);
      }

      // Survival score tick
      if (this.frame % CONFIG.SCORING.TICK_INTERVAL_FRAMES === 0) {
        this.scoreStore.addScore(1);
      }

      this.hud.update({
        score: this.scoreStore.score,
        lives: this.scoreStore.lives,
        highScore: this.scoreStore.highScore,
      });
    }

    _draw() {
      const r = this.renderer;
      r.clear();
      for (const cloud of this.clouds) r.drawCloud(cloud);
      r.drawGround();
      for (const pipe of this.pipes) r.drawPipe(pipe);
      for (const coin of this.coins) r.drawCoin(coin);
      r.drawMario(this.mario);
      r.drawHUD(this.scoreStore.score, this.scoreStore.highScore);

      if (!this.started) r.drawStartOverlay();
      if (this.over) r.drawGameOverOverlay(this.scoreStore.score);
    }

    _loop() {
      this._update();
      this._draw();
      requestAnimationFrame(this._loop);
    }

    destroy() {
      this.input.destroy();
      this.canvasManager.destroy();
    }
  }

  MarioGame.GameEngine = GameEngine;
})(window.MarioGame = window.MarioGame || {});
