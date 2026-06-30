/**
 * hud.js
 * The on-page (non-canvas) score/lives/high-score readout above the game
 * lives in regular DOM, not canvas, for crisp text at any zoom level.
 * This module is the only thing allowed to touch those DOM nodes.
 */
(function (MarioGame) {
  class Hud {
    constructor({ scoreEl, livesEl, hiEl }) {
      this.scoreEl = scoreEl;
      this.livesEl = livesEl;
      this.hiEl = hiEl;
    }

    update({ score, lives, highScore }) {
      this.scoreEl.textContent = String(score);
      this.livesEl.textContent = String(lives);
      this.hiEl.textContent = String(highScore);
    }
  }

  MarioGame.Hud = Hud;
})(window.MarioGame = window.MarioGame || {});
