/**
 * renderer.js
 * Pure presentation layer. Takes entity state and draws it — never
 * mutates game state. Splitting this from engine.js means art/visual
 * changes never risk touching physics or scoring logic.
 */
(function (MarioGame) {
  const CONFIG = MarioGame.CONFIG;
  const { COLORS, WORLD_WIDTH, WORLD_HEIGHT, GROUND_OFFSET } = CONFIG;
  const GROUND_Y = WORLD_HEIGHT - GROUND_OFFSET;

  class Renderer {
    /** @param {CanvasRenderingContext2D} ctx */
    constructor(ctx) {
      this.ctx = ctx;
    }

    clear() {
      const ctx = this.ctx;
      ctx.fillStyle = COLORS.sky;
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    }

    drawCloud(cloud) {
      const ctx = this.ctx;
      const { x, y, width: w } = cloud;
      ctx.fillStyle = COLORS.white;
      ctx.fillRect(x + w * 0.1, y + 12, w * 0.8, 12);
      ctx.beginPath(); ctx.arc(x + w * 0.25, y + 12, 10, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + w * 0.5, y + 8, 14, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + w * 0.75, y + 12, 10, 0, Math.PI * 2); ctx.fill();
    }

    drawGround() {
      const ctx = this.ctx;
      ctx.fillStyle = COLORS.groundTop;
      ctx.fillRect(0, GROUND_Y, WORLD_WIDTH, 6);
      ctx.fillStyle = COLORS.ground;
      ctx.fillRect(0, GROUND_Y + 6, WORLD_WIDTH, WORLD_HEIGHT - GROUND_Y - 6);
      ctx.fillStyle = COLORS.groundDither;
      for (let i = 0; i < WORLD_WIDTH; i += 16) {
        ctx.fillRect(i, GROUND_Y + 4, 8, 4);
      }
    }

    drawPipe(pipe) {
      const ctx = this.ctx;
      const { WIDTH: pw, HEAD_HEIGHT: headH } = CONFIG.PIPE;
      const x = pipe.x, h = pipe.height;

      ctx.fillStyle = COLORS.pipe;
      ctx.fillRect(x + 4, GROUND_Y - h, pw - 8, h);
      ctx.fillStyle = COLORS.pipeEdge;
      ctx.fillRect(x + 4, GROUND_Y - h, 6, h);
      ctx.fillRect(x + pw - 12, GROUND_Y - h, 6, h);

      ctx.fillStyle = COLORS.pipe;
      ctx.fillRect(x, GROUND_Y - h - headH, pw, headH);
      ctx.fillStyle = COLORS.pipeEdge;
      ctx.fillRect(x, GROUND_Y - h - headH, pw, 4);
      ctx.fillRect(x, GROUND_Y - h - headH, 4, headH);
      ctx.fillRect(x + pw - 4, GROUND_Y - h - headH, 4, headH);
    }

    drawCoin(coin) {
      if (!coin.alive) return;
      const ctx = this.ctx;
      const scale = Math.abs(Math.cos(coin.anim * 0.15));
      ctx.save();
      ctx.translate(coin.x + 8, coin.y + 8);
      ctx.scale(scale, 1);
      ctx.fillStyle = COLORS.gold;
      ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F9A825';
      ctx.beginPath(); ctx.arc(-1, -1, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = COLORS.gold;
      ctx.font = 'bold 6px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('$', 0, 2);
      ctx.restore();
    }

    drawMario(mario) {
      // Flicker while invincible, skip a frame periodically for a blink effect
      if (mario.isInvincible && Math.floor(mario.invincibleFrames / 4) % 2 === 0) return;

      const ctx = this.ctx;
      const { x, y } = mario;

      ctx.save();
      ctx.fillStyle = COLORS.red;
      ctx.fillRect(x + 4, y + 10, 20, 14);

      ctx.fillStyle = COLORS.overalls;
      ctx.fillRect(x + 4, y + 18, 20, 10);

      ctx.fillStyle = COLORS.red;
      ctx.fillRect(x + 2, y + 5, 24, 6);
      ctx.fillRect(x + 6, y + 1, 16, 6);

      ctx.fillStyle = COLORS.skin;
      ctx.fillRect(x + 6, y + 8, 16, 8);

      ctx.fillStyle = COLORS.dark;
      ctx.fillRect(x + 14, y + 10, 4, 3);
      ctx.fillRect(x + 10, y + 14, 12, 2); // mustache

      const lOff = Math.sin(mario.walkFrame * 0.3) * 4;
      ctx.fillStyle = COLORS.overalls;
      ctx.fillRect(x + 6, y + 26, 8, 6 + lOff);
      ctx.fillRect(x + 14, y + 26, 8, 6 - lOff);
      ctx.fillStyle = COLORS.dark;
      ctx.fillRect(x + 4, y + 30 + lOff, 10, 4);
      ctx.fillRect(x + 14, y + 30 - lOff, 10, 4);

      ctx.fillStyle = COLORS.skin;
      ctx.fillRect(x, y + 12, 6, 6);
      ctx.fillRect(x + 22, y + 12, 6, 6);

      ctx.restore();
    }

    drawHUD(score, highScore) {
      const ctx = this.ctx;
      ctx.fillStyle = COLORS.dark;
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('SCORE', 10, 20);
      ctx.fillText(String(score).padStart(6, '0'), 10, 34);
      ctx.fillText('HI ' + String(highScore).padStart(6, '0'), WORLD_WIDTH / 2 - 60, 20);
    }

    drawStartOverlay() {
      const ctx = this.ctx;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      ctx.fillStyle = COLORS.white;
      ctx.font = '14px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MARIO RUNNER', WORLD_WIDTH / 2, WORLD_HEIGHT / 2 - 20);
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.fillStyle = COLORS.gold;
      ctx.fillText('PRESS SPACE OR TAP TO START', WORLD_WIDTH / 2, WORLD_HEIGHT / 2 + 10);
    }

    drawGameOverOverlay(score) {
      const ctx = this.ctx;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      ctx.fillStyle = COLORS.red;
      ctx.font = '16px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', WORLD_WIDTH / 2, WORLD_HEIGHT / 2 - 20);
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.fillStyle = COLORS.white;
      ctx.fillText('SCORE: ' + score, WORLD_WIDTH / 2, WORLD_HEIGHT / 2 + 5);
      ctx.fillStyle = COLORS.gold;
      ctx.fillText('PRESS SPACE / TAP TO RETRY', WORLD_WIDTH / 2, WORLD_HEIGHT / 2 + 25);
    }
  }

  MarioGame.Renderer = Renderer;
})(window.MarioGame = window.MarioGame || {});
