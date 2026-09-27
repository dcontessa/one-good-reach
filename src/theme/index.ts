/**
 * Design tokens for One Good Reach.
 * Calm, warm, private, adult. An accessible neutral palette with one warm accent,
 * large readable type, generous spacing, and restraint. No wellness gradients.
 */

export const palette = {
  // Warm neutral backgrounds
  cream: '#FBF7F1',
  paper: '#FFFFFF',
  sand: '#F1EAE0',
  mist: '#EAE3D9',

  // Ink / text
  ink: '#2C2A28',
  inkSoft: '#5B564F',
  inkFaint: '#8A837A',

  // Single warm accent and supporting tones
  accent: '#C0603A', // grounded terracotta
  accentSoft: '#E7C8B8',
  accentTint: '#F7E9E1',

  // Functional, muted (never alarming for normal flows)
  calm: '#5E7C74', // muted sage for gentle affirmation
  calmTint: '#E4ECE8',

  // Safety uses a serious but non-lurid tone
  safety: '#8A4B3B',
  safetyTint: '#F3E4DE',

  line: '#E3DBD0',
  overlay: 'rgba(44, 42, 40, 0.28)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 32, lineHeight: 40, fontWeight: '700' as const },
  title: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const },
  heading: { fontSize: 20, lineHeight: 28, fontWeight: '600' as const },
  body: { fontSize: 17, lineHeight: 26, fontWeight: '400' as const },
  bodyStrong: { fontSize: 17, lineHeight: 26, fontWeight: '600' as const },
  callout: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const },
} as const;

export const theme = {
  palette,
  spacing,
  radius,
  typography,
} as const;

export type Theme = typeof theme;
