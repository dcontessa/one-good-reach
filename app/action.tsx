import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Divider, Pill, Screen, Text } from '@/components';
import { INTENT_LABELS } from '@/content/actions';
import { depletionLabel } from '@/domain';
import { palette, radius, spacing, typography } from '@/theme';
import { useApp } from '@/store/AppStore';

const AREA_LABEL = { soul: 'Soul', mind: 'Mind', body: 'Body' } as const;

export default function ActionCard() {
  const router = useRouter();
  const { draft, data, isPremium, addPerson, generateActionForDraft } = useApp();
  const [personId, setPersonId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState('');
  const [generating, setGenerating] = useState(false);

  const checkIn = draft.checkIn;

  // Guard: if there is no active check-in (for example after a reload), send home.
  useEffect(() => {
    if (!checkIn) router.replace('/home');
  }, [checkIn, router]);

  if (!checkIn) return null;

  const areaScore = checkIn[checkIn.depletedArea];

  const onGenerate = async () => {
    setGenerating(true);
    try {
      let selectedId = personId;
      let selectedLabel: string | undefined;
      if (!selectedId && newLabel.trim()) {
        selectedLabel = newLabel.trim();
        const person = await addPerson(selectedLabel);
        selectedId = person.id;
        setPersonId(person.id);
      }
      await generateActionForDraft(selectedId, selectedLabel);
    } finally {
      setGenerating(false);
    }
  };

  const action = draft.action;

  return (
    <Screen
      footer={
        action ? (
          <Button label="Prepare this reach" onPress={() => router.push('/prepare')} />
        ) : (
          <Button
            label="Suggest my action"
            onPress={onGenerate}
            loading={generating}
            accessibilityHint="Creates one small, editable suggestion"
          />
        )
      }
    >
      <Text variant="caption" tone="accent">
        TODAY
      </Text>
      <Text variant="title" style={styles.title}>
        Your {AREA_LABEL[checkIn.depletedArea]} feels {depletionLabel(areaScore)}
      </Text>
      <Text variant="body" tone="soft" style={styles.intro}>
        A small reach toward someone can help. Choose who this is about, or keep it open.
      </Text>

      {!action ? (
        <Card style={styles.card}>
          <Text variant="heading">Who comes to mind</Text>
          <Text variant="callout" tone="soft" style={styles.hint}>
            Optional. These are private labels you create, never your contacts.
          </Text>

          {data.persons.length > 0 ? (
            <View style={styles.people}>
              {data.persons.map((p) => {
                const selected = personId === p.id;
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => setPersonId(selected ? null : p.id)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    style={[styles.person, selected ? styles.personSelected : null]}
                  >
                    <Text variant="callout" tone={selected ? 'onAccent' : 'ink'}>
                      {p.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          <TextInput
            value={newLabel}
            onChangeText={setNewLabel}
            placeholder="Add a name or a nickname"
            placeholderTextColor={palette.inkFaint}
            style={styles.input}
            accessibilityLabel="Add a person label"
          />
        </Card>
      ) : (
        <Card tone="accentTint" style={styles.card}>
          <Pill label={INTENT_LABELS[action.intent]} tone="accent" />
          <Text variant="heading" style={styles.actionTitle}>
            {action.title}
          </Text>
          <Divider inset />
          <Text variant="caption" tone="faint">
            WHY THIS
          </Text>
          <Text variant="body" tone="soft" style={styles.rationale}>
            {action.rationale}
          </Text>
          {!isPremium ? (
            <Text variant="caption" tone="faint" style={styles.hint}>
              Premium unlocks personalized journeys and difficult-conversation preparation.
            </Text>
          ) : null}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.xs },
  intro: { marginTop: spacing.sm, marginBottom: spacing.xl },
  card: { gap: spacing.sm },
  hint: { marginTop: spacing.xs },
  people: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  person: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: palette.cream,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.line,
  },
  personSelected: { backgroundColor: palette.accent, borderColor: palette.accent },
  input: {
    ...typography.body,
    color: palette.ink,
    backgroundColor: palette.cream,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.line,
  },
  actionTitle: { marginTop: spacing.sm },
  rationale: { marginTop: spacing.xs },
});
