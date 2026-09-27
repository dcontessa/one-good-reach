import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Screen, Text } from '@/components';
import { palette, radius, spacing, typography } from '@/theme';
import { useApp } from '@/store/AppStore';

export default function Complete() {
  const router = useRouter();
  const { draft, completeAction } = useApp();
  const [reflection, setReflection] = useState('');
  const [feltBetter, setFeltBetter] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  const action = draft.action;

  useEffect(() => {
    if (!action) router.replace('/home');
  }, [action, router]);

  if (!action) return null;

  const onFinish = async () => {
    setBusy(true);
    try {
      await completeAction(reflection, feltBetter);
      router.replace('/home');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen footer={<Button label="Finish" onPress={onFinish} loading={busy} />}>
      <Text variant="caption" tone="accent">
        ONE REACH COMPLETE
      </Text>
      <Text variant="title" style={styles.title}>
        Nicely done
      </Text>
      <Text variant="body" tone="soft" style={styles.intro}>
        Small reaches add up. Take a quiet moment to notice how this felt.
      </Text>

      <Card style={styles.card}>
        <Text variant="heading">Did this feel good to do</Text>
        <View style={styles.choices}>
          {[
            { label: 'Yes', value: true },
            { label: 'Not sure', value: null },
            { label: 'Not really', value: false },
          ].map((opt) => {
            const selected = feltBetter === opt.value;
            return (
              <Pressable
                key={opt.label}
                onPress={() => setFeltBetter(opt.value)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={[styles.choice, selected ? styles.choiceSelected : null]}
              >
                <Text variant="callout" tone={selected ? 'onAccent' : 'ink'}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card style={styles.card}>
        <Text variant="heading">Private reflection</Text>
        <Text variant="callout" tone="soft" style={styles.hint}>
          Optional. Just for you.
        </Text>
        <TextInput
          value={reflection}
          onChangeText={setReflection}
          placeholder="What did you notice"
          placeholderTextColor={palette.inkFaint}
          multiline
          style={styles.input}
          accessibilityLabel="Private reflection"
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.xs },
  intro: { marginTop: spacing.sm, marginBottom: spacing.xl },
  card: { gap: spacing.sm, marginBottom: spacing.lg },
  hint: { marginBottom: spacing.xs },
  choices: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  choice: {
    flex: 1,
    alignItems: 'center',
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    backgroundColor: palette.cream,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.line,
  },
  choiceSelected: { backgroundColor: palette.accent, borderColor: palette.accent },
  input: {
    ...typography.body,
    color: palette.ink,
    backgroundColor: palette.cream,
    borderRadius: radius.sm,
    padding: spacing.lg,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.line,
  },
});
