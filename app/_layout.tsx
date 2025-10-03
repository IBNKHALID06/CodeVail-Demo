import { ThemeProvider } from '../src/contexts/ThemeContext'
import { AuthProvider } from '../src/contexts/AuthContext'
import { NotificationProvider } from '../src/contexts/NotificationContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
