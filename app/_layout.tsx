import { Stack } from "expo-router"
import { ThemeProvider } from '../src/contexts/ThemeContext'
import { AuthProvider } from '../src/contexts/AuthContext'
import { NotificationProvider } from '../src/contexts/NotificationContext'

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="candidate" />
            <Stack.Screen name="interviewer" />
            <Stack.Screen name="results" />
            <Stack.Screen name="create" />
            <Stack.Screen name="code" />
          </Stack>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
