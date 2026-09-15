export const BLADE_ANGLE_DEG = 61;
export const BLADE_K = 0.554; // = 1 / Math.tan(61 * Math.PI / 180)

export function bladeRun(height: number): number {
  return height * BLADE_K;
}

export const motionTokens = {
  ease: {
    brand: 'brand',
    brandInOut: 'brandInOut',
    expoOut: 'expo.out',
    power3Out: 'power3.out',
  },
  durations: {
    xs: 0.2,
    sm: 0.35,
    md: 0.6,
    lg: 0.9,
    xl: 1.2,
  },
  stagger: {
    words: 0.06,
    cards: 0.08,
    sections: 0.12,
  },
  revealDistance: {
    desktop: 40,
    mobile: 24,
  },
} as const;

