import { StyleSheet, View } from 'react-native';
import { palette, spacing } from '@/theme';

export function Divider({ inset = false }: { inset?: boolean }) {
  return <View style={[styles.line, inset ? styles.inset : null]} />;
}

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth, backgroundColor: palette.line },
  inset: { marginVertical: spacing.md },
});
