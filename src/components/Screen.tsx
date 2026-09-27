import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette, spacing } from '@/theme';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  footer?: ReactNode;
  background?: string;
  contentStyle?: ViewStyle;
}

/**
 * Standard screen wrapper. Handles safe area, background, generous padding,
 * optional scroll, and a pinned footer for primary actions.
 */
export function Screen({
  children,
  scroll = true,
  padded = true,
  footer,
  background = palette.cream,
  contentStyle,
}: ScreenProps) {
  const inner = (
    <View style={[padded ? styles.padded : null, styles.grow, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: background }]} edges={['top', 'bottom']}>
      {scroll ? (
        <ScrollView
          style={styles.grow}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {inner}
        </ScrollView>
      ) : (
        inner
      )}
      {footer ? <View style={[styles.footer, { backgroundColor: background }]}>{footer}</View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  grow: { flexGrow: 1 },
  scrollContent: { flexGrow: 1 },
  padded: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xl },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.line,
  },
});
