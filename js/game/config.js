/**
 * config.js
 * Single source of truth for game constants. Nothing in the engine,
 * renderer, or entities should hardcode magic numbers — they read from here.
 * This is what you'd tune first if difficulty/feel needs adjusting.
 *
 * Loaded as a plain <script> (no ES modules) so the game works from a
 * file:// URL without a local server. All game modules attach to the
 * shared window.MarioGame namespace instead of using import/export.
 */
window.MarioGame = window.MarioGame || {};

window.MarioGame.CONFIG = {
  // Logical (design-resolution) canvas size. The actual drawing buffer is
  // scaled by devicePixelRatio in canvas.js, but all game-logic coordinates
  // are expressed in this fixed coordinate space — keeps physics/collision
  // resolution-independent.
  WORLD_WIDTH: 900,
  WORLD_HEIGHT: 280,
  GROUND_OFFSET: 50, // distance from bottom of world to ground line

  PHYSICS: {
    GRAVITY: 0.65,
    JUMP_VELOCITY: -13.5,
    MAX_JUMPS: 2,
  },

  MARIO: {
    START_X: 80,
    WIDTH: 28,
    HEIGHT: 32,
    HITBOX_INSET_X: 4, // shrink collision box slightly vs sprite for fairness
  },

  SPEED: {
    BASE: 4,
    MAX: 12,
    RAMP_SCORE_INTERVAL: 500, // every N score points, speed increases
    RAMP_INCREMENT: 0.5,
  },

  PIPE: {
    WIDTH: 44,
    HEAD_HEIGHT: 14,
    MIN_HEIGHT: 50,
    MAX_HEIGHT: 100,
    MIN_GAP_FRAMES: 80,
    MAX_GAP_FRAMES: 160,
  },

  COIN: {
    SIZE: 16,
    SPAWN_CHANCE: 0.6,
    VALUE: 50,
  },

  SCORING: {
    TICK_INTERVAL_FRAMES: 6, // +1 score every N frames survived
    PIPE_CLEAR_BONUS: 100,
  },

  PLAYER: {
    START_LIVES: 3,
    INVINCIBILITY_FRAMES: 80,
  },

  CLOUD_COUNT: 4,

  STORAGE_KEY: 'marioHi',

  COLORS: {
    sky: '#5C94FC',
    ground: '#43A047',
    groundTop: '#4CAF50',
    groundDither: '#388E3C',
    dark: '#1A1A2E',
    gold: '#FBD000',
    red: '#E52521',
    white: '#FFFFFF',
    pipe: '#43A047',
    pipeEdge: '#1B5E20',
    overalls: '#1565C0',
    skin: '#FFCC80',
  },
};
