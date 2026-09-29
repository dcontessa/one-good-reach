import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Button, Card, Divider, Screen, Text } from '@/components';
import { palette, radius, spacing } from '@/theme';
import { services } from '@/services';
import type { PurchaseOffering } from '@/services/types';
import { useApp } from '@/store/AppStore';

const PREMIUM_FEATURES = [
  'Personalized journeys shaped around you',
  'Deeper pattern insights over time',
  'Difficult-conversation preparation',
  'Relationship-specific plans',
  'Multilingual content',
];

export default function Paywall() {
  const router = useRouter();
  const { refreshPremium, activateReviewAccess, isPremium } = useApp();
  const [offering, setOffering] = useState<PurchaseOffering | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewCode, setReviewCode] = useState('');

  useEffect(() => {
    let active = true;
    services.purchases
      .getOffering()
      .then((o) => {
        if (!active) return;
        setOffering(o);
        setSelected(o.packages[0]?.identifier ?? null);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : 'Premium options could not be loaded.');
      });
    return () => {
      active = false;
    };
  }, []);

  const onPurchase = async () => {
    if (!selected) return;
    setBusy(true);
    setError(null);
    try {
      await services.purchases.purchase(selected);
      await refreshPremium();
      router.back();
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : 'The purchase could not be completed.');
    } finally {
      setBusy(false);
    }
  };

  const onRestore = async () => {
    setBusy(true);
    setError(null);
    try {
      await services.purchases.restore();
      await refreshPremium();
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : 'Purchases could not be restored.');
    } finally {
      setBusy(false);
    }
  };

  const onReviewAccess = () => {
    setError(null);
    if (!activateReviewAccess(reviewCode)) {
      setError('That review access code is not valid.');
      return;
    }
    setReviewCode('');
  };

  return (
    <Screen
      footer={
        <View style={styles.footer}>
          {isPremium ? (
            <Button label="You have Premium" onPress={() => router.back()} />
          ) : (
            <Button label="Start Premium" onPress={onPurchase} loading={busy} disabled={!selected} />
          )}
          <Button label="Restore purchases" variant="ghost" onPress={onRestore} disabled={busy} />
        </View>
      }
    >
      <Stack.Screen options={{ headerShown: true, title: 'Premium', headerBackTitle: 'Back' }} />

      <Text variant="title">Go a little deeper</Text>
      <Text variant="body" tone="soft" style={styles.intro}>
        Your daily check-in, one action, reflection, and history are always free. Premium adds more when you want it.
      </Text>

      <Card tone="accentTint" style={styles.features}>
        {PREMIUM_FEATURES.map((f) => (
          <View key={f} style={styles.featureRow}>
            <Text variant="body" tone="accent">
              •
            </Text>
            <Text variant="body" style={styles.featureText}>
              {f}
            </Text>
          </View>
        ))}
      </Card>

      <Divider inset />

      {error ? (
        <Card tone="safetyTint">
          <Text variant="callout" tone="safety">
            {error}
          </Text>
        </Card>
      ) : null}

      <View style={styles.packages}>
        {offering?.packages.map((pkg) => {
          const isSel = selected === pkg.identifier;
          return (
            <Pressable
              key={pkg.identifier}
              onPress={() => setSelected(pkg.identifier)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSel }}
              style={[styles.package, isSel ? styles.packageSelected : null]}
            >
              <View style={styles.packageHeader}>
                <Text variant="bodyStrong">{pkg.title}</Text>
                <Text variant="bodyStrong" tone="accent">
                  {pkg.priceString}
                </Text>
              </View>
              <Text variant="callout" tone="soft" style={styles.packageDesc}>
                {pkg.description}
              </Text>
              <Text variant="caption" tone="faint" style={styles.packagePeriod}>
                Billed per {pkg.period}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text variant="caption" tone="faint" center style={styles.fineprint}>
        Safety information and your basic journal history are never behind Premium.
      </Text>

      <Divider inset />

      <Card>
        <Text variant="bodyStrong">Reviewer or judge access</Text>
        <Text variant="callout" tone="soft" style={styles.reviewHelp}>
          Enter the reusable access code supplied with this submission to review every Premium feature without a purchase.
        </Text>
        <TextInput
          value={reviewCode}
          onChangeText={setReviewCode}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder="Access code"
          placeholderTextColor={palette.inkFaint}
          accessibilityLabel="Reviewer access code"
          style={styles.reviewInput}
        />
        <Button label="Unlock reviewer access" variant="secondary" onPress={onReviewAccess} disabled={!reviewCode.trim()} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { marginTop: spacing.sm, marginBottom: spacing.xl },
  features: { gap: spacing.sm },
  featureRow: { flexDirection: 'row', gap: spacing.md },
  featureText: { flex: 1 },
  packages: { gap: spacing.md },
  package: {
    borderRadius: radius.md,
    padding: spacing.lg,
    backgroundColor: palette.paper,
    borderWidth: 1.5,
    borderColor: palette.line,
  },
  packageSelected: { borderColor: palette.accent, backgroundColor: palette.accentTint },
  packageHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  packageDesc: { marginTop: spacing.xs },
  packagePeriod: { marginTop: spacing.xs },
  fineprint: { marginTop: spacing.xl },
  reviewHelp: { marginTop: spacing.xs, marginBottom: spacing.md },
  reviewInput: {
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: radius.md,
    backgroundColor: palette.paper,
    color: palette.ink,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  footer: { gap: spacing.sm },
});
