import { useEffect } from 'react';
import { Share, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Screen, Text } from '@/components';
import { palette, radius, spacing, typography } from '@/theme';
import { useApp } from '@/store/AppStore';

/**
 * Editable message preparation. The app never sends anything automatically.
 * Share opens the user's own share sheet so they choose whether and where to send.
 */
export default function Prepare() {
  const router = useRouter();
  const { draft, updateDraftMessage } = useApp();
  const action = draft.action;

  useEffect(() => {
    if (!action) router.replace('/home');
  }, [action, router]);

  if (!action) return null;

  const onShare = async () => {
    try {
      await Share.share({ message: action.suggestedMessage });
    } catch {
      // User dismissed the share sheet. Nothing is sent by the app itself.
    }
  };

  return (
    <Screen
      footer={
        <View style={styles.footer}>
          <Button label="Mark as done" onPress={() => router.push('/complete')} />
          <Button
            label="Share with my apps"
            variant="secondary"
            onPress={onShare}
            accessibilityHint="Opens your own share options. Nothing is sent automatically."
          />
        </View>
      }
    >
      <Text variant="title">{action.title}</Text>
      <Text variant="body" tone="soft" style={styles.intro}>
        Here is a starting point. Make it yours. Change any word so it sounds like you.
      </Text>

      <Card style={styles.card}>
        <Text variant="caption" tone="faint">
          YOUR MESSAGE
        </Text>
        <TextInput
          value={action.suggestedMessage}
          onChangeText={updateDraftMessage}
          multiline
          style={styles.input}
          accessibilityLabel="Editable message draft"
        />
      </Card>

      <Card tone="calmTint" style={styles.reminderCard}>
        <Text variant="callout" tone="soft">
          One Good Reach never sends messages for you. You stay in control of every word and of when to reach out.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { marginTop: spacing.sm, marginBottom: spacing.xl },
  card: { gap: spacing.sm },
  input: {
    ...typography.body,
    color: palette.ink,
    backgroundColor: palette.cream,
    borderRadius: radius.sm,
    padding: spacing.lg,
    minHeight: 160,
    textAlignVertical: 'top',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.line,
  },
  reminderCard: { marginTop: spacing.lg },
  footer: { gap: spacing.sm },
});
