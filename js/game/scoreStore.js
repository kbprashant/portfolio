/**
 * scoreStore.js
 * Owns score, lives, and high-score persistence. Engine reads/writes
 * through this rather than touching localStorage or DOM directly —
 * keeps persistence concerns out of game-loop logic.
 */
(function (MarioGame) {
  const CONFIG = MarioGame.CONFIG;

  class ScoreStore {
    constructor() {
      this.score = 0;
      this.lives = CONFIG.PLAYER.START_LIVES;
      this.highScore = Number(localStorage.getItem(CONFIG.STORAGE_KEY)) || 0;
    }

    reset() {
      this.score = 0;
      this.lives = CONFIG.PLAYER.START_LIVES;
    }

    addScore(amount) {
      this.score += amount;
    }

    loseLife() {
      this.lives = Math.max(0, this.lives - 1);
      return this.lives <= 0;
    }

    get isGameOver() {
      return this.lives <= 0;
    }

    commitHighScoreIfNeeded() {
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem(CONFIG.STORAGE_KEY, String(this.highScore));
        return true;
      }
      return false;
    }
  }

  MarioGame.ScoreStore = ScoreStore;
})(window.MarioGame = window.MarioGame || {});
