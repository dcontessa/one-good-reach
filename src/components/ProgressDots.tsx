import { StyleSheet, View } from 'react-native';
import { palette, spacing } from '@/theme';

export function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <View style={styles.row} accessibilityLabel={`Step ${current + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i === current ? styles.active : null]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.mist },
  active: { backgroundColor: palette.accent, width: 22 },
});
