/**
 * site.js
 * Page-level behavior unrelated to the game (nav, scroll, future widgets).
 * Kept separate from js/game/* so site interactivity and game logic never
 * mix concerns or share global state.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Close any future mobile nav menu on link click (placeholder hook —
  // currently the nav has no toggle, but this keeps the pattern ready).
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      link.blur();
    });
  });
});
