import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Divider, Screen, Text } from '@/components';
import {
  HELPLINES,
  SAFETY_DISCLAIMER,
  SAFETY_IMMEDIATE,
  SAFETY_INTRO,
  SAFETY_REACH_OUT,
} from '@/content/safety';
import { spacing } from '@/theme';
import { useApp } from '@/store/AppStore';

/**
 * Shown when a check-in note contains crisis language. This never generates a
 * normal relationship action. Safety information is always free.
 */
export default function Safety() {
  const router = useRouter();
  const { clearDraft } = useApp();

  const done = () => {
    clearDraft();
    router.replace('/home');
  };

  return (
    <Screen
      footer={
        <Button label="Back to home" variant="secondary" onPress={done} />
      }
    >
      <Text variant="title">You matter</Text>
      <Text variant="body" tone="soft" style={styles.intro}>
        {SAFETY_INTRO}
      </Text>

      <Card tone="safetyTint" style={styles.card}>
        <Text variant="bodyStrong" tone="safety">
          {SAFETY_IMMEDIATE}
        </Text>
      </Card>

      <Text variant="body" style={styles.reach}>
        {SAFETY_REACH_OUT}
      </Text>

      <Divider inset />

      <Text variant="heading">Helplines</Text>
      <Text variant="caption" tone="faint" style={styles.availability}>
        Availability varies by country.
      </Text>
      <View style={styles.lines}>
        {HELPLINES.map((line) => (
          <Card key={line.name}>
            <Text variant="caption" tone="faint">
              {line.region}
            </Text>
            <Text variant="bodyStrong" style={styles.lineName}>
              {line.name}
            </Text>
            <Text variant="body" tone="accent">
              {line.contact}
            </Text>
            {line.note ? (
              <Text variant="callout" tone="soft" style={styles.lineNote}>
                {line.note}
              </Text>
            ) : null}
          </Card>
        ))}
      </View>

      <Text variant="caption" tone="faint" style={styles.disclaimer}>
        {SAFETY_DISCLAIMER}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { marginTop: spacing.sm, marginBottom: spacing.lg },
  card: { marginBottom: spacing.lg },
  reach: { marginBottom: spacing.sm },
  availability: { marginTop: spacing.xs, marginBottom: spacing.md },
  lines: { gap: spacing.md },
  lineName: { marginTop: spacing.xs },
  lineNote: { marginTop: spacing.xs },
  disclaimer: { marginTop: spacing.xl },
});
