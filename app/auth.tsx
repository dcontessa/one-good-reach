import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Screen, Text } from '@/components';
import { spacing } from '@/theme';
import { useApp } from '@/store/AppStore';

export default function Auth() {
  const router = useRouter();
  const { continueAsGuest } = useApp();
  const [busy, setBusy] = useState(false);

  const goHome = () => router.replace('/home');

  const onGuest = async () => {
    setBusy(true);
    try {
      await continueAsGuest();
      goHome();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Text variant="title">Welcome</Text>
      <Text variant="body" tone="soft" style={styles.intro}>
        No account is needed. Your check-ins, relationship labels, and reflections stay on this device.
      </Text>

      <Card style={styles.card}>
        <Button label="Continue privately" onPress={onGuest} loading={busy} />
        <Text variant="caption" tone="faint" center style={styles.guestNote}>
          Nothing personal required. You can delete everything at any time.
        </Text>
      </Card>

      <Text variant="caption" tone="faint" center style={styles.legal}>
        By continuing you agree that this is a supportive tool, not a substitute for professional care.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { marginTop: spacing.sm, marginBottom: spacing.xl },
  card: { gap: spacing.md },
  guestNote: { marginTop: spacing.xs },
  legal: { marginTop: spacing.xl },
});
