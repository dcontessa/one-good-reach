import { Redirect } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { palette } from '@/theme';
import { useApp } from '@/store/AppStore';

/**
 * Entry gate. Routes to the app home when a session exists, otherwise to
 * welcome. Shows a calm loading state while the session is restored.
 */
export default function Index() {
  const { status, user } = useApp();

  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={palette.accent} />
      </View>
    );
  }

  return <Redirect href={user ? '/home' : '/welcome'} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.cream },
});
