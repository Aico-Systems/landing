/**
 * Shared style constants and utilities
 * Provides consistent styling across components (DRY)
 */

// Color palette
export const colors = {
  primary: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    start: '#667eea',
    end: '#764ba2',
    light: '#4c5fe3',
    rgb: { r: 102, g: 126, b: 234 }
  },
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)'
  },
  background: {
    primary: 'var(--bg-primary)',
    card: 'rgba(16, 24, 40, 0.55)',
    overlay: 'rgba(102, 126, 234, 0.12)'
  }
} as const;

// Spacing scale (consistent spacing system)
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
  '5xl': '120px'
} as const;

// Border radius scale
export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '22px',
  full: '999px'
} as const;

// Typography scale
export const fontSize = {
  xs: '12px',
  sm: '13px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '30px',
  '4xl': '36px',
  '5xl': '48px',
  '6xl': '64px'
} as const;

// Animation durations
export const duration = {
  fast: '150ms',
  base: '300ms',
  slow: '500ms',
  slower: '800ms'
} as const;

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// Common CSS mixins as strings
export const mixins = {
  card: `
    padding: ${spacing.xl};
    border-radius: ${borderRadius.xl};
    border: 1px solid rgba(102, 126, 234, 0.22);
    background: ${colors.background.card};
    backdrop-filter: blur(28px);
  `,
  gradientBorder: `
    position: relative;
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 1px;
      background: ${colors.primary.gradient};
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
  `,
  focusRing: `
    outline: 2px solid ${colors.primary.start};
    outline-offset: 2px;
  `
} as const;

// Utility functions
export function rgba(r: number, g: number, b: number, a: number): string {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
