import { StyleSheet, View } from 'react-native';
import { palette, radius, spacing } from '@/theme';
import { Text } from './Text';

interface PillProps {
  label: string;
  tone?: 'neutral' | 'accent' | 'calm' | 'premium';
}

const bg = {
  neutral: palette.mist,
  accent: palette.accentTint,
  calm: palette.calmTint,
  premium: palette.accent,
} as const;

export function Pill({ label, tone = 'neutral' }: PillProps) {
  return (
    <View style={[styles.pill, { backgroundColor: bg[tone] }]}>
      <Text variant="caption" tone={tone === 'premium' ? 'onAccent' : 'soft'}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
});
