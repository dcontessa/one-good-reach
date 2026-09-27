import { Pressable, StyleSheet, View } from 'react-native';
import { palette, radius, spacing } from '@/theme';
import { Text } from './Text';

interface RatingScaleProps {
  label: string;
  description: string;
  value: number | null;
  onChange: (value: number) => void;
  lowLabel?: string;
  highLabel?: string;
}

const OPTIONS = [1, 2, 3, 4, 5];

/**
 * A 1 to 5 scale for a single check-in dimension.
 * Framed gently: low means depleted, high means resourced. Not clinical.
 */
export function RatingScale({
  label,
  description,
  value,
  onChange,
  lowLabel = 'Depleted',
  highLabel = 'Full',
}: RatingScaleProps) {
  return (
    <View style={styles.wrap}>
      <Text variant="heading">{label}</Text>
      <Text variant="callout" tone="soft" style={styles.desc}>
        {description}
      </Text>
      <View
        style={styles.row}
        accessibilityRole="radiogroup"
        accessibilityLabel={`${label}. ${description}`}
      >
        {OPTIONS.map((n) => {
          const selected = value === n;
          return (
            <Pressable
              key={n}
              onPress={() => onChange(n)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`${n} out of 5`}
              style={[styles.dot, selected ? styles.dotSelected : null]}
            >
              <Text variant="bodyStrong" tone={selected ? 'onAccent' : 'soft'}>
                {n}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.scaleLabels}>
        <Text variant="caption" tone="faint">
          {lowLabel}
        </Text>
        <Text variant="caption" tone="faint">
          {highLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  desc: { marginBottom: spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  dot: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: palette.paper,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotSelected: { backgroundColor: palette.accent, borderColor: palette.accent },
  scaleLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
});
