import { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { palette, radius, spacing } from '@/theme';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  tone?: 'paper' | 'sand' | 'accentTint' | 'calmTint' | 'safetyTint';
  accessibilityLabel?: string;
}

const toneBg = {
  paper: palette.paper,
  sand: palette.sand,
  accentTint: palette.accentTint,
  calmTint: palette.calmTint,
  safetyTint: palette.safetyTint,
} as const;

export function Card({ children, onPress, style, tone = 'paper', accessibilityLabel }: CardProps) {
  const content = (
    <View style={[styles.card, { backgroundColor: toneBg[tone] }, style]}>{children}</View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => (pressed ? styles.pressed : null)}
      >
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.line,
  },
  pressed: { opacity: 0.9 },
});
