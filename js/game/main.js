/**
 * main.js (game bootstrap)
 * Entry point for the footer mini-game. Finds the DOM nodes, constructs
 * the CanvasManager + GameEngine, and starts the loop. Kept tiny on
 * purpose — wiring only, no logic.
 *
 * Loaded last (after all other js/game/*.js files) as a plain <script>,
 * so window.MarioGame already has CanvasManager, GameEngine, etc. attached.
 */
(function (MarioGame) {
  function initGame() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    const canvasManager = new MarioGame.CanvasManager(canvas);
    const engine = new MarioGame.GameEngine({
      canvasManager,
      hudRefs: {
        scoreEl: document.getElementById('scoreDisplay'),
        livesEl: document.getElementById('livesDisplay'),
        hiEl: document.getElementById('hiDisplay'),
      },
    });

    engine.start();
  }

  document.addEventListener('DOMContentLoaded', initGame);
})(window.MarioGame = window.MarioGame || {});
