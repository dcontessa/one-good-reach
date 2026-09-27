import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, RatingScale, Screen, Text } from '@/components';
import { palette, radius, spacing, typography } from '@/theme';
import { useApp } from '@/store/AppStore';

export default function CheckIn() {
  const router = useRouter();
  const { submitCheckIn } = useApp();

  const [soul, setSoul] = useState<number | null>(null);
  const [mind, setMind] = useState<number | null>(null);
  const [body, setBody] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const ready = soul != null && mind != null && body != null;

  const onSubmit = async () => {
    if (!ready) return;
    setBusy(true);
    try {
      const result = await submitCheckIn({ soul, mind, body }, note);
      if (result.routedToSafety) {
        router.replace('/safety');
      } else {
        router.replace('/action');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen
      footer={
        <Button
          label="Find one good reach"
          onPress={onSubmit}
          disabled={!ready}
          loading={busy}
          accessibilityHint="Reviews your note privately, then suggests one small action"
        />
      }
    >
      <Text variant="title">How are you today</Text>
      <Text variant="body" tone="soft" style={styles.intro}>
        Move at your own pace. There are no wrong answers here.
      </Text>

      <View style={styles.scales}>
        <RatingScale
          label="Soul"
          description="Your sense of meaning, warmth, and connection."
          value={soul}
          onChange={setSoul}
        />
        <RatingScale
          label="Mind"
          description="Your clarity, focus, and mental steadiness."
          value={mind}
          onChange={setMind}
        />
        <RatingScale
          label="Body"
          description="Your energy, rest, and physical ease."
          value={body}
          onChange={setBody}
        />
      </View>

      <Card style={styles.noteCard}>
        <Text variant="heading">Anything on your mind</Text>
        <Text variant="callout" tone="soft" style={styles.noteHint}>
          Optional. A few words can help shape a better suggestion. This stays private.
        </Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Write as much or as little as you like"
          placeholderTextColor={palette.inkFaint}
          multiline
          style={styles.input}
          accessibilityLabel="Optional note about how you feel"
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { marginTop: spacing.sm, marginBottom: spacing.xl },
  scales: { gap: spacing.xxl },
  noteCard: { marginTop: spacing.xxl, gap: spacing.sm },
  noteHint: { marginBottom: spacing.xs },
  input: {
    ...typography.body,
    color: palette.ink,
    backgroundColor: palette.cream,
    borderRadius: radius.sm,
    padding: spacing.lg,
    minHeight: 96,
    textAlignVertical: 'top',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.line,
  },
});
