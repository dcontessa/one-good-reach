import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Button, Card, Divider, Pill, Screen, Text } from '@/components';
import { INTENT_LABELS } from '@/content/actions';
import type { ActionIntent, CheckInArea } from '@/domain';
import { spacing } from '@/theme';
import { useApp } from '@/store/AppStore';

const AREA_LABEL: Record<CheckInArea, string> = { soul: 'Soul', mind: 'Mind', body: 'Body' };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export default function History() {
  const router = useRouter();
  const { data, insights, isPremium } = useApp();

  const completionByAction = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of data.completions) map.set(c.actionId, c.completedAt);
    return map;
  }, [data.completions]);

  const personLabel = (id: string | null) =>
    id ? (data.persons.find((p) => p.id === id)?.label ?? 'Someone') : 'Kept open';

  const hasHistory = data.checkIns.length > 0 || data.actions.length > 0;

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: 'History', headerBackTitle: 'Home' }} />

      <Text variant="title">Your patterns</Text>
      <Text variant="body" tone="soft" style={styles.intro}>
        A private view of your check-ins and the people you have reached.
      </Text>

      <View style={styles.stats}>
        <Card style={styles.stat}>
          <Text variant="display" tone="accent">
            {insights.totalCheckIns}
          </Text>
          <Text variant="callout" tone="soft">
            check-ins
          </Text>
        </Card>
        <Card style={styles.stat}>
          <Text variant="display" tone="accent">
            {insights.completedActions}
          </Text>
          <Text variant="callout" tone="soft">
            reaches made
          </Text>
        </Card>
      </View>

      {insights.mostDepletedArea || insights.topIntent ? (
        <Card tone="sand" style={styles.insightCard}>
          <Text variant="heading">Gentle observations</Text>
          {insights.mostDepletedArea ? (
            <Text variant="body" tone="soft" style={styles.insightLine}>
              Your {AREA_LABEL[insights.mostDepletedArea]} tends to ask for care most often.
            </Text>
          ) : null}
          {insights.topIntent ? (
            <Text variant="body" tone="soft" style={styles.insightLine}>
              You reach most through {INTENT_LABELS[insights.topIntent as ActionIntent].toLowerCase()}.
            </Text>
          ) : null}
          {!isPremium ? (
            <Text variant="caption" tone="faint" style={styles.insightLine}>
              Premium adds deeper trends over time and relationship-specific plans.
            </Text>
          ) : null}
        </Card>
      ) : null}

      <Divider inset />

      <Text variant="heading">Connection map</Text>
      {insights.reachedPeople.length > 0 ? (
        <View style={styles.people}>
          {insights.reachedPeople.map(({ person, count }) => (
            <Card key={person.id} style={styles.personRow}>
              <View style={styles.personInfo}>
                <Text variant="bodyStrong">{person.label}</Text>
                {person.relationship ? (
                  <Text variant="caption" tone="faint">
                    {person.relationship}
                  </Text>
                ) : null}
              </View>
              <Pill label={`${count} ${count === 1 ? 'reach' : 'reaches'}`} tone="accent" />
            </Card>
          ))}
        </View>
      ) : (
        <Text variant="callout" tone="faint" style={styles.empty}>
          People you reach will appear here as you complete actions.
        </Text>
      )}

      <Divider inset />

      <Text variant="heading">Recent reaches</Text>
      {data.actions.length > 0 ? (
        <View style={styles.people}>
          {data.actions.slice(0, 10).map((a) => (
            <Card key={a.id} style={styles.personRow}>
              <View style={styles.personInfo}>
                <Text variant="bodyStrong">{INTENT_LABELS[a.intent]}</Text>
                <Text variant="caption" tone="faint">
                  {personLabel(a.personId)}
                  {completionByAction.has(a.id) ? ` · ${formatDate(completionByAction.get(a.id)!)}` : ''}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      ) : (
        <Text variant="callout" tone="faint" style={styles.empty}>
          {hasHistory
            ? 'No completed reaches yet. Your next one will show here.'
            : 'Start a check-in to make your first reach.'}
        </Text>
      )}

      <Button
        label="Back to home"
        variant="ghost"
        onPress={() => router.replace('/home')}
        style={styles.back}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { marginTop: spacing.sm, marginBottom: spacing.xl },
  stats: { flexDirection: 'row', gap: spacing.md },
  stat: { flex: 1, alignItems: 'center', gap: spacing.xs },
  insightCard: { marginTop: spacing.lg, gap: spacing.xs },
  insightLine: { marginTop: spacing.xs },
  people: { gap: spacing.md, marginTop: spacing.md },
  personRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  personInfo: { flex: 1, gap: spacing.xs },
  empty: { marginTop: spacing.md },
  back: { marginTop: spacing.xl },
});
