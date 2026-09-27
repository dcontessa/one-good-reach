import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { palette, radius, spacing } from '@/theme';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'safety';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  accessibilityHint?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  accessibilityHint,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const tone =
    variant === 'primary' || variant === 'safety'
      ? 'onAccent'
      : variant === 'secondary'
        ? 'ink'
        : 'accent';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled }}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={tone === 'onAccent' ? palette.paper : palette.accent} />
      ) : (
        <Text variant="bodyStrong" tone={tone}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.45 },
});

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: palette.accent },
  safety: { backgroundColor: palette.safety },
  secondary: {
    backgroundColor: palette.paper,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.line,
  },
  ghost: { backgroundColor: 'transparent' },
};
