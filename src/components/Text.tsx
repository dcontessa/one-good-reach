import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { palette, typography } from '@/theme';

type Variant = keyof typeof typography;
type Tone = 'ink' | 'soft' | 'faint' | 'accent' | 'calm' | 'safety' | 'onAccent';

export interface AppTextProps extends RNTextProps {
  variant?: Variant;
  tone?: Tone;
  center?: boolean;
}

const toneColor: Record<Tone, string> = {
  ink: palette.ink,
  soft: palette.inkSoft,
  faint: palette.inkFaint,
  accent: palette.accent,
  calm: palette.calm,
  safety: palette.safety,
  onAccent: palette.paper,
};

export function Text({
  variant = 'body',
  tone = 'ink',
  center,
  style,
  ...rest
}: AppTextProps) {
  return (
    <RNText
      style={[
        typography[variant],
        { color: toneColor[tone] },
        center ? styles.center : null,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
});
