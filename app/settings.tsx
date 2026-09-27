import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Button, Card, Divider, Screen, Text } from '@/components';
import { spacing } from '@/theme';
import { services } from '@/services';
import { useApp } from '@/store/AppStore';

export default function Settings() {
  const router = useRouter();
  const { isPremium, deleteAccount, refreshPremium } = useApp();
  const [busy, setBusy] = useState(false);

  const onRestore = async () => {
    setBusy(true);
    try {
      await services.purchases.restore();
      await refreshPremium();
      Alert.alert('Restore complete', 'Your subscription status has been refreshed.');
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete all local data',
      'This permanently removes your check-ins, actions, reflections, and connection labels from this device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete everything',
          style: 'destructive',
          onPress: async () => {
            await deleteAccount();
            router.replace('/welcome');
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: 'Settings', headerBackTitle: 'Home' }} />

      <Text variant="title">Settings</Text>
      <Text variant="body" tone="soft" style={styles.intro}>
        Your private history stays on this device. No account is required.
      </Text>

      <Text variant="caption" tone="faint" style={styles.sectionLabel}>
        SUBSCRIPTION
      </Text>
      <Card style={styles.card}>
        <Text variant="bodyStrong">{isPremium ? 'Premium is active' : 'Free plan'}</Text>
        <Text variant="callout" tone="soft">
          {isPremium
            ? 'Thank you for supporting the work. Deeper journeys are unlocked.'
            : 'Daily check-in, one action, reflection, and history are always included.'}
        </Text>
        {!isPremium ? (
          <Button label="See Premium" variant="secondary" onPress={() => router.push('/paywall')} />
        ) : null}
        <Button label="Restore purchases" variant="ghost" onPress={onRestore} disabled={busy} />
      </Card>

      <Text variant="caption" tone="faint" style={styles.sectionLabel}>
        SAFETY AND PRIVACY
      </Text>
      <Card style={styles.card}>
        <Text variant="bodyStrong">If things feel heavy</Text>
        <Text variant="callout" tone="soft">
          You can open supportive resources anytime. This information is always free.
        </Text>
        <Button label="Open safety resources" variant="secondary" onPress={() => router.push('/safety')} />
        <Divider inset />
        <Text variant="callout" tone="soft">
          We store the minimum needed for your daily ritual. We never send messages for you and never import your contacts. Relationship labels are created by you.
        </Text>
      </Card>

      <Text variant="caption" tone="faint" style={styles.sectionLabel}>
        YOUR DATA
      </Text>
      <Card style={styles.card}>
        <Button label="Delete all local data" variant="safety" onPress={confirmDelete} />
        <Text variant="caption" tone="faint">
          This removes your check-ins, actions, reflections, and connection labels from this device.
        </Text>
      </Card>

      <View style={styles.footerNote}>
        <Text variant="caption" tone="faint" center>
          One Good Reach is a wellbeing and relationship-support tool. It is not therapy, diagnosis, or crisis care.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { marginTop: spacing.sm, marginBottom: spacing.xl },
  sectionLabel: { marginTop: spacing.lg, marginBottom: spacing.sm },
  card: { gap: spacing.md },
  footerNote: { marginTop: spacing.xxl },
});
