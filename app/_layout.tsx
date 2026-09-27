import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { palette } from '@/theme';
import { AppStoreProvider } from '@/store/AppStore';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStoreProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: palette.cream },
            animation: 'fade',
          }}
        />
      </AppStoreProvider>
    </SafeAreaProvider>
  );
}
