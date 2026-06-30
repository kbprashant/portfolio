/**
 * input.js
 * Normalizes keyboard (Space), mouse click, and touchstart into a single
 * "action" callback. The engine doesn't care which input fired — this is
 * what makes the same jump/start/retry logic work identically on mobile
 * and desktop without branching in game code.
 */
(function (MarioGame) {
  class InputController {
    /**
     * @param {HTMLElement} target - element to attach pointer/touch listeners to
     * @param {() => void} onAction - called once per discrete input event
     */
    constructor(target, onAction) {
      this._onAction = onAction;
      this._target = target;

      this._handleKeydown = (e) => {
        if (e.code === 'Space') {
          e.preventDefault();
          this._onAction();
        }
      };
      this._handleClick = () => this._onAction();
      this._handleTouch = (e) => {
        e.preventDefault();
        this._onAction();
      };

      document.addEventListener('keydown', this._handleKeydown);
      target.addEventListener('click', this._handleClick);
      target.addEventListener('touchstart', this._handleTouch, { passive: false });
    }

    destroy() {
      document.removeEventListener('keydown', this._handleKeydown);
      this._target.removeEventListener('click', this._handleClick);
      this._target.removeEventListener('touchstart', this._handleTouch);
    }
  }

  MarioGame.InputController = InputController;
})(window.MarioGame = window.MarioGame || {});
