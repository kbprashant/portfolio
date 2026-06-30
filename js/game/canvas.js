/**
 * canvas.js
 * Owns the relationship between the canvas's CSS box (responsive, set by
 * game.css via aspect-ratio) and its drawing buffer (device-pixel-ratio
 * aware, for crisp rendering on retina/mobile screens).
 *
 * Game logic always works in WORLD_WIDTH x WORLD_HEIGHT logical units;
 * this module sets up a transform so 1 logical unit == 1 CSS pixel,
 * regardless of actual device pixel density or on-screen size.
 *
 * Loaded as a plain <script> (no ES modules) so the game runs from a
 * file:// URL without a local server. Attaches to window.MarioGame.
 */
(function (MarioGame) {
  const CONFIG = MarioGame.CONFIG;

  class CanvasManager {
    /** @param {HTMLCanvasElement} canvas */
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this._resize = this._resize.bind(this);

      this._resize();
      window.addEventListener('resize', this._resize);
      // Orientation changes on mobile don't always fire 'resize' promptly
      window.addEventListener('orientationchange', () => setTimeout(this._resize, 50));
    }

    _resize() {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const cssWidth = this.canvas.clientWidth || CONFIG.WORLD_WIDTH;
      const cssHeight = this.canvas.clientHeight || CONFIG.WORLD_HEIGHT;

      // Set the actual bitmap resolution to match device pixels.
      this.canvas.width = Math.round(cssWidth * dpr);
      this.canvas.height = Math.round(cssHeight * dpr);

      // Scale so that drawing in WORLD_WIDTH x WORLD_HEIGHT logical units
      // fills the CSS box exactly, on any device pixel ratio or screen size.
      const scaleX = (cssWidth * dpr) / CONFIG.WORLD_WIDTH;
      const scaleY = (cssHeight * dpr) / CONFIG.WORLD_HEIGHT;
      this.ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
    }

    destroy() {
      window.removeEventListener('resize', this._resize);
    }
  }

  MarioGame.CanvasManager = CanvasManager;
})(window.MarioGame = window.MarioGame || {});
