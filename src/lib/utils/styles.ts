/**
 * Shared style constants and utilities
 * Brand: AICO P1 Triad Arctic Ops
 */

// Color palette
export const colors = {
  primary: {
    gradient: 'linear-gradient(135deg, #0B1226 0%, #145B7A 100%)',
    start: '#0B1226',
    end: '#145B7A',
    light: '#145B7A',
    rgb: { r: 20, g: 91, b: 122 }
  },
  accent: {
    mint: '#A7F3D0',
    mintHover: '#6EE7B7',
    signal: '#5EEAD4',
    rgb: { r: 167, g: 243, b: 208 }
  },
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)'
  },
  background: {
    primary: 'var(--bg-primary)',
    card: 'rgba(11, 18, 38, 0.55)',
    overlay: 'rgba(20, 91, 122, 0.12)'
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
    border: 1px solid rgba(20, 91, 122, 0.22);
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
    outline: 2px solid #A7F3D0;
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
