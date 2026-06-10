export const GESTURE_CONFIG = {
  SWIPE_REPLY_THRESHOLD: 72,
  SWIPE_REPLY_VELOCITY: 850,

  LONG_PRESS_DURATION: 220,

  DOUBLE_TAP_DELAY: 240,

  ACTIVE_OFFSET_X: [-12, 12],
  FAIL_OFFSET_Y: [-8, 8],

  SPRING: {
    damping: 18,
    stiffness: 220,
    mass: 0.9,
  },

  TIMING: {
    duration: 180,
  },
} as const;