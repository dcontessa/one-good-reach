import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Divider, Pill, Screen, Text } from '@/components';
import { isSameDay, nowIso } from '@/domain';
import { spacing } from '@/theme';
import { useApp } from '@/store/AppStore';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const router = useRouter();
  const { data, isPremium, insights } = useApp();

  const checkedInToday = useMemo(
    () => data.checkIns.some((c) => isSameDay(c.createdAt, nowIso())),
    [data.checkIns],
  );

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text variant="caption" tone="accent">
            ONE GOOD REACH
          </Text>
          <Text variant="title">{greeting()}</Text>
        </View>
        <Pressable
          onPress={() => router.push('/settings')}
          accessibilityLabel="Settings"
          accessibilityRole="button"
          hitSlop={12}
        >
          <Text variant="callout" tone="accent">
            Settings
          </Text>
        </Pressable>
      </View>

      <Card tone="accentTint" style={styles.hero}>
        <Text variant="heading">
          {checkedInToday ? 'You checked in today' : "Today's check-in"}
        </Text>
        <Text variant="body" tone="soft" style={styles.heroBody}>
          {checkedInToday
            ? 'You can check in again anytime you want another small step.'
            : 'A short Soul, Mind, Body check-in helps find one good reach for today.'}
        </Text>
        <Button
          label={checkedInToday ? 'Check in again' : 'Start check-in'}
          onPress={() => router.push('/checkin')}
          style={styles.heroButton}
        />
      </Card>

      <View style={styles.row}>
        <Card style={styles.tile} onPress={() => router.push('/history')} accessibilityLabel="History and connection map">
          <Text variant="heading">History</Text>
          <Text variant="callout" tone="soft" style={styles.tileBody}>
            {insights.totalCheckIns} check-ins, {insights.completedActions} reaches
          </Text>
        </Card>
        <Card style={styles.tile} onPress={() => router.push('/history')} accessibilityLabel="Connection map">
          <Text variant="heading">Connections</Text>
          <Text variant="callout" tone="soft" style={styles.tileBody}>
            {insights.reachedPeople.length} people you reached
          </Text>
        </Card>
      </View>

      {!isPremium ? (
        <>
          <Divider inset />
          <Card tone="sand">
            <Pill label="Premium" tone="premium" />
            <Text variant="heading" style={styles.premiumTitle}>
              Go deeper when you are ready
            </Text>
            <Text variant="callout" tone="soft" style={styles.tileBody}>
              Personalized journeys, deeper pattern insights, and difficult-conversation preparation.
            </Text>
            <Button
              label="See what is included"
              variant="secondary"
              onPress={() => router.push('/paywall')}
              style={styles.premiumButton}
            />
          </Card>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xl },
  headerText: { gap: spacing.xs },
  hero: { gap: spacing.sm },
  heroBody: { marginBottom: spacing.md },
  heroButton: { marginTop: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  tile: { flex: 1, gap: spacing.xs },
  tileBody: { marginTop: spacing.xs },
  premiumTitle: { marginTop: spacing.md },
  premiumButton: { marginTop: spacing.lg },
});
