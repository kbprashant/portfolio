/**
 * mario.js
 * The player entity. Holds physics state only — no canvas/DOM access.
 * Rendering is handled separately by renderer.js (single-responsibility:
 * entities describe *what* they are, the renderer decides *how* to draw them).
 */
(function (MarioGame) {
  const CONFIG = MarioGame.CONFIG;

  class Mario {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = CONFIG.MARIO.START_X;
      this.width = CONFIG.MARIO.WIDTH;
      this.height = CONFIG.MARIO.HEIGHT;
      this.y = this._groundY();
      this.vy = 0;
      this.jumpsUsed = 0;
      this.walkFrame = 0;
      this.invincibleFrames = 0;
    }

    _groundY() {
      return CONFIG.WORLD_HEIGHT - CONFIG.GROUND_OFFSET - this.height;
    }

    jump() {
      if (this.jumpsUsed < CONFIG.PHYSICS.MAX_JUMPS) {
        this.vy = CONFIG.PHYSICS.JUMP_VELOCITY;
        this.jumpsUsed++;
      }
    }

    update() {
      this.vy += CONFIG.PHYSICS.GRAVITY;
      this.y += this.vy;

      const groundY = this._groundY();
      if (this.y >= groundY) {
        this.y = groundY;
        this.vy = 0;
        this.jumpsUsed = 0;
      }

      this.walkFrame++;
      if (this.invincibleFrames > 0) this.invincibleFrames--;
    }

    takeHit() {
      this.invincibleFrames = CONFIG.PLAYER.INVINCIBILITY_FRAMES;
    }

    get isInvincible() {
      return this.invincibleFrames > 0;
    }

    /** Collision hitbox — intentionally slightly narrower than the sprite. */
    get hitbox() {
      const inset = CONFIG.MARIO.HITBOX_INSET_X;
      return {
        x: this.x + inset,
        y: this.y,
        width: this.width - inset * 2,
        height: this.height,
      };
    }
  }

  MarioGame.Mario = Mario;
})(window.MarioGame = window.MarioGame || {});
