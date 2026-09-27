import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, ProgressDots, Screen, Text } from '@/components';
import { spacing } from '@/theme';

const STEPS = [
  {
    title: 'A quiet daily ritual',
    body: 'One Good Reach turns a short check-in into one small action that helps you reconnect with a person who matters.',
  },
  {
    title: 'One good reach at a time',
    body: 'No streaks to chase and no feed to scroll. Just a single, achievable step you can take in about five minutes.',
  },
  {
    title: 'Private by design',
    body: 'Your reflections stay yours. We never send messages for you, and you stay in control of every word.',
  },
];

export default function Welcome() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const current = STEPS[step]!;
  const isLast = step === STEPS.length - 1;

  return (
    <Screen
      footer={
        <View style={styles.footer}>
          <Button
            label={isLast ? 'Get started' : 'Continue'}
            onPress={() => (isLast ? router.push('/auth') : setStep((s) => s + 1))}
          />
          {step > 0 ? (
            <Button label="Back" variant="ghost" onPress={() => setStep((s) => s - 1)} />
          ) : null}
        </View>
      }
    >
      <View style={styles.top}>
        <Text variant="caption" tone="accent">
          ONE GOOD REACH
        </Text>
      </View>
      <View style={styles.body}>
        <Card tone="accentTint">
          <Text variant="display">{current.title}</Text>
          <Text variant="body" tone="soft" style={styles.bodyText}>
            {current.body}
          </Text>
        </Card>
      </View>
      <ProgressDots total={STEPS.length} current={step} />
      <Text variant="caption" tone="faint" center style={styles.disclaimer}>
        A wellbeing and relationship-support tool. Not therapy, diagnosis, or crisis care.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { marginBottom: spacing.xl },
  body: { flex: 1, justifyContent: 'center' },
  bodyText: { marginTop: spacing.md },
  disclaimer: { marginTop: spacing.xl },
  footer: { gap: spacing.sm },
});
